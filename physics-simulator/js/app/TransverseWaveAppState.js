// 横波（定常波）のApplication Layerの状態（js/app/AppState.js・AirColumnAppState.jsと対になる構造）。
// TransverseWaveStateが物理的な状態を持つのに対し、こちらはアプリの操作状態
// （再生中かどうか・再生速度）だけを持つ。
//
// 指示書で確認済みの機能範囲により、mode（表示モード切替）・selectedIndex（粒子選択）は
// 持たない（このモードは粒子を表示せず、3本の曲線を常時同時に表示するため、
// 気柱振動のようなMODE_PARTICLES等の切り替えが不要）。
import { DEFAULT_PLAYBACK_SPEED } from "../utils/constants.js";

/**
 * TransverseWaveAppStateを作る。
 *
 * @param {Object} transverseWaveState - このAppStateが操作対象とするTransverseWaveState
 * @returns {Object} TransverseWaveAppState
 *   transverseWaveState:  紐づくTransverseWaveStateへの参照
 *   isPlaying:             再生中かどうか
 *   playbackSpeed:         再生速度の倍率
 */
export function createTransverseWaveAppState(transverseWaveState) {
  return {
    transverseWaveState,
    isPlaying: true,
    playbackSpeed: DEFAULT_PLAYBACK_SPEED,
  };
}
