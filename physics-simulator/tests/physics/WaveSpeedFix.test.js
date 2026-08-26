// v固定機能（指示書§7-8）でλ・fが互いに追従するためのPhysics Layer関数のテスト。
// UIのDOM操作部分（チェックボックス等）はブラウザでの手動確認に委ね、
// ここでは「v=fλを一定に保つ計算」という物理的に重要な部分だけを検証する。
import { describe, expect, it } from "vitest";
import {
  calculateFrequencyFromWaveSpeed,
  calculateWavelengthFromWaveSpeed,
} from "../../js/physics/wave/TravelingWave.js";

describe("v固定機能の相互従属計算", () => {
  // 指示書§47の数値例をそのまま検証する：
  //   v=340, λ=2 → f=170
  //   λ=1に変更 → f=340
  //   その状態からf=340（変化なし）→ λ=1のまま
  it("v=340, λ=2のときf=170になる（指示書§47）", () => {
    expect(calculateFrequencyFromWaveSpeed(340, 2)).toBeCloseTo(170, 10);
  });

  it("v=340のままλ=1に変更するとf=340になる（指示書§47）", () => {
    expect(calculateFrequencyFromWaveSpeed(340, 1)).toBeCloseTo(340, 10);
  });

  it("v=340, f=340からλを逆算するとλ=1になる（往復の整合性、指示書§47）", () => {
    expect(calculateWavelengthFromWaveSpeed(340, 340)).toBeCloseTo(1, 10);
  });

  // 往復（λ→f→λ）で元の値に戻ることを確認する（丸め誤差以外での不整合がないか）。
  it("λからfを求め、そのfからλを逆算すると元のλに戻る", () => {
    const waveSpeed = 340;
    const originalWavelength = 1.7;
    const frequency = calculateFrequencyFromWaveSpeed(waveSpeed, originalWavelength);
    const recoveredWavelength = calculateWavelengthFromWaveSpeed(waveSpeed, frequency);
    expect(recoveredWavelength).toBeCloseTo(originalWavelength, 10);
  });
});
