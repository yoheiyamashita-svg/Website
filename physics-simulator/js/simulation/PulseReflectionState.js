// 横波の反射（パルス）モードのSimulation State（js/simulation/TransverseWaveState.jsと対になる構造）。
//
// このモードも粒子を表示せず、
//   入射波 u1（右向きに進むパルス）
//   反射波 u2（右端で反射して戻るパルス）
//   合成波 u = u1 + u2
// という3本の変位曲線を表示する。TransverseWaveState.jsと同じ理由で、
// js/simulation/Particle.jsの粒子用データ形は使わず、専用の点データを使う。
import {
  DEFAULT_AMPLITUDE,
  DEFAULT_COMBINED_OPACITY,
  DEFAULT_END_TYPE,
  DEFAULT_INCIDENT_OPACITY,
  DEFAULT_PULSE_MEDIUM_LENGTH,
  DEFAULT_PULSE_SHAPE,
  DEFAULT_PULSE_WAVE_SPEED,
  DEFAULT_PULSE_WIDTH,
  DEFAULT_REFLECTED_OPACITY,
  TRANSVERSE_WAVE_POINT_COUNT,
} from "../utils/constants.js";

// x0[m]での波形上の1点。TransverseWaveState.jsのcreateWavePointと同じ考え方
// （Simulation層が毎フレーム計算して書き込み、Rendererは読むだけ）。
function createWavePoint(initialPosition) {
  return {
    initialPosition,
    incidentDisplacement: 0,
    reflectedDisplacement: 0,
    combinedDisplacement: 0,
  };
}

function createPoints(pointCount, mediumLength) {
  const spacing = mediumLength / (pointCount - 1);
  const points = [];
  for (let i = 0; i < pointCount; i += 1) {
    points.push(createWavePoint(i * spacing));
  }
  return points;
}

/**
 * 初期状態のPulseReflectionStateを作る。
 *
 * @param {Object} [options]
 * @param {number} [options.amplitude] - 振幅 A [m]
 * @param {number} [options.pulseWidth] - パルスの半値幅 w [m]
 * @param {number} [options.waveSpeed] - パルスの伝わる速さ v [m/s]
 * @param {number} [options.mediumLength] - 媒質（弦）の長さ L [m]
 * @param {string} [options.endType] - 右端(x=L)の境界の種類。'fixed' | 'free'
 * @param {string} [options.shape] - パルスの形。'bump' | 's'
 * @param {number} [options.incidentOpacity] - 入射波の透明度 [%, 0-100]
 * @param {number} [options.reflectedOpacity] - 反射波の透明度 [%, 0-100]
 * @param {number} [options.combinedOpacity] - 合成波の透明度 [%, 0-100]
 * @returns {Object} PulseReflectionState
 */
export function createPulseReflectionState({
  amplitude = DEFAULT_AMPLITUDE,
  pulseWidth = DEFAULT_PULSE_WIDTH,
  waveSpeed = DEFAULT_PULSE_WAVE_SPEED,
  mediumLength = DEFAULT_PULSE_MEDIUM_LENGTH,
  endType = DEFAULT_END_TYPE,
  shape = DEFAULT_PULSE_SHAPE,
  incidentOpacity = DEFAULT_INCIDENT_OPACITY,
  reflectedOpacity = DEFAULT_REFLECTED_OPACITY,
  combinedOpacity = DEFAULT_COMBINED_OPACITY,
} = {}) {
  return {
    time: 0,
    amplitude,
    pulseWidth,
    waveSpeed,
    mediumLength,
    endType,
    shape,
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
 * @param {Object} pulseReflectionState - 対象のPulseReflectionState
 */
export function rebuildPulseReflectionPoints(pulseReflectionState) {
  pulseReflectionState.points = createPoints(
    TRANSVERSE_WAVE_POINT_COUNT,
    pulseReflectionState.mediumLength
  );
}

/**
 * パルスを送り直す（時刻を0に戻す）。「パルスを送る」ボタンと、
 * 1往復し終えたときの自動ループ再生（js/simulation/PulseReflectionSimulation.js）の
 * 両方から呼ばれる。
 *
 * @param {Object} pulseReflectionState - リセット対象のPulseReflectionState
 */
export function resetPulseReflection(pulseReflectionState) {
  pulseReflectionState.time = 0;
}
