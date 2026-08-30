// 気柱振動の物理エンジン（Physics Layer）。
//
// 役割：気柱の両端それぞれの種類（開口/閉口）に応じて波数k・固有振動数f_n・
// 空間分布（cos(kx)かsin(kx)か）を決定し、その結果をStandingWave.js（physics/wave/）の
// 定常波の式に渡して変位・粒子速度を求める。気柱固有の近似式をここで新たに作ることは
// しない（REQ-105の精神：気柱の粒子表示・波形表示・矢印表示は、すべてこのファイルが
// 返す同じ変位関数の計算結果だけを使う）。
//
// 【両端の種類から固有値条件・空間分布を導く一般化について】
// 以前は「音源側(x=0)は常に開口」という絶対条件があったが、音源側も開口/閉口を
// 選べるようにしたことで、開口/閉口の組み合わせは4通り（開口-開口・開口-閉口・
// 閉口-開口・閉口-閉口）になった。これは実は次の2つの独立した軸に分解できる
// （u1=(A/2)sin(kx-ωt+φ), u2=(A/2)sin(kx+ωt+φ)の重ね合わせで、
//   sinP+sinQ=2sin((P+Q)/2)cos((P-Q)/2) を適用すると
//   u=u1+u2=A sin(kx+φ)cos(ωt) となり、これを境界条件に当てはめて検証済み）：
//
//   1. 固有値条件（kLの決まり方）は、両端の種類が「一致するか」だけで決まる：
//      - 一致（開口-開口 or 閉口-閉口）→ kL=nπ （OpenOpenTube.jsの式）
//      - 不一致（開口-閉口 or 閉口-開口）→ kL=(2n-1)π/2 （OpenClosedTube.jsの式）
//   2. 空間分布（cos(kx)かsin(kx)か）は、音源側(x=0)だけで決まる：
//      - 音源側が開口（x=0が腹）→ cos(kx)（上のφ=π/2に相当）
//      - 音源側が閉口（x=0が節）→ sin(kx)（上のφ=0に相当）
//
// 【開口端補正（end correction）Δx について（endCorrectionパラメータ）】
// 実際の気柱では、開口端の少し外側の空気も管内の空気と一緒に振動するため、
// 「変位の腹」は開口部ちょうどではなく、そこから距離Δxだけ外側にできる。
// 閉口端は硬い壁なので補正を受けない。したがって実効長L_effは、
//   L_eff = L + (開口端の本数: 0, 1, 2のいずれか) × Δx
// となる（開口端の本数は両端の種類の組み合わせで変わるため、この計算は
// OpenOpenTube.js/OpenClosedTube.js側ではなく、ここAirColumn.js側に集約する）。
// 変位の空間分布についても、音源側(x=0)が開口のときだけ、cos(kx)やsin(kx)の
// 引数にx+Δxを渡すことで、「腹の位置が開口部よりΔxだけ外側にずれている」ことを表現する
// （音源側が閉口のときはシフトしない。閉口端はΔxによらずu=0が厳密に成り立たなければ
// ならず、シフトしてしまうとその厳密さが崩れてしまうため。詳細はcalculateSpatialShift
// 関数のコメント参照）。反対側(x=L)が開口のときは、シフトしない状態のまま
// 「Δx>0だと物理的な端での振幅がAよりわずかに小さくなる」という近似が現れる。

import {
  calculateStandingWaveDisplacement,
  calculateStandingWaveParticleVelocity,
} from "../wave/StandingWave.js";
import * as SameEndTube from "./OpenOpenTube.js";
import * as DifferentEndTube from "./OpenClosedTube.js";
import { AIR_COLUMN_END_CLOSED, AIR_COLUMN_END_OPEN } from "../../utils/constants.js";

// sourceEndType・farEndTypeの組み合わせから、対応する境界条件モジュールを選ぶ。
// 両端の種類が一致するかどうかだけで決まる（ファイル上部のコメント参照）。
function selectTubeModule(sourceEndType, farEndType) {
  return sourceEndType === farEndType ? SameEndTube : DifferentEndTube;
}

