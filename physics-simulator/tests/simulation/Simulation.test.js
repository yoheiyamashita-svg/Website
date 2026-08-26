// physics.md §24 TEST-006/007 に対応する、Simulation Layerのオーケストレーションのテスト。
import { describe, expect, it } from "vitest";
import { createSimulationState } from "../../js/simulation/SimulationState.js";
import { advanceSimulationTime, updateParticles } from "../../js/simulation/Simulation.js";
import { calculateDisplacement } from "../../js/physics/wave/TravelingWave.js";

describe("Simulation", () => {
  // TEST-006: 「粒子表示の変位」と「波形表示の変位」が一致する。
  // このプロジェクトでは、粒子のdisplacementと波形の高さは同じ
  // particle.displacementフィールドを参照する設計（REQ-105）なので、
  // 実質的には「updateParticlesが書き込むdisplacementが、TravelingWave.calculateDisplacement
  // の計算結果と一致しているか」を確認すれば、両者の一致を保証したことになる。
  it("updateParticlesが設定するdisplacementは、TravelingWave.calculateDisplacementの結果と一致する（TEST-006）", () => {
    const simulationState = createSimulationState({ particleCount: 20 });
    simulationState.time = 1.3;

    updateParticles(simulationState);

    const parameters = {
      amplitude: simulationState.amplitude,
      wavelength: simulationState.wavelength,
      frequency: simulationState.frequency,
      phase: simulationState.phase,
    };

    simulationState.particles.forEach((particle) => {
      const expectedDisplacement = calculateDisplacement(
        particle.initialPosition,
        simulationState.time,
        parameters
      );
      expect(particle.displacement).toBeCloseTo(expectedDisplacement, 10);
      // 現在位置 x(t) = x0 + u(x0,t) の関係も同時に確認する（physics.md §5）。
      expect(particle.position).toBeCloseTo(particle.initialPosition + particle.displacement, 10);
    });
  });

  // advanceSimulationTimeは、時刻を進めたうえで粒子の状態も更新することを確認する。
  it("advanceSimulationTimeは時刻を進め、粒子の状態を再計算する", () => {
    const simulationState = createSimulationState({ particleCount: 5, amplitude: 0.5 });
    const initialDisplacement = simulationState.particles[1].displacement;

    advanceSimulationTime(simulationState, 0.25);

    expect(simulationState.time).toBeCloseTo(0.25, 10);
    // 振幅が0でなければ、時間が進めば変位も(基本的には)変化するはず。
    expect(simulationState.particles[1].displacement).not.toBe(initialDisplacement);
  });
});
