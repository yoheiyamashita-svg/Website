// Simulation Layerの単体テスト。粒子の初期配置とリセット処理を検証する
// （architecture.md §20「テスト対象：粒子位置」に対応）。
import { describe, expect, it } from "vitest";
import { createSimulationState, resetSimulationParticles } from "../../js/simulation/SimulationState.js";

describe("SimulationState", () => {
  // REQ-101: 粒子数は設定可能。指定した個数どおりに生成されることを確認する。
  it("指定した個数の粒子を生成する", () => {
    const simulationState = createSimulationState({ particleCount: 50 });
    expect(simulationState.particles).toHaveLength(50);
  });

  // physics.md §3: 初期位置 x0_i = i × Δx。等間隔配置になっていることを確認する。
  it("粒子を媒質の全長にわたって等間隔に配置する", () => {
    const mediumLength = 6;
    const particleCount = 4;
    const simulationState = createSimulationState({ particleCount, mediumLength });
    const spacing = mediumLength / (particleCount - 1);

    simulationState.particles.forEach((particle, index) => {
      expect(particle.initialPosition).toBeCloseTo(index * spacing, 10);
    });
    // 最後の粒子は媒質の端(mediumLength)にちょうど位置するはず。
    expect(simulationState.particles.at(-1).initialPosition).toBeCloseTo(mediumLength, 10);
  });

  // リセット操作：時刻が0に戻り、粒子数は変えずに初期配置へ作り直されることを確認する。
  it("resetSimulationParticlesは時刻を0に戻し、粒子数を維持したまま初期配置に戻す", () => {
    const simulationState = createSimulationState({ particleCount: 10 });
    simulationState.time = 3.5;
    simulationState.particles[2].position = 999; // 何か動いた状態を模擬する

    resetSimulationParticles(simulationState);

    expect(simulationState.time).toBe(0);
    expect(simulationState.particles).toHaveLength(10);
    expect(simulationState.particles[2].position).toBe(simulationState.particles[2].initialPosition);
  });
});
