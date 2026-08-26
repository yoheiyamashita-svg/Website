// 両端開管の境界条件の単体テスト（physics.md §18, §20、指示書§17-1・§45-46 TEST-008/009/013/014）。
import { describe, expect, it } from "vitest";
import {
  calculateEigenfrequency,
  calculateWaveNumberForMode,
} from "../../js/physics/acoustic/OpenOpenTube.js";
import { calculateStandingWaveDisplacement } from "../../js/physics/wave/StandingWave.js";

describe("OpenOpenTube", () => {
  // TEST-008: 基本振動数(n=1) f1 = v/(2L)
  it("基本振動数がf1=v/(2L)になる（TEST-008）", () => {
    const soundSpeed = 340;
    const tubeLength = 1.0;
    expect(calculateEigenfrequency(1, soundSpeed, tubeLength)).toBeCloseTo(
      soundSpeed / (2 * tubeLength),
      10
    );
  });

  // TEST-009: 両端(x=0とx=L)が常に変位の腹になる。
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

  // 開口端補正Δx：ユーザー要望「Δx=0のときは今のままでOK」の裏返しの確認。
  // endCorrection引数を省略した場合(=0扱い)と、明示的に0を渡した場合が完全に一致すること。
  it("開口端補正Δxを省略した場合と明示的に0を渡した場合が一致する", () => {
    expect(calculateEigenfrequency(1, 340, 1.0)).toBe(calculateEigenfrequency(1, 340, 1.0, 0));
    expect(calculateWaveNumberForMode(1, 1.0)).toBe(calculateWaveNumberForMode(1, 1.0, 0));
  });

  // 両端開管ではΔxが両端に効くため、実効長L_eff = L + 2Δxになる
  // （js/physics/acoustic/OpenOpenTube.js のコメント参照）。
  it("開口端補正Δx>0のとき、固有振動数はf_n=nv/(2(L+2Δx))になる", () => {
    const soundSpeed = 340;
    const tubeLength = 1.0;
    const endCorrection = 0.02;
    const modeNumber = 1;
    const expected = (modeNumber * soundSpeed) / (2 * (tubeLength + 2 * endCorrection));
    expect(calculateEigenfrequency(modeNumber, soundSpeed, tubeLength, endCorrection)).toBeCloseTo(
      expected,
      10
    );
    // 管が実質的に長くなるため、補正なしのときより固有振動数は必ず下がる。
    expect(calculateEigenfrequency(modeNumber, soundSpeed, tubeLength, endCorrection)).toBeLessThan(
      calculateEigenfrequency(modeNumber, soundSpeed, tubeLength)
    );
  });
});
