// 横波（定常波）モードの数式表示（js/ui/acoustic/AirColumnFormulaDisplay.jsと対になる構造）。
// KaTeXの使い方・フォールバック方針はFormulaDisplay.js/AirColumnFormulaDisplay.jsと同じ。
//
// 【入射波・反射波・重ね合わせの表示について】
// このモードの合成波 u = u1 + u2 は、気柱振動と同じく「1つの波」ではなく、
//   右向き波（入射波） u1(x,t) = a sin(kx-ωt+φ)
//   左向き波（反射波） u2(x,t) = a sin(kx+ωt+φ)
// という2つの逆向きの進行波の重ね合わせである（js/physics/wave/TransverseStandingWave.js）。
// 位相φは左端(x=0)の境界条件だけで決まる（固定端:φ=0、自由端:φ=π/2）。
// このモジュールは、最終形の式だけでなく
//   入射波 u1 → 反射波 u2 → 重ね合わせ(u1+u2) → 和積公式を適用した最終形
// という導出過程を、実際の数値（k・振幅）を代入した実数の式として順番に表示する。
//
// 【④の和積公式の導出】
//   u1+u2 = a[sin(kx-ωt+φ) + sin(kx+ωt+φ)]
//   和積公式 sinP+sinQ = 2 sin((P+Q)/2) cos((P-Q)/2) を、P=kx-ωt+φ, Q=kx+ωt+φ に適用すると
//     (P+Q)/2 = kx+φ,  (P-Q)/2 = -ωt
//   なので
//     u(x,t) = 2a sin(kx+φ) cos(ωt)
//   φ=0（固定端）ならsin(kx)、φ=π/2（自由端）ならsin(kx+π/2)=cos(kx)となる。
// 右端(x=L)の境界条件は、kL（両端一致ならkL/π、不一致なら(kL-π/2)/π）が整数のとき
// （＝共鳴のとき）しか厳密には成り立たない（js/physics/wave/TransverseStandingWave.js
// のヘッダーコメント参照）。共鳴からズレるほど実効振幅a（＝共鳴応答response×A/2）が
// なめらかに小さくなるため、⑤で共鳴の度合いを表示する。
import { calculateWaveNumber } from "../physics/wave/TravelingWave.js";
import { END_TYPE_FREE } from "../utils/constants.js";

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

  const incidentWaveFormulaEl = createFormulaStep("① 右向き波（入射波）");
  const reflectedWaveFormulaEl = createFormulaStep("② 左向き波（反射波）");
  const sumFormulaEl = createFormulaStep("③ 重ね合わせ（①＋②を足し合わせる）");
  const combinedFormulaEl = createFormulaStep("④ 和積公式を適用（合成波の完成）");
  const resonanceFormulaEl = createFormulaStep("⑤ 共鳴の度合い");

  let lastRenderedKey = null;

  function update() {
    const { amplitude, wavelength, frequency, leftEndType, resonanceResponse } = appState.transverseWaveState;
    const key = `${amplitude}|${wavelength}|${frequency}|${leftEndType}|${resonanceResponse}|${!!window.katex}`;
    if (key === lastRenderedKey) {
      return;
    }
    lastRenderedKey = key;

    const waveNumber = calculateWaveNumber(wavelength);
    const kText = waveNumber.toFixed(2);
    const isLeftFree = leftEndType === END_TYPE_FREE;
    // 実効半振幅a：共鳴からズレるほどresonanceResponse(0〜1)が小さくなり、
    // u1・u2・合成波すべての振幅が一緒に縮む（js/simulation/TransverseWaveSimulation.js参照）。
    const effectiveHalfAmplitude = (amplitude / 2) * resonanceResponse;
    const effectiveAmplitude = amplitude * resonanceResponse;
    const phaseTermLatex = isLeftFree ? " + \\dfrac{\\pi}{2}" : "";
    const phaseTermText = isLeftFree ? " + π/2" : "";

    // 物理式:
    //   u1(x,t) = a sin(kx - ωt + φ)
    const incidentLatex = `u_1(x,t) = ${effectiveHalfAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x - \\omega t${phaseTermLatex}\\right)`;

    // 物理式:
    //   u2(x,t) = a sin(kx + ωt + φ)
    const reflectedLatex = `u_2(x,t) = ${effectiveHalfAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x + \\omega t${phaseTermLatex}\\right)`;

    // 物理式（重ね合わせ、まだ簡単化する前）:
    //   u(x,t) = u1 + u2 = a sin(kx-ωt+φ) + a sin(kx+ωt+φ)
    const sumLatex =
      `u(x,t) = u_1+u_2 = ${effectiveHalfAmplitude.toFixed(3)}\\sin\\!\\left(${kText}x-\\omega t${phaseTermLatex}\\right) ` +
      `+ ${effectiveHalfAmplitude.toFixed(3)}\\sin\\!\\left(${kText}x+\\omega t${phaseTermLatex}\\right)`;

    // 物理式（和積公式を適用した最終形。ファイル冒頭コメントの導出参照）:
    //   固定端(φ=0): u(x,t) = A' sin(kx) cos(ωt)
    //   自由端(φ=π/2): u(x,t) = A' cos(kx) cos(ωt)
    //   （A' = amplitude × resonanceResponse、共鳴からズレるほど小さくなる実効振幅）
    const combinedLatex = isLeftFree
      ? `u(x,t) = ${effectiveAmplitude.toFixed(3)}\\ \\cos\\!\\left(${kText}x\\right)\\ \\cos(\\omega t)`
      : `u(x,t) = ${effectiveAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x\\right)\\ \\cos(\\omega t)`;

    // 共鳴の度合いの表示。resonanceResponseは0〜1（共鳴のとき1、離れるほど0に近づくが
    // 厳密には0にならない、共振曲線・ローレンツ型。js/physics/wave/TransverseStandingWave.js
    // のcalculateResonanceResponse参照）。90%以上を目安に「共鳴中」とみなす。
    const responsePercent = (resonanceResponse * 100).toFixed(0);
    const isNearResonance = resonanceResponse >= 0.9;
    const resonanceStatusText = isNearResonance
      ? `共鳴中（振幅の応答 ${responsePercent}%）：両端とも境界条件どおりに振動しています。`
      : `共鳴から外れています（振幅の応答 ${responsePercent}%）：振幅がほぼ0まで小さくなり、厳密には0ではありませんが実質的に静止して見えます。`;

    if (!window.katex) {
      incidentWaveFormulaEl.textContent = `u1(x,t) = ${effectiveHalfAmplitude.toFixed(3)} sin(${kText}x - ωt${phaseTermText})`;
      reflectedWaveFormulaEl.textContent = `u2(x,t) = ${effectiveHalfAmplitude.toFixed(3)} sin(${kText}x + ωt${phaseTermText})`;
      sumFormulaEl.textContent =
        `u(x,t) = u1+u2 = ${effectiveHalfAmplitude.toFixed(3)}sin(${kText}x-ωt${phaseTermText}) + ${effectiveHalfAmplitude.toFixed(3)}sin(${kText}x+ωt${phaseTermText})`;
      combinedFormulaEl.textContent = isLeftFree
        ? `u(x,t) = ${effectiveAmplitude.toFixed(3)} cos(${kText}x) cos(ωt)`
        : `u(x,t) = ${effectiveAmplitude.toFixed(3)} sin(${kText}x) cos(ωt)`;
      resonanceFormulaEl.textContent = resonanceStatusText;
      return;
    }

    window.katex.render(incidentLatex, incidentWaveFormulaEl);
    window.katex.render(reflectedLatex, reflectedWaveFormulaEl);
    window.katex.render(sumLatex, sumFormulaEl);
    window.katex.render(combinedLatex, combinedFormulaEl);
    resonanceFormulaEl.textContent = resonanceStatusText;
  }

  update();

  return { element: wrapper, update };
}
