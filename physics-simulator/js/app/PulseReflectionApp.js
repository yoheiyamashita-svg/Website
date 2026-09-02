// Application Layer：横波の反射（パルス）用の組み立て役（js/app/TransverseWaveApp.jsの姉妹版）。
//
// 指示書で確認済みの機能範囲：学習モード・粒子選択/情報表示は持たない。
// パラメータ操作・再生制御（既定で自動ループ）・数式表示（KaTeX）だけを配線する。
import { createPulseReflectionState } from "../simulation/PulseReflectionState.js";
import { advancePulseReflectionTime, updatePoints } from "../simulation/PulseReflectionSimulation.js";
import { createPulseReflectionAppState } from "./PulseReflectionAppState.js";
import { PulseReflectionRenderer } from "../renderer/PulseReflectionRenderer.js";
import {
  createPulseReflectionControls,
  createPulseReflectionPlaybackControls,
} from "../ui/PulseReflectionControls.js";
import { createPulseReflectionFormulaDisplay } from "../ui/PulseReflectionFormulaDisplay.js";

/**
 * 横波の反射（パルス）アプリケーション全体を初期化し、毎フレーム呼び出すための
 * tick関数を返す。
 *
 * @param {Object} params
 * @param {HTMLCanvasElement} params.canvasElement
 * @param {HTMLElement} params.parameterContainer
 * @param {HTMLElement} params.playbackContainer
 * @param {HTMLElement} params.formulaContainer
 * @returns {{tick: (deltaTimeSeconds:number)=>void, handleResize: ()=>void}}
 */
export function createPulseReflectionApp({
  canvasElement,
  parameterContainer,
  playbackContainer,
  formulaContainer,
}) {
  const pulseReflectionState = createPulseReflectionState();
  // 生成直後のt=0でも正しい変位が反映された状態で最初のフレームを描けるようにしておく
  // （他のApp.jsと同じ理由）。
  updatePoints(pulseReflectionState);

  const appState = createPulseReflectionAppState(pulseReflectionState);
  const renderer = new PulseReflectionRenderer(canvasElement);

  const parameterControls = createPulseReflectionControls({ appState });
  const playbackControls = createPulseReflectionPlaybackControls({ appState });
  parameterContainer.appendChild(parameterControls.element);
  playbackContainer.appendChild(playbackControls.element);

  const formulaDisplay = createPulseReflectionFormulaDisplay({ appState });
  formulaContainer.appendChild(formulaDisplay.element);

  function tick(deltaTimeSeconds) {
    if (appState.isPlaying) {
      advancePulseReflectionTime(pulseReflectionState, deltaTimeSeconds * appState.playbackSpeed);
    }
    renderer.render(pulseReflectionState);
    formulaDisplay.update();
  }

  function handleResize() {
    renderer.resizeToDisplaySize();
  }

  return { tick, handleResize };
}
