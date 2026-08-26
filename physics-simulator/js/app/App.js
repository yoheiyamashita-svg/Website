// Application Layer：UIとPhysics Engine/Rendererを配線する「組み立て役」
// （architecture.md §3.2）。個々の部品(Slider, CanvasRenderer等)の作り方は知っているが、
// 物理計算そのもの(u, v_p等)や描画の具体的な手順(arc, stroke等)はここには書かない。
import { createSimulationState } from "../simulation/SimulationState.js";
import { advanceSimulationTime, updateParticles } from "../simulation/Simulation.js";
import { createAppState } from "./AppState.js";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { createParameterControls, createPlaybackControls } from "../ui/Controls.js";
import { createModeSelector } from "../ui/ModeSelector.js";
import { createParticleInspector } from "../ui/ParticleInspector.js";
import { createFormulaDisplay } from "../ui/FormulaDisplay.js";
import { createLearningMode } from "../ui/LearningMode.js";

/**
 * アプリケーション全体を初期化し、毎フレーム呼び出すためのtick関数を返す。
 *
 * JavaScript構文メモ：`export function createWaveApp({ canvasElement, ... })`のように
 * 引数を`{ }`で受けるのは分割代入。呼び出し側は
 * `createWaveApp({ canvasElement: ..., parameterContainer: ... })`のように
 * プロパティ名を指定して渡すため、引数の順序を気にする必要がなくなる。
 *
 * @param {Object} params
 * @param {HTMLCanvasElement} params.canvasElement - シミュレーションを描画するcanvas要素
 * @param {HTMLElement} params.parameterContainer - パラメータスライダーを配置するDOM要素
 * @param {HTMLElement} params.playbackContainer - 再生系ボタンを配置するDOM要素
 * @param {HTMLElement} params.modeContainer - モード切替ボタンを配置するDOM要素
 * @param {HTMLElement} params.inspectorContainer - 粒子選択の情報表示を配置するDOM要素
 * @param {HTMLElement} params.formulaContainer - 数式表示を配置するDOM要素
 * @param {HTMLElement} params.learningModeContainer - 学習モードUIを配置するDOM要素
 * @returns {{tick: (deltaTimeSeconds:number)=>void, handleResize: ()=>void}}
 */
export function createWaveApp({
  canvasElement,
  parameterContainer,
  playbackContainer,
  modeContainer,
  inspectorContainer,
  formulaContainer,
  learningModeContainer,
}) {
  const simulationState = createSimulationState();
  // 生成直後の時刻t=0の時点でも、変位が正しく反映された状態で最初のフレームを
  // 描画できるように、ここで一度だけ明示的に更新しておく
  // （t=0でもamplitude/phaseの値次第で変位は0とは限らないため）。
  updateParticles(simulationState);

  const appState = createAppState(simulationState);
  const canvasRenderer = new CanvasRenderer(canvasElement);

  const parameterControls = createParameterControls({ appState });
  const playbackControls = createPlaybackControls({ appState });
  parameterContainer.appendChild(parameterControls.element);
  playbackContainer.appendChild(playbackControls.element);
  modeContainer.appendChild(createModeSelector({ appState, onModeChange: () => {} }).element);

  const particleInspector = createParticleInspector({
    appState,
    canvasElement,
    // クリック位置(px) → 粒子番号の変換は、Canvasの座標変換(transform)を持つ
    // CanvasRenderer側の責務なので、そのメソッドをそのまま渡す。
    findNearestParticleIndex: (canvasXPx, particles) =>
      canvasRenderer.findNearestParticleIndex(canvasXPx, particles),
  });
  inspectorContainer.appendChild(particleInspector.element);

  const formulaDisplay = createFormulaDisplay({ appState });
  formulaContainer.appendChild(formulaDisplay.element);

  const learningMode = createLearningMode({ parameterControls, playbackControls });
  learningModeContainer.appendChild(learningMode.element);

  /**
   * 1フレーム分の更新と描画を行う。main.jsのrequestAnimationFrameループから
   * 毎フレーム呼び出される。
   *
   * @param {number} deltaTimeSeconds - 前フレームからの経過時間 [s]
   */
  function tick(deltaTimeSeconds) {
    if (appState.isPlaying) {
      // 再生速度(playbackSpeed)は「実時間に対して物理時間を何倍の速さで進めるか」の倍率。
      // 例えば2倍速なら、実時間1秒あたり物理時間を2秒分進める。
      advanceSimulationTime(simulationState, deltaTimeSeconds * appState.playbackSpeed);
    }
    canvasRenderer.render(simulationState, appState.mode, {
      highlightedParticleIndex: appState.selectedParticleIndex,
    });
    // 選択中の粒子の変位・速度は時刻とともに変わり続けるため、毎フレーム表示を更新する。
    particleInspector.update();
    // 数式表示側は、パラメータが変化していなければ内部で再描画をスキップする
    // （FormulaDisplay.js参照）ため、ここで毎フレーム呼んでもコストは小さい。
    formulaDisplay.update();
  }

  function handleResize() {
    canvasRenderer.resizeToDisplaySize();
  }

  return { tick, handleResize };
}
