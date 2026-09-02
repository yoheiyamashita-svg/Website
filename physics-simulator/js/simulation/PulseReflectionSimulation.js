// 横波の反射（パルス）モードのSimulation層のオーケストレーション
// （js/simulation/TransverseWaveSimulation.jsと対になる構造）。

import {
  calculateIncidentDisplacement,
  calculateLoopDuration,
  calculateReflectedDisplacement,
} from "../physics/wave/PulseWave.js";
import { END_TYPE_FIXED } from "../utils/constants.js";

/**
 * 現在のpulseReflectionState.time（時刻t）に基づいて、全ての点の
 * incidentDisplacement・reflectedDisplacement・combinedDisplacementを再計算する。
 *
 * @param {Object} pulseReflectionState - 更新対象のPulseReflectionState
 */
export function updatePoints(pulseReflectionState) {
  const { amplitude, pulseWidth, waveSpeed, mediumLength, endType, shape, time, points } =
    pulseReflectionState;

  const incidentParameters = { amplitude, pulseWidth, waveSpeed, shape };
  const reflectedParameters = {
    amplitude,
    pulseWidth,
    waveSpeed,
    mediumLength,
    isFixedEnd: endType === END_TYPE_FIXED,
    shape,
  };

  for (const point of points) {
    point.incidentDisplacement = calculateIncidentDisplacement(
      point.initialPosition,
      time,
      incidentParameters
    );
    point.reflectedDisplacement = calculateReflectedDisplacement(
      point.initialPosition,
      time,
      reflectedParameters
    );
    point.combinedDisplacement = point.incidentDisplacement + point.reflectedDisplacement;
  }
}

/**
 * 横波の反射（パルス）シミュレーションの時刻を deltaTimeSeconds だけ進め、
 * 点の状態を更新する。1往復にかかる時間（calculateLoopDuration）を超えたら、
 * 時刻を0に戻して自動的に次のパルスを送り出す（ユーザー確認済み：
 * 既定の再生方式は自動ループ）。
 *
 * @param {Object} pulseReflectionState - 更新対象のPulseReflectionState
 * @param {number} deltaTimeSeconds - 進める物理時間 [s]
 */
export function advancePulseReflectionTime(pulseReflectionState, deltaTimeSeconds) {
  pulseReflectionState.time += deltaTimeSeconds;

  const loopDuration = calculateLoopDuration({
    pulseWidth: pulseReflectionState.pulseWidth,
    mediumLength: pulseReflectionState.mediumLength,
    waveSpeed: pulseReflectionState.waveSpeed,
  });
  if (pulseReflectionState.time > loopDuration) {
    pulseReflectionState.time = 0;
  }

  updatePoints(pulseReflectionState);
}
