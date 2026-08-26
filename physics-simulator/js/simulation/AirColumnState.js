// 気柱振動のSimulation State（js/simulation/SimulationState.jsと対になる構造）。
//
// 気柱の「長さ方向の列」は、既存の js/simulation/Particle.js の
// createParticle(initialPosition) をそのまま再利用する。指示書§21「同じ縦列にある
// 粒子は、同じx方向変位を持つ」の通り、気柱の物理量は長さ方向xだけの1次元データで
// 表現できるため、新しいデータ構造を作らずPart icleモデルを流用している
// （断面方向に何個の粒子を描くか＝rowCountは、このあとRenderer側が同じ列データを
// 複数回描画するための表示専用の値であり、物理状態としては持たない）。
//
// 【開口端補正Δxによる延長区間（sourceEndExtension / farEndExtension）について】
// 開口端補正Δxがあるとき、変位の腹は管の物理的な開口部よりΔxだけ外側にできる
// （js/physics/acoustic/AirColumn.jsのコメント参照）。この「はみ出した部分」の
// 波形を腹の理論位置まで滑らかに描けるよう、気柱本体(columns、x∈[0,tubeLength])とは別に、
// 音源側の外側 x∈[-Δx, 0] と、両端開管の場合は反対側の外側 x∈[tubeLength, tubeLength+Δx] にも
// 変位を計算するための点列を持つ。閉口端は硬い壁で外側に振動しようがないため、
// 一端閉管の反対側にはfarEndExtensionを作らない（常に空配列）。
import { createParticle } from "./Particle.js";
import {
  AIR_COLUMN_AMPLITUDE_DEFAULT,
  AIR_COLUMN_COLUMN_COUNT_DEFAULT,
  AIR_COLUMN_END_EXTENSION_POINT_COUNT,
  BOUNDARY_TYPE_OPEN_OPEN,
  DEFAULT_BOUNDARY_TYPE,
  DEFAULT_END_CORRECTION,
  DEFAULT_MODE_NUMBER,
  DEFAULT_SOUND_SPEED,
  DEFAULT_TUBE_LENGTH,
  PARTICLE_ROW_COUNT,
} from "../utils/constants.js";

/**
 * 初期状態のAirColumnStateを作る。
 *
 * @param {Object} [options]
 * @param {number} [options.columnCount] - 長さ方向の列数
 * @param {number} [options.amplitude] - 振幅 A [m]
 * @param {number} [options.tubeLength] - 気柱の長さ L [m]
 * @param {number} [options.soundSpeed] - 音速 v [m/s]
 * @param {string} [options.boundaryType] - 'open-open' | 'open-closed'（x=Lの境界条件。
 *   x=0は指示書§15の絶対条件により常にこのモジュール内でも「開口」として扱い、選択肢にしない）
 * @param {number} [options.modeNumber] - 振動モード番号 n
 * @param {number} [options.rowCount] - 断面方向の表示用ドット数（物理量ではない）
 * @param {number} [options.endCorrection] - 開口端補正 Δx [m]（0のとき補正なし＝従来通り）
 * @returns {Object} AirColumnState
 *   time:               経過時刻 t [s]
 *   amplitude:          振幅 A [m]（気柱の枠を超えて描画されてよい。ここでclampしない）
 *   tubeLength:         気柱の長さ L [m]
 *   soundSpeed:         音速 v [m/s]
 *   boundaryType:       x=L側の境界条件
 *   modeNumber:         振動モード番号 n
 *   rowCount:           断面方向の表示用ドット数
 *   endCorrection:      開口端補正 Δx [m]
 *   columns:            Particleオブジェクトの配列（initialPositionが気柱内のx座標 [m]）
 *   sourceEndExtension: 音源側の開口端補正の延長区間（x∈[-Δx, 0]）のParticle配列
 *   farEndExtension:    反対側の開口端補正の延長区間（両端開管かつx∈[L, L+Δx]のときのみ、
 *                        それ以外は空配列）のParticle配列
 */
