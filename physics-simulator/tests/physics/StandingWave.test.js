// 定常波モデルの単体テスト（physics.md §14、指示書§18・§45-46）。
import { describe, expect, it } from "vitest";
import {
  calculateStandingWaveDisplacement,
  calculateStandingWaveParticleVelocity,
} from "../../js/physics/wave/StandingWave.js";

describe("StandingWave", () => {
  // u(x,t) = A cos(kx) cos(ωt) はx=0でcos(0)=1となるため、
  // 振幅Aそのままの大きさで振動する「腹」になる（指示書§15の絶対条件：
  // 音源側(x=0)は常に開口=腹、をこの式の形自体が保証していることの確認）。
  it("x=0では振幅Aそのままの大きさで振動する（腹）", () => {
    const parameters = { amplitude: 0.4, waveNumber: 1.5, angularFrequency: 2.0 };
    const t = 0.37;
    const expected = 0.4 * Math.cos(2.0 * t);
    expect(calculateStandingWaveDisplacement(0, t, parameters)).toBeCloseTo(expected, 10);
  });

  // 振幅A=0なら、位置・時刻によらず変位は常に0になる（TEST-001の定常波版）。
  it("振幅が0のとき、変位は常に0になる", () => {
    const parameters = { amplitude: 0, waveNumber: 1.2, angularFrequency: 3.0 };
    expect(calculateStandingWaveDisplacement(0.5, 1.1, parameters)).toBe(0);
  });

  // 粒子速度 v_p = ∂u/∂t が、解析的に微分した式 -Aω cos(kx) sin(ωt) と一致することを確認する。
  it("粒子速度が -Aω cos(kx) sin(ωt) と一致する", () => {
    const parameters = { amplitude: 0.3, waveNumber: 1.8, angularFrequency: 2.5 };
    const x = 0.6;
    const t = 0.9;
    const expected =
      -parameters.amplitude *
      parameters.angularFrequency *
      Math.cos(parameters.waveNumber * x) *
      Math.sin(parameters.angularFrequency * t);
    expect(calculateStandingWaveParticleVelocity(x, t, parameters)).toBeCloseTo(expected, 10);
  });
});
