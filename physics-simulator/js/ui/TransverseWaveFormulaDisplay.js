// 横波（定常波）モードの数式表示（js/ui/acoustic/AirColumnFormulaDisplay.jsと対になる構造）。
// KaTeXの使い方・フォールバック方針はFormulaDisplay.js/AirColumnFormulaDisplay.jsと同じ。
//
// 【入射波・反射波・重ね合わせの表示について】
// このモードの合成波 u = u1 + u2 は、気柱振動と同じく「1つの波」ではなく、
//   右向き波（入射波） u1(x,t) = (A/2) sin(kx-ωt)   … TravelingWave.jsの定義そのまま
//   左向き波（反射波） u2(x,t) = ε(A/2) sin(2kL-kx-ωt) … js/physics/wave/ReflectedWave.js
// という2つの逆向きの進行波の重ね合わせである（ε=+1:自由端 / -1:固定端）。
// このモジュールは、最終形の式だけでなく
//   入射波 u1 → 反射波 u2 → 重ね合わせ(u1+u2) → 和積公式を適用した最終形
// という導出過程を、実際の数値（k・振幅）を代入した実数の式として順番に表示する。
//
// 【④の和積公式の導出（自由端 ε=+1 の場合）】
//   u1+u2 = (A/2)[sin(kx-ωt) + sin(2kL-kx-ωt)]
//   和積公式 sinP+sinQ = 2 sin((P+Q)/2) cos((P-Q)/2) を、P=kx-ωt, Q=2kL-kx-ωt に適用すると
//     (P+Q)/2 = kL-ωt,  (P-Q)/2 = kx-kL
//   なので
//     u(x,t) = A sin(kL-ωt) cos(k(x-L)) = A cos(k(x-L)) sin(kL-ωt)
// 【④の和積公式の導出（固定端 ε=-1 の場合）】
//   u1+u2 = (A/2)[sin(kx-ωt) - sin(2kL-kx-ωt)]
//   和積公式 sinP-sinQ = 2 cos((P+Q)/2) sin((P-Q)/2) を同じP, Qに適用すると
//     u(x,t) = A cos(kL-ωt) sin(k(x-L)) = A sin(k(x-L)) cos(kL-ωt)
// どちらの式も「xだけの関数」と「tだけの関数」の積の形になっており、これは定常波の
// 特徴（各点が自分の位置で決まる振幅で単振動する）そのものである。気柱振動の
// u=A cos(kx)cos(ωt) と違い、λ・fを自由に選べる（境界条件によるkの量子化がない）
// モデルのため、xの位相がk(x-L)というLだけずれた形になる。
import { calculateWaveNumber } from "../physics/wave/TravelingWave.js";
import { END_TYPE_FIXED } from "../utils/constants.js";

/**
 * 横波（定常波）モードの数式表示パネルを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - transverseWaveStateを持つAppState
 * @returns {{element: HTMLElement, update: () => void}}
 */
