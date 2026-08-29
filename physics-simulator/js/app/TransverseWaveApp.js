// Application Layer：横波（定常波）用の組み立て役（js/app/App.js・AirColumnApp.jsと対になる構造）。
//
// 指示書で確認済みの機能範囲：学習モード・粒子選択/情報表示は持たない。
// パラメータ操作・再生制御・数式表示（KaTeX）だけを配線する。
import { createTransverseWaveState } from "../simulation/TransverseWaveState.js";
import { advanceTransverseWaveTime, updatePoints } from "../simulation/TransverseWaveSimulation.js";
import { createTransverseWaveAppState } from "./TransverseWaveAppState.js";
import { TransverseWaveRenderer } from "../renderer/TransverseWaveRenderer.js";
import {
  createTransverseWaveControls,
  createTransverseWavePlaybackControls,
} from "../ui/TransverseWaveControls.js";
import { createTransverseWaveFormulaDisplay } from "../ui/TransverseWaveFormulaDisplay.js";

/**
 * 横波（定常波）アプリケーション全体を初期化し、毎フレーム呼び出すためのtick関数を返す。
 *
 * @param {Object} params
 * @param {HTMLCanvasElement} params.canvasElement
 * @param {HTMLElement} params.parameterContainer
 * @param {HTMLElement} params.playbackContainer
 * @param {HTMLElement} params.formulaContainer
 * @returns {{tick: (deltaTimeSeconds:number)=>void, handleResize: ()=>void}}
 */
export function createTransverseWaveApp({
  canvasElement,
  parameterContainer,
  playbackContainer,
  formulaContainer,
}) {
  const transverseWaveState = createTransverseWaveState();
  // 生成直後のt=0でも正しい変位が反映された状態で最初のフレームを描けるようにしておく
  // （縦波側App.js・気柱振動側AirColumnApp.jsと同じ理由）。
  updatePoints(transverseWaveState);

  const appState = createTransverseWaveAppState(transverseWaveState);
  const renderer = new TransverseWaveRenderer(canvasElement);

  const parameterControls = createTransverseWaveControls({ appState });
  const playbackControls = createTransverseWavePlaybackControls({ appState });
  parameterContainer.appendChild(parameterControls.element);
  playbackContainer.appendChild(playbackControls.element);

  const formulaDisplay = createTransverseWaveFormulaDisplay({ appState });
  formulaContainer.appendChild(formulaDisplay.element);

  function tick(deltaTimeSeconds) {
    if (appState.isPlaying) {
      advanceTransverseWaveTime(transverseWaveState, deltaTimeSeconds * appState.playbackSpeed);
    }
    renderer.render(transverseWaveState);
    formulaDisplay.update();
  }

  function handleResize() {
    renderer.resizeToDisplaySize();
  }

  return { tick, handleResize };
}
