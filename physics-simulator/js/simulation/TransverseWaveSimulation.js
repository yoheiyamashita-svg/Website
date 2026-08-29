// 横波（定常波）モードのSimulation層のオーケストレーション
// （js/simulation/Simulation.js・js/simulation/AirColumnSimulation.jsと対になる構造）。

import { calculateDisplacement } from "../physics/wave/TravelingWave.js";
import { calculateReflectedDisplacement } from "../physics/wave/ReflectedWave.js";
import { END_TYPE_FIXED } from "../utils/constants.js";

/**
 * 現在のtransverseWaveState.time（時刻t）に基づいて、全ての点の
 * incidentDisplacement・reflectedDisplacement・combinedDisplacementを再計算する。
 *
 * @param {Object} transverseWaveState - 更新対象のTransverseWaveState
 */
export function updatePoints(transverseWaveState) {
  const { amplitude, wavelength, frequency, mediumLength, endType, time, points } = transverseWaveState;

  // 右向き波(入射波)・左向き波(反射波)は、それぞれ振幅A/2として重ね合わせると
  // ちょうど振幅Aの波になるようにする（js/ui/acoustic/AirColumnFormulaDisplay.jsの
  // 入射波/反射波の振幅の扱いと同じ考え方）。
  const halfAmplitude = amplitude / 2;
  const incidentParameters = { amplitude: halfAmplitude, wavelength, frequency, phase: 0 };
  const reflectedParameters = {
    amplitude: halfAmplitude,
    wavelength,
    frequency,
    mediumLength,
    isFixedEnd: endType === END_TYPE_FIXED,
  };

  for (const point of points) {
    // 右向き波：TravelingWave.jsの進行波の式をそのまま使う（別の近似式を作らない、REQ-105）。
    point.incidentDisplacement = calculateDisplacement(point.initialPosition, time, incidentParameters);
    // 左向き波：右端での反射を表すReflectedWave.jsの式。
    point.reflectedDisplacement = calculateReflectedDisplacement(
      point.initialPosition,
      time,
      reflectedParameters
    );
    // 合成波：単純な重ね合わせ（足し算）。ここでも新しい物理式は作らず、
    // 既に計算済みの2つの値を足すだけにする。
    point.combinedDisplacement = point.incidentDisplacement + point.reflectedDisplacement;
  }
}

/**
 * 横波シミュレーションの時刻を deltaTimeSeconds だけ進め、点の状態を更新する。
 *
 * @param {Object} transverseWaveState - 更新対象のTransverseWaveState
 * @param {number} deltaTimeSeconds - 進める物理時間 [s]
 */
export function advanceTransverseWaveTime(transverseWaveState, deltaTimeSeconds) {
  transverseWaveState.time += deltaTimeSeconds;
  updatePoints(transverseWaveState);
}
