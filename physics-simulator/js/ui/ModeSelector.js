// Mode A/B/Cを切り替えるボタン群（REQ-104）。
//
// このモジュールはappState.modeの値を書き換えるだけで、simulationStateには一切触れない。
// これにより「表示モードを切り替えても、時刻・粒子の状態・物理パラメータはリセットされない」
// というREQ-104の要件を、実装上自然に満たせる（変更対象がAppStateだけだから）。
import { MODE_FULL_EXPLANATION, MODE_PARTICLES, MODE_PARTICLES_AND_WAVE } from "../utils/constants.js";

// JavaScript構文メモ：これは「配列リテラル」で、{mode, label}という形の
// オブジェクトを3つ並べたもの。下のcreateModeSelector内でmap()を使い、
// 1つずつボタンに変換していく。
const MODE_LABELS = [
  { mode: MODE_PARTICLES, label: "Mode A: 粒子のみ" },
  { mode: MODE_PARTICLES_AND_WAVE, label: "Mode B: 粒子 + 波形" },
  { mode: MODE_FULL_EXPLANATION, label: "Mode C: 粒子 + 波形 + 対応矢印" },
];

/**
 * モード切替ボタン群を作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - mode を持つAppState
 * @param {(mode: string) => void} params.onModeChange - モードが切り替わった後に呼ばれる
 * @returns {{element: HTMLElement}}
 */
export function createModeSelector({ appState, onModeChange }) {
  const wrapper = document.createElement("div");
  wrapper.className = "mode-selector";

  // Array.prototype.mapは、配列の各要素をコールバック関数の戻り値に置き換えて
  // 新しい配列を作る高階関数。ここでは「{mode, label}の設定情報」を
  // 「実際に画面に置くbutton要素」に変換している。
  const buttons = MODE_LABELS.map(({ mode, label }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => {
      appState.mode = mode;
      updateActiveButton();
      onModeChange(mode);
    });
    wrapper.appendChild(button);
    return { mode, button };
  });

  // 現在選択中のモードに対応するボタンだけに"active"のCSSクラスを付け、
  // どのモードが選ばれているかを視覚的に分かるようにする。
  // classList.toggle(className, force)は、forceがtrueならクラスを付け、
  // falseなら外すDOM APIのメソッド。
  function updateActiveButton() {
    buttons.forEach(({ mode, button }) => {
      button.classList.toggle("active", mode === appState.mode);
    });
  }

  updateActiveButton();

  return { element: wrapper };
}
