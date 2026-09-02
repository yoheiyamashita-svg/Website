// 横波の反射（パルス）のApplication Layerの状態（js/app/TransverseWaveAppState.jsの姉妹版）。
// このモードも粒子選択・学習モードは持たない（ユーザー確認済みの機能範囲）。
import { DEFAULT_PLAYBACK_SPEED } from "../utils/constants.js";

/**
 * PulseReflectionAppStateを作る。
 *
 * @param {Object} pulseReflectionState - このAppStateが操作対象とするPulseReflectionState
 * @returns {Object} PulseReflectionAppState
 *   pulseReflectionState: 紐づくPulseReflectionStateへの参照
 *   isPlaying:             再生中かどうか
 *   playbackSpeed:         再生速度の倍率
 */
export function createPulseReflectionAppState(pulseReflectionState) {
  return {
    pulseReflectionState,
    isPlaying: true,
    playbackSpeed: DEFAULT_PLAYBACK_SPEED,
  };
}
