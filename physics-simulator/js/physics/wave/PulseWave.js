// 横波の反射（パルス）モードの物理エンジン（Physics Layer）。
//
// 「横波（定常波）」タブ（js/physics/wave/TravelingWave.js・ReflectedWave.js）は
// 無限に続く正弦波の入射波・反射波を重ね合わせて定常波を作るが、このタブは
// 局所的なパルス（山1つ、またはS字型）が右端(x=L)に向かって進み、反射して
// 戻ってくる様子そのものを見せることを目的とする。物理モデルは以下の2つの部分からなる。
//
// 【パルスの形（profile）について】
// パルスの形は、ある位置sを中心に幅wの範囲だけ0でない値を持つ関数として定義する
// （|s|>=wでは常に0＝媒質は静止している）。
//   bumpProfile(s,w)：滑らかな山1つ。0.5(1+cos(πs/w))というraised cosine形。
//     s=0で最大値1、s=±wで滑らかに0へ収束する（傾きも0になるため、
//     パルスの端が媒質の静止部分と滑らかにつながる）。
//   sProfile(s,w)：山と谷が対になったS字型。sin(πs/w)にbumpProfileと同じ
//     envelope(減衰関数)を掛けたもの。sin(πs/w)はs=-w,0,wで0になり、
//     s<0で負(谷)・s>0で正(山)となる、通常のサイン波1周期分の形。
//     envelopeを掛けることで、s=±wでの傾きも0になり滑らかに繋がる。
//
// 【入射波・反射波の重ね合わせ（鏡像法）について】
// 入射波 u1(x,t) = A・profile(x - v t - x0, w) は、時刻tでの中心位置が
// x = x0 + v t となる、+x方向（音源→右端）に進むパルス。x0は「パルスを送る」
// 操作をした瞬間(t=0)でのパルス中心の初期位置で、媒質の外側（x<0）から
// 出発させることで、t=0の時点では媒質内(x∈[0,L])にパルスが存在しない状態から
// スタートできる（calculateLaunchOffsetのコメント参照）。
//
// 反射波 u2(x,t) = ε・A・profile(2L - x - v t - x0, w) は、x=Lを軸として
// u1を鏡映（x→2L-x）した形。εは境界の種類で決まる符号（+1:自由端 / -1:固定端）。
// この形にする理由は、js/physics/wave/ReflectedWave.jsの正弦波版と全く同じ発想
// （x=Lでの境界条件を、u1・u2の重ね合わせだけで自動的に満たす鏡像法）だが、
// ここではx=Lでの代入によって次の関係が常に成り立つことを使う：
//   u1(L,t) = A・profile(L - vt - x0, w)
//   u2(L,t) = ε・A・profile(2L - L - vt - x0, w) = ε・A・profile(L - vt - x0, w)
// すなわちu1(L,t)とprofileの中身が完全に同じになるため、u2(L,t) = ε・u1(L,t)。
//   固定端(ε=-1)：u(L,t) = u1(L,t) + u2(L,t) = (1-1)・u1(L,t) = 0 （厳密に節）
//   自由端(ε=+1)：∂u/∂x|_{x=L} も同様の代入により (1-1)・(傾きの項) = 0 になる
//     （∂u2/∂x = -ε・A・profile'(...)であり、x=Lでは∂u1/∂xとちょうど符号が
//      逆になるため、ε=+1のとき打ち消し合って傾き0＝腹になる）。
// この打ち消し・強め合いは、profileの具体的な形（bump/S字どちらか）や
// x0の値によらず常に成り立つ（数値検証済み）。

import { PULSE_SHAPE_BUMP } from "../../utils/constants.js";

// パルスの山1つの形（raised cosine）。
function bumpProfile(s, pulseWidth) {
  if (Math.abs(s) >= pulseWidth) {
    return 0;
  }
  return 0.5 * (1 + Math.cos((Math.PI * s) / pulseWidth));
}

// パルスのS字型（山と谷が対になった、サイン波1周期分の形）。
function sProfile(s, pulseWidth) {
  if (Math.abs(s) >= pulseWidth) {
    return 0;
  }
  const envelope = 0.5 * (1 + Math.cos((Math.PI * s) / pulseWidth));
  return Math.sin((Math.PI * s) / pulseWidth) * envelope;
}

// shape（PULSE_SHAPE_BUMP | PULSE_SHAPE_S）に応じて、使うprofile関数を選ぶ。
function evaluateProfile(shape, s, pulseWidth) {
  return shape === PULSE_SHAPE_BUMP ? bumpProfile(s, pulseWidth) : sProfile(s, pulseWidth);
}

/**
 * パルスの初期中心位置（t=0のときの位置）を求める。
 *
 * 媒質(x∈[0,L])の外側、少し左（x<0）から出発させることで、「パルスを送る」操作を
 * した瞬間には媒質内にパルスがまだ存在しない状態から始められるようにする。
 * 係数1.5は「パルスの半値幅wの1.5倍だけ左に置けば、profile関数の裾野
 * (|s|>=wで0)も含めて確実にx=0より左に収まる」という表示上の余裕であり、
 * 物理的な意味を持つ量ではない。
 *
 * @param {number} pulseWidth - パルスの半値幅 w [m]
 * @returns {number} 初期中心位置 x0 [m]（負の値）
 */
export function calculateLaunchOffset(pulseWidth) {
  return -1.5 * pulseWidth;
}

/**
 * 1往復（送り出しから反射後に媒質の外に出るまで）にかかる時間の目安を求める。
 * 自動ループ再生（js/simulation/PulseReflectionSimulation.js参照）で、
 * この時間が経過したら時刻を0に戻して次のパルスを送り出すために使う。
 *
 * 内訳：x0から x=0 まで進む距離(entryDistance) + 媒質を往復する距離(2×L) +
 * 反射波が完全にx=0より左へ抜けきるまでの余裕(2w)。
 *
 * @param {{pulseWidth:number, mediumLength:number, waveSpeed:number}} parameters
 * @returns {number} 1往復にかかる時間の目安 [s]
 */
export function calculateLoopDuration({ pulseWidth, mediumLength, waveSpeed }) {
  const entryDistance = -calculateLaunchOffset(pulseWidth);
  const exitMargin = 2 * pulseWidth;
  const totalDistance = entryDistance + 2 * mediumLength + exitMargin;
  return totalDistance / waveSpeed;
}

/**
 * 位置x、時刻tにおける入射波（+x方向に進むパルス）の変位u1を求める。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude:number, pulseWidth:number, waveSpeed:number, shape:string}} parameters
 * @returns {number} 変位 u1 [m]
 */
export function calculateIncidentDisplacement(x, t, { amplitude, pulseWidth, waveSpeed, shape }) {
  const launchOffset = calculateLaunchOffset(pulseWidth);
  return amplitude * evaluateProfile(shape, x - waveSpeed * t - launchOffset, pulseWidth);
}

/**
 * 位置x、時刻tにおける反射波（右端で反射して-x方向に戻るパルス）の変位u2を求める。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude:number, pulseWidth:number, waveSpeed:number, mediumLength:number, isFixedEnd:boolean, shape:string}} parameters
 * @returns {number} 変位 u2 [m]
 */
export function calculateReflectedDisplacement(
  x,
  t,
  { amplitude, pulseWidth, waveSpeed, mediumLength, isFixedEnd, shape }
) {
  const launchOffset = calculateLaunchOffset(pulseWidth);
  const sign = isFixedEnd ? -1 : 1;
  return (
    sign *
    amplitude *
    evaluateProfile(shape, 2 * mediumLength - x - waveSpeed * t - launchOffset, pulseWidth)
  );
}
