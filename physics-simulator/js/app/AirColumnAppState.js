// 気柱振動のApplication Layerの状態（js/app/AppState.jsの気柱振動版）。
// AirColumnStateが物理的な状態を持つのに対し、こちらはアプリの操作状態
// （再生中か・どの表示モードか・どの列を選択中か）を持つ。
import { DEFAULT_PLAYBACK_SPEED, MODE_PARTICLES_AND_WAVE } from "../utils/constants.js";

/**
 * AirColumnAppStateを作る。
 *
 * @param {Object} airColumnState - このAppStateが操作対象とするAirColumnState
 * @returns {Object} AirColumnAppState
 *   airColumnState:        紐づくAirColumnStateへの参照
 *   mode:                  現在の表示モード（MODE_PARTICLES等、縦波と同じ定数を共用。
 *                            MODE_WAVE_ONLYは気柱振動タブだけで使う4つ目のモード）
 *   isPlaying:             再生中かどうか
 *   playbackSpeed:         再生速度の倍率
 *   selectedColumnIndex:   選択中の列番号（未選択はnull）
 *   tubeVisible:           管の外枠を表示するかどうか（物理には無関係な表示専用フラグ）
 */
export function createAirColumnAppState(airColumnState) {
  return {
    airColumnState,
    mode: MODE_PARTICLES_AND_WAVE,
    isPlaying: true,
    playbackSpeed: DEFAULT_PLAYBACK_SPEED,
    selectedColumnIndex: null,
    tubeVisible: true,
  };
}
