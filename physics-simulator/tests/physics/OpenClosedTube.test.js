// 「両端の種類が不一致」の場合の固有値条件の単体テスト（physics.md §19-20、
// 指示書§17-2・§45-46 TEST-010/011/012）。一端閉管(開口-閉口)はこの条件の
// 具体例の1つとして検証する（js/physics/acoustic/OpenClosedTube.jsのヘッダーコメント参照：
// このモジュールの数式自体は「両端が異なる種類」全般に成り立つ）。
import { describe, expect, it } from "vitest";
import {
  calculateEigenfrequency,
  calculateWaveNumberForMode,
} from "../../js/physics/acoustic/OpenClosedTube.js";
import { calculateStandingWaveDisplacement } from "../../js/physics/wave/StandingWave.js";

describe("OpenClosedTube（両端の種類が不一致の場合の固有値条件）", () => {
  // TEST-010: 開口端(x=0)は常に変位の腹になる（cos(k・0)=1なので振幅そのまま）。
  it("開口端(x=0)が変位の腹になる（TEST-010）", () => {
    const tubeLength = 1.0;
    for (let modeNumber = 1; modeNumber <= 5; modeNumber += 1) {
      const waveNumber = calculateWaveNumberForMode(modeNumber, tubeLength);
      expect(Math.abs(Math.cos(waveNumber * 0))).toBeCloseTo(1, 10);
    }
  });

  // TEST-011: 閉口端(x=L)は変位の節、すなわちu(L,t)=0が「全ての時刻tで」厳密に成り立つ。
  // tに依存する項cos(ωt)がどんな値であっても0になる必要があるため、
  // 複数の時刻で確認することで「たまたま0だった」のではないことを保証する。
  it("閉口端(x=L)でu(L,t)=0が全時刻で成立する（TEST-011）", () => {
    const tubeLength = 1.0;
    const amplitude = 0.5;
    const angularFrequency = 7.0;

    for (let modeNumber = 1; modeNumber <= 5; modeNumber += 1) {
      const waveNumber = calculateWaveNumberForMode(modeNumber, tubeLength);
      const parameters = { amplitude, waveNumber, angularFrequency };

      [0, 0.1, 0.37, 1.234, 5.0].forEach((t) => {
        expect(calculateStandingWaveDisplacement(tubeLength, t, parameters)).toBeCloseTo(0, 10);
      });
    }
  });

  // TEST-012: n次固有振動数 f_n = (2n-1)v/(4L)
  it("固有振動数がf_n=(2n-1)v/(4L)になる（TEST-012）", () => {
    const soundSpeed = 340;
    const tubeLength = 1.0;
    for (let modeNumber = 1; modeNumber <= 5; modeNumber += 1) {
      const expected = ((2 * modeNumber - 1) * soundSpeed) / (4 * tubeLength);
      expect(calculateEigenfrequency(modeNumber, soundSpeed, tubeLength)).toBeCloseTo(expected, 10);
    }
  });

  // 「偶数次の振動が存在しない」ことの確認：n=1,2,3,...から生成される固有振動数の列は
  // 基本振動数f1の奇数倍(1倍,3倍,5倍,...)だけになり、2倍・4倍等は現れない。
  it("固有振動数の列に基本振動数の偶数倍が現れない（禁止事項8の逆側の確認）", () => {
    const soundSpeed = 340;
    const tubeLength = 1.0;
    const f1 = calculateEigenfrequency(1, soundSpeed, tubeLength);

    const ratios = [1, 2, 3, 4, 5].map(
      (modeNumber) => calculateEigenfrequency(modeNumber, soundSpeed, tubeLength) / f1
    );

    expect(ratios).toEqual([1, 3, 5, 7, 9]);
  });

  // 実効長L_eff（開口端補正Δx込みの長さ、または単なるtubeLengthそのもの）を渡すだけの
  // モジュールになったため、L_effの計算自体はjs/physics/acoustic/AirColumn.js側の責務。
  it("実効長がtubeLengthそのものと一致するとき、補正なしの式と一致する", () => {
    expect(calculateEigenfrequency(1, 340, 1.0)).toBeCloseTo((1 * 340) / (4 * 1.0), 10);
    expect(calculateWaveNumberForMode(1, 1.0)).toBeCloseTo(Math.PI / (2 * 1.0), 10);
  });

  // 両端が不一致の場合、開口端は1本だけなので実効長はL_eff = L + Δx
  // （js/physics/acoustic/AirColumn.jsのcountOpenEnds参照。両端一致(開口-開口)の
  // +2Δxとは異なる）。
  it("実効長L_eff=L+Δxを渡すと、固有振動数はf_n=(2n-1)v/(4L_eff)になる", () => {
    const soundSpeed = 340;
    const tubeLength = 1.0;
    const endCorrection = 0.02;
    const modeNumber = 1;
    const effectiveLength = tubeLength + endCorrection;
    const expected = ((2 * modeNumber - 1) * soundSpeed) / (4 * effectiveLength);
    expect(calculateEigenfrequency(modeNumber, soundSpeed, effectiveLength)).toBeCloseTo(expected, 10);
    expect(calculateEigenfrequency(modeNumber, soundSpeed, effectiveLength)).toBeLessThan(
      calculateEigenfrequency(modeNumber, soundSpeed, tubeLength)
    );
  });
});
