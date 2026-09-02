// 横波の反射（パルス）モードの物理エンジンの単体テスト（js/physics/wave/PulseWave.js）。
// 検証したいのは「境界条件（固定端=変位0 / 自由端=傾き0）を、入射波u1と反射波u2を
// 足し合わせた結果が、あらゆる時刻tで、かつどちらのパルス形状(単一の山/S字型)でも
// 満たすか」という点（js/physics/wave/PulseWave.jsのヘッダーコメントで導出した
// 鏡像法が正しいかどうかの直接的な検証）。
import { describe, expect, it } from "vitest";
import {
  calculateIncidentDisplacement,
  calculateLoopDuration,
  calculateReflectedDisplacement,
} from "../../js/physics/wave/PulseWave.js";
import { PULSE_SHAPE_BUMP, PULSE_SHAPE_S } from "../../js/utils/constants.js";

const mediumLength = 4.0;
const pulseWidth = 0.3;
const waveSpeed = 1.0;
const amplitude = 0.5;

function combinedDisplacement(x, t, isFixedEnd, shape) {
  const u1 = calculateIncidentDisplacement(x, t, { amplitude, pulseWidth, waveSpeed, shape });
  const u2 = calculateReflectedDisplacement(x, t, {
    amplitude,
    pulseWidth,
    waveSpeed,
    mediumLength,
    isFixedEnd,
    shape,
  });
  return u1 + u2;
}

describe("PulseWave", () => {
  [PULSE_SHAPE_BUMP, PULSE_SHAPE_S].forEach((shape) => {
    describe(`パルス形状: ${shape}`, () => {
      it("固定端では、あらゆる時刻でx=Lにおける変位がほぼ0になる", () => {
        for (let t = 0; t <= 12; t += 0.37) {
          expect(combinedDisplacement(mediumLength, t, true, shape)).toBeCloseTo(0, 8);
        }
      });

      it("自由端では、あらゆる時刻でx=Lにおける傾きがほぼ0になる", () => {
        const dx = 1e-6;
        for (let t = 0; t <= 12; t += 0.37) {
          const uPlus = combinedDisplacement(mediumLength + dx, t, false, shape);
          const uMinus = combinedDisplacement(mediumLength - dx, t, false, shape);
          const slope = (uPlus - uMinus) / (2 * dx);
          expect(slope).toBeCloseTo(0, 3);
        }
      });
    });
  });

  // ユーザー要望「Δx=0のときは今のままでOK」に相当する、パラメータを省略しない
  // 基本的な健全性チェック：t=0では媒質(x∈[0,L])内にパルスがまだ存在しない
  // （calculateLoopDuration・calculateLaunchOffsetの設計どおり、パルスは
  // 媒質の外側から出発するため）。
  it("t=0では媒質内の変位がほぼ0になる（パルスはまだ媒質の外にいる）", () => {
    const sampleXs = [0, 1, 2, 3, 4];
    sampleXs.forEach((x) => {
      expect(combinedDisplacement(x, 0, true, PULSE_SHAPE_BUMP)).toBeCloseTo(0, 8);
    });
  });

  it("calculateLoopDurationは、パルス幅・媒質長・速さに応じた正の時間を返す", () => {
    const duration = calculateLoopDuration({ pulseWidth, mediumLength, waveSpeed });
    expect(duration).toBeGreaterThan((2 * mediumLength) / waveSpeed);

    const fasterDuration = calculateLoopDuration({
      pulseWidth,
      mediumLength,
      waveSpeed: waveSpeed * 2,
    });
    expect(fasterDuration).toBeCloseTo(duration / 2, 10);
  });
});
