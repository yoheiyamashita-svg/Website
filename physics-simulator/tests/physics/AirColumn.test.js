// 気柱振動の物理エンジン(AirColumn.js)の統合テスト。境界条件モジュール単体のテストは
// tests/physics/OpenOpenTube.test.js / OpenClosedTube.test.js にあるが、
// ここでは「開口端補正Δxによる位置のシフト」(x + endCorrection)まで含めた
// calculateDisplacement/calculateParticleVelocityの挙動を確認する。
import { describe, expect, it } from "vitest";
import { calculateDisplacement, calculateParticleVelocity } from "../../js/physics/acoustic/AirColumn.js";

describe("AirColumn（開口端補正Δxを含む）", () => {
  // ユーザー要望「Δx=0のときは今のままでOK」：endCorrectionを省略した場合と
  // 明示的に0を渡した場合とで、変位・粒子速度の計算結果が完全に一致すること。
  it("endCorrectionを省略しても0を渡しても結果が一致する", () => {
    const base = {
      amplitude: 0.15,
      boundaryType: "open-closed",
      modeNumber: 2,
      soundSpeed: 340,
      tubeLength: 1.0,
    };
    const x = 0.3;
    const t = 0.37;
    expect(calculateDisplacement(x, t, base)).toBe(calculateDisplacement(x, t, { ...base, endCorrection: 0 }));
    expect(calculateParticleVelocity(x, t, base)).toBe(
      calculateParticleVelocity(x, t, { ...base, endCorrection: 0 })
    );
  });

  // 一端閉管：開口端補正Δx>0でも、閉口端(x=L)は硬い壁なので節条件u(L,t)=0が
  // 厳密に保たれなければならない（js/physics/acoustic/AirColumn.jsのコメント参照：
  // x+Δxのシフトにより、閉口端の節条件は常にk(L+Δx)=(2n-1)π/2を厳密に満たす）。
  it("一端閉管：Δx>0でも閉口端でu(L,t)=0が厳密に成り立つ", () => {
    const tubeLength = 1.0;
    for (const endCorrection of [0, 0.01, 0.03, 0.08]) {
      const parameters = {
        amplitude: 0.2,
        boundaryType: "open-closed",
        modeNumber: 3,
        soundSpeed: 340,
        tubeLength,
        endCorrection,
      };
      [0, 0.13, 0.5, 1.7].forEach((t) => {
        expect(calculateDisplacement(tubeLength, t, parameters)).toBeCloseTo(0, 10);
      });
    }
  });

  // 開口端(x=0)側は、Δx=0のときはちょうど腹（|u|の最大値=A）になるが、
  // Δx>0のときは実際の腹が管の外側(x=-Δx)にできるため、管の物理的な開口部(x=0)での
  // 変位の最大値はAよりわずかに小さくなる（近似的に腹に近いが、厳密な腹ではない）。
  it("開口端(x=0)の変位振幅は、Δx>0のときAよりわずかに小さくなる", () => {
    const parameters = {
      amplitude: 0.2,
      boundaryType: "open-open",
      modeNumber: 1,
      soundSpeed: 340,
      tubeLength: 1.0,
      endCorrection: 0.05,
    };
    // t=0でcos(ωt)=1になるようにangularFrequencyは何でもよいが、t=0を使えば確実。
    const displacementAtSourceEnd = Math.abs(calculateDisplacement(0, 0, parameters));
    expect(displacementAtSourceEnd).toBeLessThan(parameters.amplitude);
    // ただしΔxは小さいため、Aにかなり近い値ではある
    // （L=1.0, Δx=0.05, n=1のとき、理論値は A×cos(πΔx/(L+2Δx)) ≈ 0.9898×A）。
    expect(displacementAtSourceEnd).toBeGreaterThan(parameters.amplitude * 0.98);
  });

  // Δx=0のときは、開口端(x=0)の変位振幅はちょうどAになる（従来通りの厳密な腹）。
  it("Δx=0のとき、開口端(x=0)の変位振幅はちょうどAになる", () => {
    const parameters = {
      amplitude: 0.2,
      boundaryType: "open-open",
      modeNumber: 1,
      soundSpeed: 340,
      tubeLength: 1.0,
      endCorrection: 0,
    };
    expect(Math.abs(calculateDisplacement(0, 0, parameters))).toBeCloseTo(parameters.amplitude, 10);
  });
});
