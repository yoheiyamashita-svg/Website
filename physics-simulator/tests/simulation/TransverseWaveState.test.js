// 横波（定常波）モードのSimulation Stateの単体テスト（AirColumnState.test.jsの横波版）。
import { describe, expect, it } from "vitest";
import {
  createTransverseWaveState,
  rebuildTransverseWavePoints,
  resetTransverseWave,
} from "../../js/simulation/TransverseWaveState.js";
import { TRANSVERSE_WAVE_POINT_COUNT } from "../../js/utils/constants.js";

describe("TransverseWaveState", () => {
  it("TRANSVERSE_WAVE_POINT_COUNT個の点を生成する", () => {
    const transverseWaveState = createTransverseWaveState();
    expect(transverseWaveState.points).toHaveLength(TRANSVERSE_WAVE_POINT_COUNT);
  });

  it("点を媒質の全長(mediumLength)にわたって等間隔に配置する", () => {
    const mediumLength = 4.0;
    const transverseWaveState = createTransverseWaveState({ mediumLength });
    const spacing = mediumLength / (TRANSVERSE_WAVE_POINT_COUNT - 1);

    transverseWaveState.points.forEach((point, index) => {
      expect(point.initialPosition).toBeCloseTo(index * spacing, 10);
    });
    expect(transverseWaveState.points[0].initialPosition).toBeCloseTo(0, 10);
    expect(transverseWaveState.points.at(-1).initialPosition).toBeCloseTo(mediumLength, 10);
  });

  it("rebuildTransverseWavePointsは時刻を変更せず、新しいmediumLengthで点を作り直す", () => {
    const transverseWaveState = createTransverseWaveState({ mediumLength: 4.0 });
    transverseWaveState.time = 1.7;
    transverseWaveState.mediumLength = 5.0;

    rebuildTransverseWavePoints(transverseWaveState);

    expect(transverseWaveState.time).toBeCloseTo(1.7, 10);
    expect(transverseWaveState.points.at(-1).initialPosition).toBeCloseTo(5.0, 10);
  });

  it("resetTransverseWaveは時刻を0に戻す", () => {
    const transverseWaveState = createTransverseWaveState();
    transverseWaveState.time = 2.5;

    resetTransverseWave(transverseWaveState);

    expect(transverseWaveState.time).toBe(0);
  });
});