export function createAirColumnState({
  columnCount = AIR_COLUMN_COLUMN_COUNT_DEFAULT,
  amplitude = AIR_COLUMN_AMPLITUDE_DEFAULT,
  tubeLength = DEFAULT_TUBE_LENGTH,
  soundSpeed = DEFAULT_SOUND_SPEED,
  boundaryType = DEFAULT_BOUNDARY_TYPE,
  modeNumber = DEFAULT_MODE_NUMBER,
  rowCount = PARTICLE_ROW_COUNT,
  endCorrection = DEFAULT_END_CORRECTION,
} = {}) {
  const airColumnState = {
    time: 0,
    amplitude,
    tubeLength,
    soundSpeed,
    boundaryType,
    modeNumber,
    rowCount,
    endCorrection,
    columns: createColumns(columnCount, tubeLength),
    sourceEndExtension: [],
    farEndExtension: [],
  };
  rebuildEndExtensions(airColumnState);
  return airColumnState;
}

// 気柱の列を、x=0（音源側・開口端）からx=tubeLength（反対側の端）まで等間隔に配置する。
// 縦波のcreateParticles（SimulationState.js）と全く同じ考え方だが、対象がtubeLengthである
// 点だけが異なるため、あえて共通化はせずこのファイル内に留める
// （気柱固有の意味づけ＝「これは気柱内の位置である」というコメントを付けられるようにするため）。
function createColumns(columnCount, tubeLength) {
  const spacing = tubeLength / (columnCount - 1);
  const columns = [];
  for (let i = 0; i < columnCount; i += 1) {
    columns.push(createParticle(i * spacing));
  }
  return columns;
}

// startX〜endXの区間にcount個の点を等間隔に配置する（createColumnsの延長区間版）。
// startX===endX（＝Δx=0）のときは、全ての点が同じ位置に重なるだけで、
// 見た目には何も表示されない区間になる（＝これまでと同じ見た目に自然に一致する）。
function createExtensionColumns(startX, endX, count) {
  const points = [];
  for (let i = 0; i < count; i += 1) {
    const t = count === 1 ? 0 : i / (count - 1);
    points.push(createParticle(startX + (endX - startX) * t));
  }
  return points;
}

/**
 * 開口端補正Δxによる延長区間（sourceEndExtension / farEndExtension）を、
 * 現在のtubeLength・endCorrection・boundaryTypeに基づいて作り直す。
 * これらのパラメータのいずれかが変わったとき（気柱長・開口端補正・境界条件の変更時）に
 * 呼び出す必要がある。
 *
 * @param {Object} airColumnState - 対象のAirColumnState
 */
export function rebuildEndExtensions(airColumnState) {
  const { tubeLength, endCorrection, boundaryType } = airColumnState;
  airColumnState.sourceEndExtension = createExtensionColumns(
    -endCorrection,
    0,
    AIR_COLUMN_END_EXTENSION_POINT_COUNT
  );
  // 閉口端は硬い壁なので補正されない。反対側が開口（両端開管）のときだけ延長区間を作る。
  airColumnState.farEndExtension =
    boundaryType === BOUNDARY_TYPE_OPEN_OPEN
      ? createExtensionColumns(tubeLength, tubeLength + endCorrection, AIR_COLUMN_END_EXTENSION_POINT_COUNT)
      : [];
}

/**
 * 気柱振動をリセットする（時刻を0に戻し、列を初期配置に作り直す）。
 * amplitude・tubeLength・boundaryType・modeNumber等のパラメータは変更しない。
 *
 * @param {Object} airColumnState - リセット対象のAirColumnState
 */
export function resetAirColumnColumns(airColumnState) {
  const columnCount = airColumnState.columns.length;
  airColumnState.columns = createColumns(columnCount, airColumnState.tubeLength);
  airColumnState.time = 0;
}

/**
 * 列数（縦波のresizeParticlesに相当）だけを変更する。時刻は保持する
 * （指示書§9-2の考え方を気柱振動にも適用：粒子数変更に副作用を持たせない）。
 *
 * @param {Object} airColumnState - 対象のAirColumnState
 * @param {number} newColumnCount - 変更後の列数
 */
export function resizeAirColumnColumns(airColumnState, newColumnCount) {
  airColumnState.columns = createColumns(newColumnCount, airColumnState.tubeLength);
}
