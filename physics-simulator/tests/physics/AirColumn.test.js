// 気柱振動の物理エンジン(AirColumn.js)の統合テスト。境界条件モジュール単体のテストは
// tests/physics/OpenOpenTube.test.js / OpenClosedTube.test.js にあるが、
// ここでは「両端の種類(sourceEndType/farEndType)の組み合わせ」と「開口端補正Δxによる
// 位置のシフト」まで含めたcalculateDisplacement/calculateParticleVelocityの挙動を確認する。
import { describe, expect, it } from "vitest";
import { calculateDisplacement, calculateParticleVelocity } from "../../js/physics/acoustic/AirColumn.js";

const OPEN = "open";
const CLOSED = "closed";

describe("AirColumn（開口端補正Δxを含む）", () => {
  // ユーザー要望「Δx=0のときは今のままでOK」：endCorrectionを省略した場合と
  // 明示的に0を渡した場合とで、変位・粒子速度の計算結果が完全に一致すること。
  it("endCorrectionを省略しても0を渡しても結果が一致する", () => {
    const base = {
      amplitude: 0.15,
      sourceEndType: OPEN,
      farEndType: CLOSED,
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

  // 一端閉管（上端開口・下端閉口）：開口端補正Δx>0でも、閉口端(x=L)は硬い壁なので
  // 節条件u(L,t)=0が厳密に保たれなければならない。
  it("上端開口・下端閉口：Δx>0でも下端でu(L,t)=0が厳密に成り立つ", () => {
    const tubeLength = 1.0;
    for (const endCorrection of [0, 0.01, 0.03, 0.08]) {
      const parameters = {
        amplitude: 0.2,
        sourceEndType: OPEN,
        farEndType: CLOSED,
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
      sourceEndType: OPEN,
      farEndType: OPEN,
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
      sourceEndType: OPEN,
      farEndType: OPEN,
      modeNumber: 1,
      soundSpeed: 340,
      tubeLength: 1.0,
      endCorrection: 0,
    };
    expect(Math.abs(calculateDisplacement(0, 0, parameters))).toBeCloseTo(parameters.amplitude, 10);
  });

  // ユーザー要望：上端(音源側)も開口/閉口を選べるようにする。
  // 上端が閉口のとき、u(0,t)=0が全時刻で厳密に成り立たなければならない
  // （下端が閉口のときの節条件と対称。js/physics/acoustic/AirColumn.jsの
  // calculateSpatialShiftのコメント参照：上端が閉口のときはxをシフトしないことで
  // この厳密さを保っている）。
  it("上端閉口：Δx>0でも上端でu(0,t)=0が厳密に成り立つ", () => {
    const tubeLength = 1.0;
    for (const farEndType of [OPEN, CLOSED]) {
      for (const endCorrection of [0, 0.01, 0.03, 0.08]) {
        const parameters = {
          amplitude: 0.2,
          sourceEndType: CLOSED,
          farEndType,
          modeNumber: 2,
          soundSpeed: 340,
          tubeLength,
          endCorrection,
        };
        [0, 0.13, 0.5, 1.7].forEach((t) => {
          expect(calculateDisplacement(0, t, parameters)).toBeCloseTo(0, 10);
        });
      }
    }
  });

  // 上端・下端とも閉口（両端閉口）のとき、Δxの値によらず両端でu=0が厳密に成り立つ
  // （開口端が1本もないため、開口端補正は一切効かない）。
  it("両端閉口：Δxの値によらず両端でu=0が厳密に成り立つ", () => {
    const tubeLength = 1.0;
    for (const endCorrection of [0, 0.01, 0.05, 0.08]) {
      const parameters = {
        amplitude: 0.2,
        sourceEndType: CLOSED,
        farEndType: CLOSED,
        modeNumber: 3,
        soundSpeed: 340,
        tubeLength,
        endCorrection,
      };
      [0, 0.13, 0.5, 1.7].forEach((t) => {
        expect(calculateDisplacement(0, t, parameters)).toBeCloseTo(0, 10);
        expect(calculateDisplacement(tubeLength, t, parameters)).toBeCloseTo(0, 10);
      });
    }
  });
});
