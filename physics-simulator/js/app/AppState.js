// Application Layerの状態（architecture.md §3.2）。
//
// SimulationStateが「物理的な状態(振幅・時刻・粒子など)」を持つのに対し、
// AppStateは「アプリの操作状態(再生中か・どの表示モードか等)」を持つ、という
// 役割の違いに注意する。物理量はSimulationState側にしか書かない。
import { DEFAULT_PLAYBACK_SPEED, MODE_PARTICLES_AND_WAVE } from "../utils/constants.js";

/**
 * AppStateを作る。
 *
 * @param {Object} simulationState - このAppStateが操作対象とするSimulationState
 * @returns {Object} AppState
 *   simulationState:         紐づくSimulationStateへの参照
 *   mode:                    現在の表示モード（MODE_PARTICLES等）
 *   isPlaying:               再生中かどうか
 *   playbackSpeed:           再生速度の倍率
 *   selectedParticleIndex:   選択中の粒子番号（未選択はnull。Stage 7で使用）
 */
export function createAppState(simulationState) {
  return {
    simulationState,
    mode: MODE_PARTICLES_AND_WAVE,
    isPlaying: true,
    playbackSpeed: DEFAULT_PLAYBACK_SPEED,
    selectedParticleIndex: null,
  };
}