export function createTransverseWaveFormulaDisplay({ appState }) {
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

  const incidentWaveFormulaEl = createFormulaStep("① 右向き波（入射波、左端から右端へ進む）");
  const reflectedWaveFormulaEl = createFormulaStep("② 左向き波（右端で反射して戻る波）");
  const sumFormulaEl = createFormulaStep("③ 重ね合わせ（①＋②を足し合わせる）");
  const combinedFormulaEl = createFormulaStep("④ 和積公式を適用（合成波の完成）");

  let lastRenderedKey = null;

  function update() {
    const { amplitude, wavelength, frequency, mediumLength, endType } = appState.transverseWaveState;
    const key = `${amplitude}|${wavelength}|${frequency}|${mediumLength}|${endType}|${!!window.katex}`;
    if (key === lastRenderedKey) {
      return;
    }
    lastRenderedKey = key;

    const waveNumber = calculateWaveNumber(wavelength);
    const kText = waveNumber.toFixed(2);
    const isFixedEnd = endType === END_TYPE_FIXED;
    const halfAmplitude = amplitude / 2;

    // 物理式:
    //   u1(x,t) = (A/2) sin(kx - ωt)   … TravelingWave.jsの定義(φ=0)そのまま
    const incidentLatex = `u_1(x,t) = ${halfAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x - \\omega t\\right)`;

    // 物理式:
    //   u2(x,t) = ε(A/2) sin(2kL - kx - ωt)   … ε=+1(自由端) / -1(固定端)
    const epsilonSign = isFixedEnd ? "-" : "+";
    const epsilonCoefficient = isFixedEnd ? `-${halfAmplitude.toFixed(3)}` : halfAmplitude.toFixed(3);
    const reflectedLatex = `u_2(x,t) = \\varepsilon\\ (${halfAmplitude.toFixed(3)})\\ \\sin\\!\\left(2\\times${kText}\\times${mediumLength.toFixed(2)} - ${kText}x - \\omega t\\right),\\ \\ \\varepsilon = ${isFixedEnd ? "-1" : "+1"}`;

    // 物理式（重ね合わせ、まだ簡単化する前）:
    //   u(x,t) = u1 + u2 = (A/2)sin(kx-ωt) + ε(A/2)sin(2kL-kx-ωt)
    const sumLatex =
      `u(x,t) = u_1+u_2 = ${halfAmplitude.toFixed(3)}\\sin\\!\\left(${kText}x-\\omega t\\right) ` +
      `${epsilonSign} ${halfAmplitude.toFixed(3)}\\sin\\!\\left(2\\times${kText}\\times${mediumLength.toFixed(2)}-${kText}x-\\omega t\\right)`;

    // 物理式（和積公式を適用した最終形。コメント冒頭の導出参照）:
    //   自由端: u(x,t) = A cos(k(x-L)) sin(kL-ωt)
    //   固定端: u(x,t) = A sin(k(x-L)) cos(kL-ωt)
    const combinedLatex = isFixedEnd
      ? `u(x,t) = ${amplitude.toFixed(2)}\\ \\sin\\!\\left(${kText}(x-${mediumLength.toFixed(2)})\\right)\\ \\cos\\!\\left(${kText}\\times${mediumLength.toFixed(2)}-\\omega t\\right)`
      : `u(x,t) = ${amplitude.toFixed(2)}\\ \\cos\\!\\left(${kText}(x-${mediumLength.toFixed(2)})\\right)\\ \\sin\\!\\left(${kText}\\times${mediumLength.toFixed(2)}-\\omega t\\right)`;

    if (!window.katex) {
      incidentWaveFormulaEl.textContent = `u1(x,t) = ${halfAmplitude.toFixed(3)} sin(${kText}x - ωt)`;
      reflectedWaveFormulaEl.textContent = `u2(x,t) = ε(${halfAmplitude.toFixed(3)}) sin(2×${kText}×${mediumLength.toFixed(2)} - ${kText}x - ωt), ε=${isFixedEnd ? "-1" : "+1"}`;
      sumFormulaEl.textContent =
        `u(x,t) = u1+u2 = ${halfAmplitude.toFixed(3)}sin(${kText}x-ωt) ${epsilonSign} ${halfAmplitude.toFixed(3)}sin(2×${kText}×${mediumLength.toFixed(2)}-${kText}x-ωt)`;
      combinedFormulaEl.textContent = isFixedEnd
        ? `u(x,t) = ${amplitude.toFixed(2)} sin(${kText}(x-${mediumLength.toFixed(2)})) cos(${kText}×${mediumLength.toFixed(2)}-ωt)`
        : `u(x,t) = ${amplitude.toFixed(2)} cos(${kText}(x-${mediumLength.toFixed(2)})) sin(${kText}×${mediumLength.toFixed(2)}-ωt)`;
      return;
    }

    window.katex.render(incidentLatex, incidentWaveFormulaEl);
    window.katex.render(reflectedLatex, reflectedWaveFormulaEl);
    window.katex.render(sumLatex, sumFormulaEl);
    window.katex.render(combinedLatex, combinedFormulaEl);
  }

  update();

  return { element: wrapper, update };
}
