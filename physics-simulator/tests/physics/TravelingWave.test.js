// physics.md §24 TEST-001〜005 に対応する、進行波モデルの単体テスト。
// Physics Layer（js/physics以下）は物理的な正確性が最も重要な部分なので、
// architecture.md §20の方針どおり、ここで数式の性質を検証する。
import { describe, expect, it } from "vitest";
import {
  calculateAngularFrequency,
  calculateDisplacement,
  calculateWaveNumber,
  calculateWaveSpeed,
} from "../../js/physics/wave/TravelingWave.js";

describe("TravelingWave", () => {
  // TEST-001: 振幅A=0のとき、変位uは常に0になる（u = A sin(...) なので、Aが0なら
  // sinの中身がどんな値でも積は0になるはず）。
  it("振幅が0のとき、変位は常に0になる（TEST-001）", () => {
    const parameters = { amplitude: 0, wavelength: 2, frequency: 1, phase: 0 };
    expect(calculateDisplacement(1.23, 0.5, parameters)).toBe(0);
  });

  // TEST-002: 時刻t=0での変位は、初期条件 u(x,0) = A sin(kx + φ) と一致する
  // （t=0を代入すると -ωt の項が消えるだけなので、当然一致するはずという確認）。
  it("t=0のとき、初期条件 u(x,0)=A sin(kx+φ) と一致する（TEST-002）", () => {
    const parameters = { amplitude: 0.5, wavelength: 2, frequency: 1, phase: 0.3 };
    const waveNumber = calculateWaveNumber(parameters.wavelength);
    const expected = parameters.amplitude * Math.sin(waveNumber * 0.7 + parameters.phase);
    expect(calculateDisplacement(0.7, 0, parameters)).toBeCloseTo(expected, 10);
  });

  // TEST-003: 波長λを2倍にすると、波数kは半分になる（k = 2π/λ という反比例の関係）。
  it("波長を2倍にすると、波数kは半分になる（TEST-003）", () => {
    const k1 = calculateWaveNumber(2);
    const k2 = calculateWaveNumber(4);
    expect(k2).toBeCloseTo(k1 / 2, 10);
  });

  // TEST-004: 周波数fを2倍にすると、角周波数ωも2倍になる（ω = 2πf という比例関係）。
  it("周波数を2倍にすると、角周波数ωも2倍になる（TEST-004）", () => {
    const omega1 = calculateAngularFrequency(1);
    const omega2 = calculateAngularFrequency(2);
    expect(omega2).toBeCloseTo(omega1 * 2, 10);
  });

  // TEST-005: どんな周波数・波長の組み合わせでも、v = fλ の関係が常に成立する。
  it("波の速さは常に v = fλ を満たす（TEST-005）", () => {
    expect(calculateWaveSpeed(2, 3)).toBe(6);
    expect(calculateWaveSpeed(0.5, 4)).toBe(2);
  });
});