// 開口端の本数（0・1・2）を数える。
function countOpenEnds(sourceEndType, farEndType) {
  const sourceIsOpen = sourceEndType === AIR_COLUMN_END_OPEN ? 1 : 0;
  const farIsOpen = farEndType === AIR_COLUMN_END_OPEN ? 1 : 0;
  return sourceIsOpen + farIsOpen;
}

// 開口端の本数に応じた実効長L_effを求める（開口端補正Δxは開口端1本につき1回分効く）。
function calculateEffectiveLength(tubeLength, sourceEndType, farEndType, endCorrection) {
  return tubeLength + countOpenEnds(sourceEndType, farEndType) * endCorrection;
}

// 変位の空間分布(cos(kx)またはsin(kx))に渡す前に、xへ加える座標シフト量を求める。
//
// 【なぜ音源側(x=0)が開口のときだけシフトするのか】
// 開口端補正は「開口端の少し外側の空気も一緒に振動するため、真の腹の位置は
// 開口部よりΔxだけ外側にできる」という効果であり、閉口端（硬い壁）には一切効かない。
// 音源側が開口なら、真の腹はx=-Δxの位置にある。空間分布の原点（x=0でcos=1、
// またはx=0でsin=0）をこの「真の腹（または真の節）」に合わせて評価するため、
// 実際に渡すxの値を+Δxだけシフトする（x=-Δxにあった真の腹が、シフト後は
// 引数0のところに来る）。
// 音源側が閉口なら、x=0そのものが真の節であり、シフトする理由がない
// （シフトしてしまうと、閉口端であるx=0でu=0が厳密に成り立たなくなってしまう）。
// 反対側(x=L)が開口か閉口かは、この音源側のシフト量には影響しない
// （反対側が開口のとき、そちら側は「シフトなし」のまま近似的な腹になるだけで、
// これは他の開口端補正と同じ「Δx>0だと物理的な端での振幅がAよりわずかに
// 小さくなる」という許容される近似の一部である）。
function calculateSpatialShift(sourceEndType, endCorrection) {
  return sourceEndType === AIR_COLUMN_END_OPEN ? endCorrection : 0;
}

/**
 * 気柱の両端の種類・モード番号・気柱長・開口端補正から波数kを求める。
 *
 * @param {string} sourceEndType - AIR_COLUMN_END_OPEN | AIR_COLUMN_END_CLOSED（x=0側）
 * @param {string} farEndType - AIR_COLUMN_END_OPEN | AIR_COLUMN_END_CLOSED（x=L側）
 * @param {number} modeNumber - モード番号 n
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 波数 k [rad/m]
 */
export function calculateWaveNumber(sourceEndType, farEndType, modeNumber, tubeLength, endCorrection = 0) {
  const effectiveLength = calculateEffectiveLength(tubeLength, sourceEndType, farEndType, endCorrection);
  return selectTubeModule(sourceEndType, farEndType).calculateWaveNumberForMode(modeNumber, effectiveLength);
}

/**
 * 気柱の両端の種類・モード番号・気柱長・音速・開口端補正から固有振動数f_nを求める。
 *
 * @param {string} sourceEndType
 * @param {string} farEndType
 * @param {number} modeNumber
 * @param {number} soundSpeed - 音速 v [m/s]
 * @param {number} tubeLength - 気柱の長さ L [m]
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 固有振動数 f_n [Hz]
 */
export function calculateEigenfrequency(
  sourceEndType,
  farEndType,
  modeNumber,
  soundSpeed,
  tubeLength,
  endCorrection = 0
) {
  const effectiveLength = calculateEffectiveLength(tubeLength, sourceEndType, farEndType, endCorrection);
  return selectTubeModule(sourceEndType, farEndType).calculateEigenfrequency(
    modeNumber,
    soundSpeed,
    effectiveLength
  );
}

