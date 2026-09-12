// 横波（定常波）モードの両端境界条件モデルの単体テスト
// （js/physics/wave/TransverseStandingWave.js、ReflectedWave.test.jsの後継）。
import { describe, expect, it } from "vitest";
import {
  calculateIncidentDisplacement,
  calculateReflectedDisplacement,
  calculateResonanceResponse,
} from "../../js/physics/wave/TransverseStandingWave.js";

const FIXED = "fixed";
const FREE = "free";

function combinedDisplacement(x, t, params) {
  return calculateIncidentDisplacement(x, t, params) + calculateReflectedDisplacement(x, t, params);
}

describe("TransverseStandingWave", () => {
  // 左端(x=0)の境界条件は、共鳴しているかどうかに関わらず、
  // どんなλ・fの組み合わせでも常に厳密に成り立たなければならない。
  it("左端(x=0)は、共鳴していない任意のλ・fでも境界条件を厳密に満たす", () => {
    const wavelength = 1.7;
    const frequency = 0.6;
    const amplitude = 0.15;

    // 固定端：u(0,t)=0が全時刻で厳密に成立する。
    for (const t of [0, 0.13, 0.5, 1.7, 3.3]) {
      const params = { amplitude, wavelength, frequency, leftEndType: FIXED };
      expect(combinedDisplacement(0, t, params)).toBeCloseTo(0, 10);
    }

    // 自由端：x=0での傾き∂u/∂xが全時刻で厳密に0になる。
    const dx = 1e-6;
    for (const t of [0, 0.13, 0.5, 1.7, 3.3]) {
      const params = { amplitude, wavelength, frequency, leftEndType: FREE };
      const uPlus = combinedDisplacement(dx, t, params);
      const uMinus = combinedDisplacement(-dx, t, params);
      const slope = (uPlus - uMinus) / (2 * dx);
      expect(slope).toBeCloseTo(0, 4);
    }
  });

  // 両端の組み合わせごとに、kLが共鳴条件（一致なら整数×π、不一致なら(n-1/2)×π）を
  // 満たすλ・Lを意図的に選び、response=1（共鳴応答が最大）になること、
  // かつそのとき右端(x=L)の境界条件も厳密に成り立つことを確認する。
  it.each([
    [FIXED, FIXED, 5],
    [FREE, FREE, 3],
    [FIXED, FREE, 4],
    [FREE, FIXED, 6],
  ])("%s-%s（n=%i）で共鳴させると、response=1かつ右端の境界条件が厳密に成り立つ", (leftEndType, rightEndType, n) => {
    const wavelength = 1.7;
    const waveNumber = (2 * Math.PI) / wavelength;
    const endsMatch = leftEndType === rightEndType;
    const mediumLength = endsMatch ? (n * Math.PI) / waveNumber : ((n - 0.5) * Math.PI) / waveNumber;

    const { response } = calculateResonanceResponse({ wavelength, mediumLength, leftEndType, rightEndType });
    expect(response).toBeCloseTo(1, 8);

    const amplitude = 0.2;
    const dx = 1e-6;
    for (const t of [0, 0.13, 0.5, 1.7, 3.3]) {
      const params = { amplitude, wavelength, frequency: 0.6, leftEndType };
      if (rightEndType === FIXED) {
        expect(combinedDisplacement(mediumLength, t, params)).toBeCloseTo(0, 8);
      } else {
        const uPlus = combinedDisplacement(mediumLength + dx, t, params);
        const uMinus = combinedDisplacement(mediumLength - dx, t, params);
        expect((uPlus - uMinus) / (2 * dx)).toBeCloseTo(0, 3);
      }
    }
  });

  // 共鳴からズレたときは、responseが1未満になり、detuningの絶対値が大きいほど
  // 単調に小さくなる（ローレンツ型の形状）。また、どれだけズレても厳密な0にはならない
  // （ハードカットオフではなく、なめらかな共振曲線であることの確認）。
  it("共鳴からズレるほどresponseは単調に減少し、0にはならない（共振曲線の形状）", () => {
    const mediumLength = 4.0;
    const leftEndType = FIXED;
    const rightEndType = FIXED;

    // n=4に対応する共鳴波長を基準に、そこから少しずつλをずらしていく。
    const resonantWavelength = (2 * mediumLength) / 4;
    const wavelengths = [
      resonantWavelength,
      resonantWavelength * 1.01,
      resonantWavelength * 1.03,
      resonantWavelength * 1.06,
      resonantWavelength * 1.1,
    ];

    let previousResponse = Infinity;
    for (const wavelength of wavelengths) {
      const { response } = calculateResonanceResponse({ wavelength, mediumLength, leftEndType, rightEndType });
      expect(response).toBeGreaterThan(0);
      expect(response).toBeLessThanOrEqual(previousResponse + 1e-9);
      previousResponse = response;
    }
    // 最もズレた設定でも、responseは厳密な0ではない。
    expect(previousResponse).toBeGreaterThan(0);
  });
});
