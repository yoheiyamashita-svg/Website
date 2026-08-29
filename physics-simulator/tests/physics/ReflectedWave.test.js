// 横波（定常波）モードの反射波モデルの単体テスト（js/physics/wave/ReflectedWave.js）。
// 検証したいのは「境界条件（自由端=傾き0 / 固定端=変位0）を、入射波u1と反射波u2を
// 足し合わせた結果が、あらゆる時刻tで満たすか」という点（ReflectedWave.js冒頭のコメントで
// 導出したε=+1/-1という符号が正しいかどうかの直接的な検証）。
import { describe, expect, it } from "vitest";
import { calculateDisplacement } from "../../js/physics/wave/TravelingWave.js";
import { calculateReflectedDisplacement } from "../../js/physics/wave/ReflectedWave.js";

const wavelength = 1.7;
const frequency = 0.6;
const mediumLength = 3.3;
const amplitude = 0.3;
const halfAmplitude = amplitude / 2;

function combinedDisplacement(x, t, isFixedEnd) {
  const u1 = calculateDisplacement(x, t, { amplitude: halfAmplitude, wavelength, frequency, phase: 0 });
  const u2 = calculateReflectedDisplacement(x, t, {
    amplitude: halfAmplitude,
    wavelength,
    frequency,
    mediumLength,
    isFixedEnd,
  });
  return u1 + u2;
}

describe("ReflectedWave", () => {
  // 自由端(x=Lで傾き∂u/∂x=0)条件：中央差分で数値的に傾きを求め、0に近いことを確認する。
  it("自由端では、あらゆる時刻でx=Lにおける傾きがほぼ0になる", () => {
    const dx = 1e-6;
    for (let ti = 0; ti < 7; ti += 1) {
      const t = ti * 0.37;
      const uPlus = combinedDisplacement(mediumLength + dx, t, false);
      const uMinus = combinedDisplacement(mediumLength - dx, t, false);
      const slope = (uPlus - uMinus) / (2 * dx);
      expect(slope).toBeCloseTo(0, 4);
    }
  });

  // 固定端(x=Lで変位u=0)条件：あらゆる時刻でu(L,t)が厳密に0になることを確認する。
  it("固定端では、あらゆる時刻でx=Lにおける変位がほぼ0になる", () => {
    for (let ti = 0; ti < 7; ti += 1) {
      const t = ti * 0.37;
      expect(combinedDisplacement(mediumLength, t, true)).toBeCloseTo(0, 10);
    }
  });

  // 和積公式を適用した閉じた式（js/ui/TransverseWaveFormulaDisplay.jsの④の式）が、
  // u1+u2の数値計算結果と一致することを確認する。これは表示する数式が実際の計算と
  // 食い違っていないかの検証（comment/code mismatchの禁止事項に対応）。
  it("自由端：u=A cos(k(x-L)) sin(kL-ωt) が u1+u2と一致する", () => {
    const waveNumber = (2 * Math.PI) / wavelength;
    const angularFrequency = 2 * Math.PI * frequency;
    for (let ti = 0; ti < 5; ti += 1) {
      const t = ti * 0.41;
      for (let xi = 0; xi < 5; xi += 1) {
        const x = xi * 0.53;
        const expected =
          amplitude *
          Math.cos(waveNumber * (x - mediumLength)) *
          Math.sin(waveNumber * mediumLength - angularFrequency * t);
        expect(combinedDisplacement(x, t, false)).toBeCloseTo(expected, 10);
      }
    }
  });

  it("固定端：u=A sin(k(x-L)) cos(kL-ωt) が u1+u2と一致する", () => {
    const waveNumber = (2 * Math.PI) / wavelength;
    const angularFrequency = 2 * Math.PI * frequency;
    for (let ti = 0; ti < 5; ti += 1) {
      const t = ti * 0.41;
      for (let xi = 0; xi < 5; xi += 1) {
        const x = xi * 0.53;
        const expected =
          amplitude *
          Math.sin(waveNumber * (x - mediumLength)) *
          Math.cos(waveNumber * mediumLength - angularFrequency * t);
        expect(combinedDisplacement(x, t, true)).toBeCloseTo(expected, 10);
      }
    }
  });
});