/**
 * 気柱の両端の種類・モード番号・気柱長・音速・開口端補正から角周波数ωを求める。
 *
 * 物理式: ω = 2π f_n
 *
 * @param {string} sourceEndType
 * @param {string} farEndType
 * @param {number} modeNumber
 * @param {number} soundSpeed
 * @param {number} tubeLength
 * @param {number} [endCorrection=0] - 開口端補正 Δx [m]
 * @returns {number} 角周波数 ω [rad/s]
 */
export function calculateAngularFrequency(
  sourceEndType,
  farEndType,
  modeNumber,
  soundSpeed,
  tubeLength,
  endCorrection = 0
) {
  return (
    2 *
    Math.PI *
    calculateEigenfrequency(sourceEndType, farEndType, modeNumber, soundSpeed, tubeLength, endCorrection)
  );
}

/**
 * 位置x、時刻tにおける気柱内の変位u(x,t)を求める。
 *
 * 波数k・角周波数ω・空間分布（cos/sin）を両端の種類から決定したうえで、
 * 実際の変位の式自体はStandingWave.calculateStandingWaveDisplacement
 * （定常波の一般式）に委譲する。ただし、音源側(x=0)が開口のときだけ、位置xを
 * そのまま渡すのではなく x+Δx を渡す（calculateSpatialShiftのコメント参照。
 * 音源側が閉口のときにシフトしてしまうと、x=0で厳密にu=0となるべき節条件が
 * 崩れてしまうため、シフトは音源側が開口のときだけ行う）。
 *
 * @param {number} x - 気柱内の位置 [m]（x=0が上端）
 * @param {number} t - 時刻 [s]
 * @param {{amplitude:number, sourceEndType:string, farEndType:string, modeNumber:number, soundSpeed:number, tubeLength:number, endCorrection?:number}} parameters
 * @returns {number} 変位 u [m]
 */
export function calculateDisplacement(
  x,
  t,
  { amplitude, sourceEndType, farEndType, modeNumber, soundSpeed, tubeLength, endCorrection = 0 }
) {
  const waveNumber = calculateWaveNumber(sourceEndType, farEndType, modeNumber, tubeLength, endCorrection);
  const angularFrequency = calculateAngularFrequency(
    sourceEndType,
    farEndType,
    modeNumber,
    soundSpeed,
    tubeLength,
    endCorrection
  );
  const hasNodeAtOrigin = sourceEndType === AIR_COLUMN_END_CLOSED;
  const spatialShift = calculateSpatialShift(sourceEndType, endCorrection);
  return calculateStandingWaveDisplacement(x + spatialShift, t, {
    amplitude,
    waveNumber,
    angularFrequency,
    hasNodeAtOrigin,
  });
}

/**
 * 位置x、時刻tにおける気柱内の粒子速度v_p(x,t)を求める。
 *
 * @param {number} x
 * @param {number} t
 * @param {{amplitude:number, sourceEndType:string, farEndType:string, modeNumber:number, soundSpeed:number, tubeLength:number, endCorrection?:number}} parameters
 * @returns {number} 粒子速度 v_p [m/s]
 */
export function calculateParticleVelocity(
  x,
  t,
  { amplitude, sourceEndType, farEndType, modeNumber, soundSpeed, tubeLength, endCorrection = 0 }
) {
  const waveNumber = calculateWaveNumber(sourceEndType, farEndType, modeNumber, tubeLength, endCorrection);
  const angularFrequency = calculateAngularFrequency(
    sourceEndType,
    farEndType,
    modeNumber,
    soundSpeed,
    tubeLength,
    endCorrection
  );
  const hasNodeAtOrigin = sourceEndType === AIR_COLUMN_END_CLOSED;
  const spatialShift = calculateSpatialShift(sourceEndType, endCorrection);
  return calculateStandingWaveParticleVelocity(x + spatialShift, t, {
    amplitude,
    waveNumber,
    angularFrequency,
    hasNodeAtOrigin,
  });
}
