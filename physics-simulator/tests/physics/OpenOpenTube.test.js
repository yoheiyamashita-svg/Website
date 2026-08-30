// 「両端の種類が一致する」場合の固有値条件の単体テスト（physics.md §18, §20、
// 指示書§17-1・§45-46 TEST-008/009/013/014）。両端開管(開口-開口)はこの条件の
// 具体例の1つとして検証する（js/physics/acoustic/OpenOpenTube.jsのヘッダーコメント参照：
// このモジュールの数式自体は「両端が同じ種類」全般に成り立つ）。
import { describe, expect, it } from "vitest";
import {
  calculateEigenfrequency,
  calculateWaveNumberForMode,
} from "../../js/physics/acoustic/OpenOpenTube.js";
import { calculateStandingWaveDisplacement } from "../../js/physics/wave/StandingWave.js";

describe("OpenOpenTube（両端の種類が一致する場合の固有値条件）", () => {
  // TEST-008: 基本振動数(n=1) f1 = v/(2L)
  it("基本振動数がf1=v/(2L)になる（TEST-008）", () => {
    const soundSpeed = 340;
    const tubeLength = 1.0;
    expect(calculateEigenfrequency(1, soundSpeed, tubeLength)).toBeCloseTo(
      soundSpeed / (2 * tubeLength),
      10
    );
  });

  // TEST-009: 両端(x=0とx=L)が常に変位の腹になる（開口-開口の具体例、hasNodeAtOrigin=false）。
  // 「腹になる」とは、時刻によって変位が-A〜+Aの最大振幅まで振れることを意味する。
  // これはcos(kx)の大きさが1であること（=0にならないこと、つまり節でないこと）と同値。
  it("両端(x=0, x=L)が変位の腹になる（TEST-009）", () => {
    const tubeLength = 1.2;
    for (let modeNumber = 1; modeNumber <= 5; modeNumber += 1) {
      const waveNumber = calculateWaveNumberForMode(modeNumber, tubeLength);
      const amplitudeAtSourceEnd = Math.abs(Math.cos(waveNumber * 0));
      const amplitudeAtFarEnd = Math.abs(Math.cos(waveNumber * tubeLength));
      expect(amplitudeAtSourceEnd).toBeCloseTo(1, 10);
      expect(amplitudeAtFarEnd).toBeCloseTo(1, 10);
    }
  });

  // 上と同じ内容を、実際の変位計算(calculateStandingWaveDisplacement)を通しても確認する。
  // t=0のとき、両端の変位の大きさがちょうど振幅Aと一致するはず。
  it("t=0において両端の変位の大きさが振幅Aと一致する", () => {
    const amplitude = 0.5;
    const tubeLength = 0.8;
    const modeNumber = 2;
    const waveNumber = calculateWaveNumberForMode(modeNumber, tubeLength);
    const parameters = { amplitude, waveNumber, angularFrequency: 10 };

    expect(Math.abs(calculateStandingWaveDisplacement(0, 0, parameters))).toBeCloseTo(amplitude, 10);
    expect(Math.abs(calculateStandingWaveDisplacement(tubeLength, 0, parameters))).toBeCloseTo(
      amplitude,
      10
    );
  });

  // TEST-013: 気柱長Lを2倍にすると、固有振動数f_nは1/2になる（f_n = nv/2Lの反比例関係）。
  it("気柱長を2倍にすると固有振動数が半分になる（TEST-013）", () => {
    const soundSpeed = 340;
    const modeNumber = 3;
    const f1 = calculateEigenfrequency(modeNumber, soundSpeed, 1.0);
    const f2 = calculateEigenfrequency(modeNumber, soundSpeed, 2.0);
    expect(f2).toBeCloseTo(f1 / 2, 10);
  });

  // TEST-014: 音速vに比例して固有振動数も変化する。
  it("音速に比例して固有振動数が変化する（TEST-014）", () => {
    const tubeLength = 1.0;
    const modeNumber = 1;
    const fAt340 = calculateEigenfrequency(modeNumber, 340, tubeLength);
    const fAt680 = calculateEigenfrequency(modeNumber, 680, tubeLength);
    expect(fAt680).toBeCloseTo(fAt340 * 2, 10);
  });

  // 実効長L_eff（開口端補正Δx込みの長さ、または単なるtubeLengthそのもの）を渡すだけの
  // モジュールになったため、L_effの計算自体はjs/physics/acoustic/AirColumn.js側の責務。
  // ここではL_eff=tubeLengthのとき（Δx=0相当）と、L_eff=tubeLength+2Δxを直接渡したとき
  // （両端開管でΔx>0のとき、js/physics/acoustic/AirColumn.jsが計算する値）の両方を検証する。
  it("実効長がtubeLengthそのものと一致するとき、補正なしの式と一致する", () => {
    expect(calculateEigenfrequency(1, 340, 1.0)).toBeCloseTo(340 / (2 * 1.0), 10);
    expect(calculateWaveNumberForMode(1, 1.0)).toBeCloseTo(Math.PI / 1.0, 10);
  });

  it("実効長L_eff=L+2Δxを渡すと、固有振動数はf_n=nv/(2L_eff)になる", () => {
    const soundSpeed = 340;
    const tubeLength = 1.0;
    const endCorrection = 0.02;
    const modeNumber = 1;
    const effectiveLength = tubeLength + 2 * endCorrection;
    const expected = (modeNumber * soundSpeed) / (2 * effectiveLength);
    expect(calculateEigenfrequency(modeNumber, soundSpeed, effectiveLength)).toBeCloseTo(expected, 10);
    // 管が実質的に長くなるため、補正なしのときより固有振動数は必ず下がる。
    expect(calculateEigenfrequency(modeNumber, soundSpeed, effectiveLength)).toBeLessThan(
      calculateEigenfrequency(modeNumber, soundSpeed, tubeLength)
    );
  });
});
