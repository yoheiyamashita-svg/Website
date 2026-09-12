// 横波（定常波）モードのSimulation層のオーケストレーション
// （js/simulation/Simulation.js・js/simulation/AirColumnSimulation.jsと対になる構造）。

import {
  calculateIncidentDisplacement,
  calculateReflectedDisplacement,
  calculateResonanceResponse,
} from "../physics/wave/TransverseStandingWave.js";

/**
 * 現在のtransverseWaveState.time（時刻t）に基づいて、全ての点の
 * incidentDisplacement・reflectedDisplacement・combinedDisplacement、および
 * 共鳴応答係数(resonanceResponse)を再計算する。
 *
 * @param {Object} transverseWaveState - 更新対象のTransverseWaveState
 */
export function updatePoints(transverseWaveState) {
  const { amplitude, wavelength, frequency, mediumLength, leftEndType, rightEndType, time, points } =
    transverseWaveState;

  // 共鳴からのズレに応じて振幅が滑らかに小さくなる共振曲線（ローレンツ型）。
  // λ・Lだけで決まる値なので、点ごとに計算する必要はなく1回だけ計算する
  // （js/physics/wave/TransverseStandingWave.jsのcalculateResonanceResponse参照）。
  const { response } = calculateResonanceResponse({ wavelength, mediumLength, leftEndType, rightEndType });
  transverseWaveState.resonanceResponse = response;

  // 右向き波(入射波)・左向き波(反射波)は、それぞれ振幅A/2として重ね合わせると
  // ちょうど振幅Aの波になるようにする（js/ui/acoustic/AirColumnFormulaDisplay.jsの
  // 入射波/反射波の振幅の扱いと同じ考え方）。さらに共鳴応答responseを掛けることで、
  // 共鳴からズレるほど両方の振幅が一緒に小さくなる（combined=incident+reflectedという
  // 単純な足し算の関係は保ったまま、両端の境界条件が破れて見えないようにする）。
  const effectiveHalfAmplitude = (amplitude / 2) * response;
  const incidentParameters = { amplitude: effectiveHalfAmplitude, wavelength, frequency, leftEndType };
  const reflectedParameters = { amplitude: effectiveHalfAmplitude, wavelength, frequency, leftEndType };

  for (const point of points) {
    // 右向き波：TransverseStandingWave.jsの式をそのまま使う（別の近似式を作らない、REQ-105）。
    point.incidentDisplacement = calculateIncidentDisplacement(point.initialPosition, time, incidentParameters);
    // 左向き波：同じくTransverseStandingWave.jsの式。
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
