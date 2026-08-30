// 横波（定常波）モードのSimulation State（js/simulation/SimulationState.jsと対になる構造）。
//
// このモードは粒子を表示しない（ユーザー要望）。表示するのは
//   右向き波（入射波） u1
//   左向き波（右端での反射波） u2
//   合成波 u = u1 + u2
// という3本の変位曲線だけなので、js/simulation/Particle.jsの
// {initialPosition, position, displacement, velocity} という粒子用のデータ形は使わず、
// 1つのx0に対して3つの変位値を持つ専用の点データ（createWavePoint）を使う。
import {
  DEFAULT_AMPLITUDE,
  DEFAULT_COMBINED_OPACITY,
  DEFAULT_END_TYPE,
  DEFAULT_FREQUENCY,
  DEFAULT_INCIDENT_OPACITY,
  DEFAULT_REFLECTED_OPACITY,
  DEFAULT_SOUND_SPEED,
  DEFAULT_TRANSVERSE_MEDIUM_LENGTH,
  DEFAULT_WAVELENGTH,
  TRANSVERSE_WAVE_POINT_COUNT,
} from "../utils/constants.js";

// x0[m]での波形上の1点。initialPositionだけがこの点の「位置」であり、
// incident/reflected/combinedの3つの変位はSimulation層(TransverseWaveSimulation.js)が
// 毎フレーム計算して書き込む（Rendererはこれを読むだけで再計算しない、REQ-105の精神）。
function createWavePoint(initialPosition) {
  return {
    initialPosition,
    incidentDisplacement: 0,
    reflectedDisplacement: 0,
    combinedDisplacement: 0,
  };
}

// x0∈[0, mediumLength]にpointCount個の点を等間隔に配置する。
function createPoints(pointCount, mediumLength) {
  const spacing = mediumLength / (pointCount - 1);
  const points = [];
  for (let i = 0; i < pointCount; i += 1) {
    points.push(createWavePoint(i * spacing));
  }
  return points;
}

/**
 * 初期状態のTransverseWaveStateを作る。
 *
 * @param {Object} [options]
 * @param {number} [options.amplitude] - 振幅 A [m]（入射波・反射波はA/2、合成波はおおよそA）
 * @param {number} [options.wavelength] - 波長 λ [m]
 * @param {number} [options.frequency] - 周波数 f [Hz]
 * @param {number} [options.mediumLength] - 媒質（弦）の長さ L [m]
 * @param {string} [options.endType] - 右端(x=L)の境界の種類。'fixed' | 'free'
 *   （左端(x=0)は振動源であり境界条件を持たないため、パラメータとして存在しない）
 * @param {number} [options.incidentOpacity] - 右向き波（入射波）の透明度 [%, 0-100]
 * @param {number} [options.reflectedOpacity] - 左向き波（反射波）の透明度 [%, 0-100]
 * @param {number} [options.combinedOpacity] - 合成波の透明度 [%, 0-100]
 * @returns {Object} TransverseWaveState
 */
export function createTransverseWaveState({
  amplitude = DEFAULT_AMPLITUDE,
  wavelength = DEFAULT_WAVELENGTH,
  frequency = DEFAULT_FREQUENCY,
  mediumLength = DEFAULT_TRANSVERSE_MEDIUM_LENGTH,
  endType = DEFAULT_END_TYPE,
  incidentOpacity = DEFAULT_INCIDENT_OPACITY,
  reflectedOpacity = DEFAULT_REFLECTED_OPACITY,
  combinedOpacity = DEFAULT_COMBINED_OPACITY,
} = {}) {
  return {
    time: 0,
    amplitude,
    wavelength,
    frequency,
    mediumLength,
    endType,
    // v固定機能：js/simulation/SimulationState.jsと同じ設計（指示書「v,f,λの設定方法は
    // 縦波と同様」に従い、同じ考え方を流用する）。
    waveSpeedFixed: false,
    fixedWaveSpeed: DEFAULT_SOUND_SPEED,
    incidentOpacity,
    reflectedOpacity,
    combinedOpacity,
    points: createPoints(TRANSVERSE_WAVE_POINT_COUNT, mediumLength),
  };
}

/**
 * 媒質の長さ(mediumLength)が変わったときに、点の配置を作り直す。
 * 時刻(time)や他のパラメータは変更しない。
 *
 * @param {Object} transverseWaveState - 対象のTransverseWaveState
 */
export function rebuildTransverseWavePoints(transverseWaveState) {
  transverseWaveState.points = createPoints(TRANSVERSE_WAVE_POINT_COUNT, transverseWaveState.mediumLength);
}

/**
 * 横波シミュレーションをリセットする（時刻を0に戻す）。
 * パラメータ自体は変更しない（js/simulation/SimulationState.jsのresetSimulationParticlesと同じ考え方）。
 *
 * @param {Object} transverseWaveState - リセット対象のTransverseWaveState
 */
export function resetTransverseWave(transverseWaveState) {
  transverseWaveState.time = 0;
}
