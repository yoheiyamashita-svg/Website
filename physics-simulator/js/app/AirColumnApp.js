// Application Layer：気柱振動用の組み立て役（js/app/App.jsの気柱振動版）。
import { createAirColumnState } from "../simulation/AirColumnState.js";
import { advanceAirColumnTime, updateColumns } from "../simulation/AirColumnSimulation.js";
import { createAirColumnAppState } from "./AirColumnAppState.js";
import { AirColumnRenderer } from "../renderer/acoustic/AirColumnRenderer.js";
import { createAirColumnControls, createAirColumnPlaybackControls } from "../ui/acoustic/AirColumnControls.js";
import { createModeSelector } from "../ui/ModeSelector.js";
import { createAirColumnParticleInspector } from "../ui/acoustic/AirColumnParticleInspector.js";
import { createAirColumnFormulaDisplay } from "../ui/acoustic/AirColumnFormulaDisplay.js";
import { createAirColumnLearningMode } from "../ui/acoustic/AirColumnLearningMode.js";

/**
 * 気柱振動アプリケーション全体を初期化し、毎フレーム呼び出すためのtick関数を返す。
 *
 * @param {Object} params
 * @param {HTMLCanvasElement} params.canvasElement
 * @param {HTMLElement} params.parameterContainer
 * @param {HTMLElement} params.playbackContainer
 * @param {HTMLElement} params.modeContainer
 * @param {HTMLElement} params.inspectorContainer
 * @param {HTMLElement} params.formulaContainer
 * @param {HTMLElement} params.learningModeContainer
 * @returns {{tick: (deltaTimeSeconds:number)=>void, handleResize: ()=>void}}
 */
export function createAirColumnApp({
  canvasElement,
  parameterContainer,
  playbackContainer,
  modeContainer,
  inspectorContainer,
  formulaContainer,
  learningModeContainer,
}) {
  const airColumnState = createAirColumnState();
  // 生成直後のt=0でも正しい変位が反映された状態で最初のフレームを描けるようにしておく
  // （縦波側のApp.jsと同じ理由）。
  updateColumns(airColumnState);

  const appState = createAirColumnAppState(airColumnState);
  const airColumnRenderer = new AirColumnRenderer(canvasElement);

  const parameterControls = createAirColumnControls({ appState });
  const playbackControls = createAirColumnPlaybackControls({ appState });
  parameterContainer.appendChild(parameterControls.element);
  playbackContainer.appendChild(playbackControls.element);
  // ModeSelectorはappState.modeとモード定数だけに依存する汎用実装のため、
  // 縦波用に作ったjs/ui/ModeSelector.jsをそのまま再利用する（新規ファイルを作らない）。
  modeContainer.appendChild(createModeSelector({ appState, onModeChange: () => {} }).element);

  const particleInspector = createAirColumnParticleInspector({
    appState,
    canvasElement,
    findNearestColumnIndex: (canvasYPx, columns) =>
      airColumnRenderer.findNearestColumnIndex(canvasYPx, columns),
  });
  inspectorContainer.appendChild(particleInspector.element);

  const formulaDisplay = createAirColumnFormulaDisplay({ appState });
  formulaContainer.appendChild(formulaDisplay.element);

  const learningMode = createAirColumnLearningMode({ parameterControls, playbackControls });
  learningModeContainer.appendChild(learningMode.element);

  function tick(deltaTimeSeconds) {
    if (appState.isPlaying) {
      advanceAirColumnTime(airColumnState, deltaTimeSeconds * appState.playbackSpeed);
    }
    airColumnRenderer.render(airColumnState, appState.mode, {
      highlightedColumnIndex: appState.selectedColumnIndex,
    });
    particleInspector.update();
    formulaDisplay.update();
  }

  function handleResize() {
    airColumnRenderer.resizeToDisplaySize();
  }

  return { tick, handleResize };
}
