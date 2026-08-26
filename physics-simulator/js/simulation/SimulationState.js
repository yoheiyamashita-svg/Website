// Simulation State：アプリケーション全体で唯一の「物理的な状態」を保持するオブジェクト
// （architecture.md §5）。UI・Renderer・PhysicsEngineは全員このオブジェクトを介して
// 情報をやり取りし、それぞれが独自にコピーを持たない（単一の真実源）。
import { createParticle } from "./Particle.js";
import {
  DEFAULT_AMPLITUDE,
  DEFAULT_FREQUENCY,
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_PHASE,
  DEFAULT_SOUND_SPEED,
  DEFAULT_WAVELENGTH,
  MEDIUM_LENGTH,
} from "../utils/constants.js";

/**
 * 初期状態のSimulationStateを作る。
 *
 * JavaScript構文メモ：引数を `{ particleCount = ..., amplitude = ..., } = {}` の形で
 * 受け取っているのは「デフォルト値付きの分割代入」。呼び出し側が
 * createSimulationState() のように引数を省略しても、それぞれのデフォルト定数が使われる。
 *
 * @param {Object} [options]
 * @param {number} [options.particleCount] - 粒子数
 * @param {number} [options.amplitude] - 振幅 A [m]
 * @param {number} [options.wavelength] - 波長 λ [m]
 * @param {number} [options.frequency] - 周波数 f [Hz]
 * @param {number} [options.phase] - 初期位相 φ [rad]
 * @param {number} [options.mediumLength] - 媒質の全長 [m]
 * @returns {Object} SimulationState
 *   time:            経過時刻 t [s]
 *   amplitude:       振幅 A [m]
 *   wavelength:      波長 λ [m]
 *   frequency:       周波数 f [Hz]
 *   phase:           初期位相 φ [rad]
 *   mediumLength:    媒質の全長 [m]
 *   waveSpeedFixed:  波速vを固定するモードかどうか（REQ-11 §7-8「v固定」機能）
 *   fixedWaveSpeed:  固定時の波速 v [m/s]（waveSpeedFixedがtrueのときだけ使う）
 *   particles:       Particleオブジェクトの配列
 */
export function createSimulationState({
  particleCount = DEFAULT_PARTICLE_COUNT,
  amplitude = DEFAULT_AMPLITUDE,
  wavelength = DEFAULT_WAVELENGTH,
  frequency = DEFAULT_FREQUENCY,
  phase = DEFAULT_PHASE,
  mediumLength = MEDIUM_LENGTH,
} = {}) {
  return {
    time: 0,
    amplitude,
    wavelength,
    frequency,
    phase,
    mediumLength,
    // v固定機能：OFFがデフォルト（従来どおりλ, fが独立操作値、v=fλは表示のみ）。
    waveSpeedFixed: false,
    fixedWaveSpeed: DEFAULT_SOUND_SPEED,
    particles: createParticles(particleCount, mediumLength),
  };
}

// 粒子をmediumLength[m]の範囲に等間隔(spacing[m])で配置する。
// physics.md §3: 初期位置 x0_i = i × Δx （i = 0, 1, ..., N-1）
function createParticles(particleCount, mediumLength) {
  const spacing = mediumLength / (particleCount - 1);
  const particles = [];
  for (let i = 0; i < particleCount; i += 1) {
    particles.push(createParticle(i * spacing));
  }
  return particles;
}

/**
 * シミュレーションをリセットする（REQ: 再生制御「リセット」）。
 * 時刻を0に戻し、粒子を初期配置に作り直す。
 * 振幅・波長・周波数などのパラメータ自体は変更しない
 * （リセットは「時間経過を巻き戻す」操作であり、パラメータ設定はユーザーがスライダーで
 * 決めた値のまま維持するのが自然なため）。
 *
 * @param {Object} simulationState - リセット対象のSimulationState
 */
export function resetSimulationParticles(simulationState) {
  const particleCount = simulationState.particles.length;
  simulationState.particles = createParticles(particleCount, simulationState.mediumLength);
  simulationState.time = 0;
}

/**
 * 粒子数だけを変更する（指示書§9-2：粒子数変更は時刻・モード等に副作用を与えない）。
 *
 * resetSimulationParticlesとの違い：resetは「時間を巻き戻す」操作なのでtime=0にするが、
 * こちらは「表示の粒度を変える」操作なので、time（したがって現在の振動状態）は
 * そのまま維持し、新しい個数の粒子を今の時刻に対応する変位で作り直す
 * （呼び出し側でこの後updateParticlesを呼ぶことを前提とする）。
 *
 * @param {Object} simulationState - 対象のSimulationState
 * @param {number} newParticleCount - 変更後の粒子数
 */
export function resizeParticles(simulationState, newParticleCount) {
  simulationState.particles = createParticles(newParticleCount, simulationState.mediumLength);
}
