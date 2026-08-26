// 気柱振動のSimulation Stateの単体テスト（js/simulation/SimulationState.test.jsの気柱振動版）。
import { describe, expect, it } from "vitest";
import {
  createAirColumnState,
  resetAirColumnColumns,
  resizeAirColumnColumns,
} from "../../js/simulation/AirColumnState.js";

describe("AirColumnState", () => {
  it("指定した列数を生成する", () => {
    const airColumnState = createAirColumnState({ columnCount: 30 });
    expect(airColumnState.columns).toHaveLength(30);
  });

  it("列を気柱の全長(tubeLength)にわたって等間隔に配置する", () => {
    const tubeLength = 1.0;
    const columnCount = 5;
    const airColumnState = createAirColumnState({ columnCount, tubeLength });
    const spacing = tubeLength / (columnCount - 1);

    airColumnState.columns.forEach((column, index) => {
      expect(column.initialPosition).toBeCloseTo(index * spacing, 10);
    });
    // 最初の列(x0=0)が音源側・開口端であることを確認する。
    expect(airColumnState.columns[0].initialPosition).toBeCloseTo(0, 10);
    // 最後の列は気柱のもう一方の端(tubeLength)にちょうど位置する。
    expect(airColumnState.columns.at(-1).initialPosition).toBeCloseTo(tubeLength, 10);
  });

  it("resetAirColumnColumnsは時刻を0に戻し、列数を維持したまま初期配置に戻す", () => {
    const airColumnState = createAirColumnState({ columnCount: 10 });
    airColumnState.time = 2.5;
    airColumnState.columns[3].position = 999;

    resetAirColumnColumns(airColumnState);

    expect(airColumnState.time).toBe(0);
    expect(airColumnState.columns).toHaveLength(10);
    expect(airColumnState.columns[3].position).toBe(airColumnState.columns[3].initialPosition);
  });

  // 指示書§9-2/§37-38：列数変更はtime等に副作用を与えない。
  it("resizeAirColumnColumnsは時刻を変更せず、列数だけを変える", () => {
    const airColumnState = createAirColumnState({ columnCount: 10 });
    airColumnState.time = 1.7;

    resizeAirColumnColumns(airColumnState, 25);

    expect(airColumnState.time).toBeCloseTo(1.7, 10);
    expect(airColumnState.columns).toHaveLength(25);
  });
});
