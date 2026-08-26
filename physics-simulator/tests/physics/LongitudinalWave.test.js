// 縦波固有の物理量（粒子速度）の単体テスト（physics.md §12）。
import { describe, expect, it } from "vitest";
import { calculateAngularFrequency, calculateWaveNumber } from "../../js/physics/wave/TravelingWave.js";
import { calculateParticleVelocity } from "../../js/physics/wave/LongitudinalWave.js";

describe("LongitudinalWave", () => {
  // 粒子速度の物理式 v_p(x,t) = -ωA cos(kx - ωt + φ) が、実装と一致することを確認する。
  // (この式はu(x,t)=A sin(kx-ωt+φ)を時刻tで微分した結果であり、テスト自体が
  // 「微分した式を正しく実装できているか」の検証になる。)
  it("粒子速度が v_p = -ωA cos(kx - ωt + φ) と一致する", () => {
    const parameters = { amplitude: 0.4, wavelength: 2, frequency: 0.5, phase: 0.2 };
    const waveNumber = calculateWaveNumber(parameters.wavelength);
    const angularFrequency = calculateAngularFrequency(parameters.frequency);
    const x = 1.1;
    const t = 0.7;

    const expected =
      -angularFrequency *
      parameters.amplitude *
      Math.cos(waveNumber * x - angularFrequency * t + parameters.phase);

    expect(calculateParticleVelocity(x, t, parameters)).toBeCloseTo(expected, 10);
  });

  // 振幅が0であれば、粒子はまったく振動していないので、粒子速度も常に0になるはず。
  it("振幅が0のとき、粒子速度は常に0になる", () => {
    const parameters = { amplitude: 0, wavelength: 2, frequency: 1, phase: 0 };
    expect(calculateParticleVelocity(0.5, 1.3, parameters)).toBe(0);
  });
});
