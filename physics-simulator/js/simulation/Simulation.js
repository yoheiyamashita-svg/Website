// Simulation Layer：SimulationStateのparticles配列を、Physics Engine
// （TravelingWave / LongitudinalWave）を呼び出して更新するオーケストレーション層。
//
// REQ-105（粒子位置と波形は同一の変位関数から導出する）を実装として保証する場所。
// ここで particle.displacement に書き込んだ値を、Renderer（js/renderer以下）は
// 読み取るだけで、二度と物理式を計算し直さない。

import { calculateDisplacement } from "../physics/wave/TravelingWave.js";
import { calculateParticleVelocity } from "../physics/wave/LongitudinalWave.js";

/**
 * 現在のsimulationState.time（時刻t）に基づいて、全粒子の
 * displacement・position・velocityを再計算する。
 *
 * JavaScript構文メモ：`for...of`は配列の各要素を1つずつ取り出して処理する構文。
 * ここでは配列のインデックスは不要で、各Particleオブジェクトそのものだけが必要なので使っている。
 *
 * @param {Object} simulationState - 更新対象のSimulationState（このオブジェクトを直接書き換える）
 */
export function updateParticles(simulationState) {
  const { amplitude, wavelength, frequency, phase, time, particles } = simulationState;
  // Physics Engineの関数は「純粋な物理パラメータ」だけを受け取る設計にしているため、
  // SimulationStateから必要な値だけを1つのオブジェクトにまとめて渡す。
  const parameters = { amplitude, wavelength, frequency, phase };

  for (const particle of particles) {
    // 変位 u(x0, t)。粒子表示にも波形表示にも、この1箇所で計算した値だけを使う（REQ-105）。
    particle.displacement = calculateDisplacement(particle.initialPosition, time, parameters);
    // 現在位置 x(t) = x0 + u(x0, t)（physics.md §5）。
    particle.position = particle.initialPosition + particle.displacement;
    // 粒子速度 v_p(x0, t) = ∂u/∂t（physics.md §12）。波の速さv=fλとは別の物理量。
    particle.velocity = calculateParticleVelocity(particle.initialPosition, time, parameters);
  }
}

/**
 * シミュレーション時刻を deltaTimeSeconds だけ進め、粒子の状態を更新する。
 *
 * @param {Object} simulationState - 更新対象のSimulationState
 * @param {number} deltaTimeSeconds - 進める物理時間 [s]（再生速度倍率を掛けた後の値）
 */
export function advanceSimulationTime(simulationState, deltaTimeSeconds) {
  simulationState.time += deltaTimeSeconds;
  updateParticles(simulationState);
}
