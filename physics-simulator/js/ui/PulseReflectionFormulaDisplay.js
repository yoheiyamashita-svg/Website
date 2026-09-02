// 横波の反射（パルス）モードの数式表示（js/ui/TransverseWaveFormulaDisplay.jsの姉妹版）。
// KaTeXの使い方・フォールバック方針は他のFormulaDisplay系と同じ。
//
// 横波（定常波）タブの数式表示は「入射波・反射波を足すと和積公式でcos/sinの
// 積の形に簡単化できる」という導出過程を見せているが、このタブのパルスは
// 三角関数の無限に続く波ではなく局所的な形（山1つ/S字型）なので、
// 同様の三角関数の恒等式による簡単化は存在しない。そのため、このモジュールは
// 「入射波→反射波→合成波はその2つを足すだけ」という重ね合わせの構造だけを
// そのまま示す、導出ステップのない単純な数式表示にする
// （js/physics/wave/PulseWave.jsのヘッダーコメントにある鏡像法の説明も参照）。
import { PULSE_SHAPE_BUMP } from "../utils/constants.js";

/**
 * 横波の反射（パルス）モードの数式表示パネルを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - pulseReflectionStateを持つAppState
 * @returns {{element: HTMLElement, update: () => void}}
 */
export function createPulseReflectionFormulaDisplay({ appState }) {
  const wrapper = document.createElement("div");
  wrapper.className = "formula-display";

  function createFormulaStep(labelText) {
    const stepEl = document.createElement("div");
    stepEl.className = "formula-step";
    const labelEl = document.createElement("div");
    labelEl.className = "formula-step-label";
    labelEl.textContent = labelText;
    const formulaEl = document.createElement("div");
    stepEl.appendChild(labelEl);
    stepEl.appendChild(formulaEl);
    wrapper.appendChild(stepEl);
    return formulaEl;
  }

  const incidentWaveFormulaEl = createFormulaStep("① 入射波（振動源→右端に進むパルス）");
  const reflectedWaveFormulaEl = createFormulaStep("② 反射波（右端で反射して戻るパルス）");
  const combinedFormulaEl = createFormulaStep("③ 合成波（①＋②を足し合わせる）");
  const shapeNoteEl = createFormulaStep("f(s) の形");

  let lastRenderedKey = null;

  function update() {
    const { amplitude, mediumLength, endType, shape } = appState.pulseReflectionState;
    const key = `${amplitude}|${mediumLength}|${endType}|${shape}|${!!window.katex}`;
    if (key === lastRenderedKey) {
      return;
    }
    lastRenderedKey = key;

    const isFixedEnd = endType === "fixed";
    const epsilonText = isFixedEnd ? "-1" : "+1";

    // 物理式:
    //   u1(x,t) = A f(x - vt - x0)
    //   u2(x,t) = ε A f(2L - x - vt - x0)   ε=+1(自由端)/-1(固定端)
    //   u(x,t) = u1 + u2
    // x0（パルスの初期位置）はjs/physics/wave/PulseWave.jsのcalculateLaunchOffsetが
    // 決める、表示上の補助的な定数のため、数式上は明示せず省略している。
    const incidentLatex = `u_1(x,t) = A\\ f(x - vt)`;
    const reflectedLatex = `u_2(x,t) = \\varepsilon\\ A\\ f(2L - x - vt),\\ \\ \\varepsilon = ${epsilonText}\\ (L=${mediumLength.toFixed(2)}\\text{m})`;
    const combinedLatex = `u(x,t) = u_1(x,t) + u_2(x,t)`;

    const shapeLatex =
      shape === PULSE_SHAPE_BUMP
        ? `f(s) = \\begin{cases}\\dfrac{1}{2}\\left(1+\\cos\\dfrac{\\pi s}{w}\\right) & (|s|<w) \\\\ 0 & (|s|\\geq w)\\end{cases}\\quad\\text{（単一の山）}`
        : `f(s) = \\begin{cases}\\sin\\!\\dfrac{\\pi s}{w}\\cdot\\dfrac{1}{2}\\left(1+\\cos\\dfrac{\\pi s}{w}\\right) & (|s|<w) \\\\ 0 & (|s|\\geq w)\\end{cases}\\quad\\text{（S字型）}`;

    if (!window.katex) {
      incidentWaveFormulaEl.textContent = `u1(x,t) = A f(x - vt)`;
      reflectedWaveFormulaEl.textContent = `u2(x,t) = ε A f(2L - x - vt), ε=${epsilonText} (L=${mediumLength.toFixed(2)}m)`;
      combinedFormulaEl.textContent = `u(x,t) = u1(x,t) + u2(x,t)`;
      shapeNoteEl.textContent =
        shape === PULSE_SHAPE_BUMP
          ? `f(s) = 0.5(1+cos(πs/w)) (|s|<w), それ以外は0 （単一の山）`
          : `f(s) = sin(πs/w)×0.5(1+cos(πs/w)) (|s|<w), それ以外は0 （S字型）`;
      return;
    }

    window.katex.render(incidentLatex, incidentWaveFormulaEl);
    window.katex.render(reflectedLatex, reflectedWaveFormulaEl);
    window.katex.render(combinedLatex, combinedFormulaEl);
    window.katex.render(shapeLatex, shapeNoteEl);
  }

  update();

  return { element: wrapper, update };
}
