// 気柱振動のSimulation層のオーケストレーション（js/simulation/Simulation.jsと対になる構造）。
//
// 縦波用のSimulation.jsとはあえて分離している。縦波の物理（進行波）と
// 気柱振動の物理（定常波・境界条件）は別の現象であり、1つの関数の中で
// if分岐によって混在させると、REQ-105が求める「粒子表示と波形表示を同一の
// 変位関数から導出する」という前提が崩れやすくなるため（指示書§40の方針にも合致）。

import { calculateDisplacement, calculateParticleVelocity } from "../physics/acoustic/AirColumn.js";

// 気柱本体(columns)・開口端補正の延長区間(sourceEndExtension/farEndExtension)は、
// どれも「initialPositionに対してdisplacement/position/velocityを計算する」という
// 処理内容は完全に同じなので、共通のヘルパーにまとめる
// （延長区間のx0は気柱の外側[-Δx,0]や[L,L+Δx]にあるが、AirColumn.calculateDisplacement等は
// xの範囲を特別扱いしないため、そのまま同じ関数を使い回せる）。
function updateParticleList(particles, time, parameters) {
  for (const particle of particles) {
    particle.displacement = calculateDisplacement(particle.initialPosition, time, parameters);
    particle.position = particle.initialPosition + particle.displacement;
    particle.velocity = calculateParticleVelocity(particle.initialPosition, time, parameters);
  }
}

/**
 * 現在のairColumnState.time（時刻t）に基づいて、気柱本体の列と、開口端補正による
 * 延長区間（sourceEndExtension/farEndExtension）のdisplacement・position・velocityを
 * 再計算する。
 *
 * @param {Object} airColumnState - 更新対象のAirColumnState
 */
export function updateColumns(airColumnState) {
  const {
    amplitude,
    tubeLength,
    soundSpeed,
    sourceEndType,
    farEndType,
    modeNumber,
    endCorrection,
    time,
    columns,
    sourceEndExtension,
    farEndExtension,
  } = airColumnState;
  const parameters = { amplitude, tubeLength, soundSpeed, sourceEndType, farEndType, modeNumber, endCorrection };

  // 気柱本体・音源側延長区間・反対側延長区間はすべて同じ変位関数から導出する（REQ-105の精神）。
  updateParticleList(columns, time, parameters);
  updateParticleList(sourceEndExtension, time, parameters);
  updateParticleList(farEndExtension, time, parameters);
}

/**
 * 気柱振動の時刻を deltaTimeSeconds だけ進め、列の状態を更新する。
 *
 * @param {Object} airColumnState - 更新対象のAirColumnState
 * @param {number} deltaTimeSeconds - 進める物理時間 [s]
 */
export function advanceAirColumnTime(airColumnState, deltaTimeSeconds) {
  airColumnState.time += deltaTimeSeconds;
  updateColumns(airColumnState);
}
