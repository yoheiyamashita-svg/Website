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
import {
  MODE_FULL_EXPLANATION,
  MODE_PARTICLES,
  MODE_PARTICLES_AND_WAVE,
  MODE_WAVE_ONLY,
} from "../utils/constants.js";

// 気柱振動タブだけで使う4つ目のモード「波形のみ」を加えたモードボタンの一覧
// （js/ui/ModeSelector.jsのデフォルトのMODE_LABELSは縦波と共用の3モードのままにし、
// 気柱振動タブだけこの4モード版を渡すことで、縦波タブには影響を与えない）。
const AIR_COLUMN_MODE_LABELS = [
  { mode: MODE_PARTICLES, label: "Mode A: 粒子のみ" },
  { mode: MODE_PARTICLES_AND_WAVE, label: "Mode B: 粒子 + 波形" },
  { mode: MODE_FULL_EXPLANATION, label: "Mode C: 粒子 + 波形 + 対応矢印" },
  { mode: MODE_WAVE_ONLY, label: "Mode D: 波形のみ" },
];

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
  // 気柱振動タブだけの4つ目のモード「波形のみ」を含めるため、modeLabelsを明示的に渡す。
  modeContainer.appendChild(
    createModeSelector({ appState, onModeChange: () => {}, modeLabels: AIR_COLUMN_MODE_LABELS }).element
  );

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
      tubeVisible: appState.tubeVisible,
    });
    particleInspector.update();
    formulaDisplay.update();
  }

  function handleResize() {
    airColumnRenderer.resizeToDisplaySize();
  }

  return { tick, handleResize };
}
