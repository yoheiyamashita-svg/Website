// 気柱振動の数式表示（js/ui/FormulaDisplay.jsの気柱振動版、指示書§31, §42）。
// KaTeXの使い方・フォールバック方針はFormulaDisplay.jsと同じなので、
// そちらのコメントも参照。ここでは気柱振動固有の数式（定常波の式・境界条件ごとのf_n）を扱う。
//
// 【入射波・反射波・重ね合わせの表示について】
// 気柱内の定常波 u(x,t)=A cos(kx)cos(ωt) は、実は「単独で存在する1つの波」ではなく、
// 音源側から反対側へ進む入射波と、反対側で反射して音源側へ戻ってくる反射波という
// 2つの逆向きの進行波が重なり合ってできている（physics.md §14の重ね合わせ導出）。
// このモジュールは、最終形の式だけでなく、
//   入射波 u1 → 反射波 u2 → 重ね合わせ(u1+u2) → 和積公式を適用した最終形
// という導出の過程を、実際の数値（k・振幅）を代入した実数の式として順番に表示する。
//
// 入射波・反射波は、physics.md §4-5で定義した進行波の「定義通り」の式
//   u(x,t) = A sin(kx - ωt + φ)
// の形（sinを使う形）で表す。ただし気柱振動では音源側(x=0)が常に腹でなければならない
// （指示書§15）。sin(0+φ)を最大(=1)にするには φ=π/2 を選べばよく
// （sin(θ+π/2)=cosθ なので、これは結局cos(kx-ωt)と同じものを表す）、
// この位相φ=π/2を選んだ結果として、最終的にcos(kx)cos(ωt)の形に一致する。
// どちらの境界条件（両端開管/一端閉管）でも、u1・u2の式の形自体は同じで、
// 境界条件によって変わるのは波数k（js/physics/acoustic/AirColumn.jsが決定）だけである。
import { calculateEigenfrequency, calculateWaveNumber } from "../../physics/acoustic/AirColumn.js";
import { BOUNDARY_TYPE_OPEN_CLOSED } from "../../utils/constants.js";

/**
 * 気柱振動の数式表示パネルを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - airColumnStateを持つAppState
 * @returns {{element: HTMLElement, update: () => void}}
 */
export function createAirColumnFormulaDisplay({ appState }) {
  const wrapper = document.createElement("div");
  wrapper.className = "formula-display";

  // 導出過程の各ステップに「ラベル + 数式」の組を作るヘルパー。
  // ラベルで「今どの段階の式か」を示し、その下にKaTeXで数式を描画する。
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

  const incidentWaveFormulaEl = createFormulaStep("① 入射波（音源側から反対側へ進む波）");
  const reflectedWaveFormulaEl = createFormulaStep("② 反射波（反対側から音源側へ戻る波）");
  const sumFormulaEl = createFormulaStep("③ 重ね合わせ（①＋②を足し合わせる）");
  const displacementFormulaEl = createFormulaStep("④ 和積公式を適用（定常波の完成）");
  const eigenfrequencyFormulaEl = createFormulaStep("固有振動数");

  let lastRenderedKey = null;

  function update() {
    const { amplitude, tubeLength, soundSpeed, boundaryType, modeNumber, endCorrection } = appState.airColumnState;
    const key = `${amplitude}|${tubeLength}|${soundSpeed}|${boundaryType}|${modeNumber}|${endCorrection}|${!!window.katex}`;
    if (key === lastRenderedKey) {
      return;
    }
    lastRenderedKey = key;

    const waveNumber = calculateWaveNumber(boundaryType, modeNumber, tubeLength, endCorrection);
    const eigenfrequency = calculateEigenfrequency(boundaryType, modeNumber, soundSpeed, tubeLength, endCorrection);
    const kText = waveNumber.toFixed(2);

    // 入射波・反射波は、それぞれ振幅A/2の進行波としてモデル化する
    // （2つを重ね合わせるとちょうど振幅Aの定常波になるように。physics.md §14参照）。
    // physics.md §4-5の進行波の定義 u(x,t)=A sin(kx-ωt+φ) の形（sinを使う形）で表し、
    // 音源側(x=0)を腹にするための位相φ=π/2を代入する。
    //
    // 物理式:
    //   u1(x,t) = (A/2) sin(kx - ωt + π/2)   … +x方向（音源→反対側）に進む入射波
    //   u2(x,t) = (A/2) sin(kx + ωt + π/2)   … -x方向（反対側→音源）に進む反射波
    const halfAmplitude = amplitude / 2;
    const incidentLatex = `u_1(x,t) = ${halfAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x - \\omega t + \\dfrac{\\pi}{2}\\right)`;
    const reflectedLatex = `u_2(x,t) = ${halfAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x + \\omega t + \\dfrac{\\pi}{2}\\right)`;

    // 物理式（重ね合わせ、まだ簡単化する前）:
    //   u(x,t) = u1 + u2 = (A/2)sin(kx-ωt+π/2) + (A/2)sin(kx+ωt+π/2)
    const sumLatex =
      `u(x,t) = u_1+u_2 = ${halfAmplitude.toFixed(3)}\\sin\\!\\left(${kText}x-\\omega t+\\dfrac{\\pi}{2}\\right) ` +
      `+ ${halfAmplitude.toFixed(3)}\\sin\\!\\left(${kText}x+\\omega t+\\dfrac{\\pi}{2}\\right)`;

    // 物理式（和積公式 sinA+sinB = 2sin((A+B)/2)cos((A-B)/2) を適用した形。
    // A=(kx-ωt+π/2), B=(kx+ωt+π/2) とすると (A+B)/2=kx+π/2, (A-B)/2=-ωt なので、
    //   u(x,t) = A sin(kx+π/2) cos(ωt)
    // さらに sin(θ+π/2)=cosθ という関係から、最終的にcos(kx)の形と一致する）:
    //   u(x,t) = A cos(kx) cos(ωt)
    const displacementLatex =
      `u(x,t) = ${amplitude.toFixed(2)}\\sin\\!\\left(${kText}x+\\dfrac{\\pi}{2}\\right)\\cos(\\omega t) ` +
      `= ${amplitude.toFixed(2)} \\cos(${kText}x) \\cos(\\omega t)`;

    // 開口端補正Δx=0のときは従来通りの式（L）のまま表示し、Δx>0のときだけ
    // 実効長L_eff（開口端補正込みの長さ）を使った式を表示する
    // （js/physics/acoustic/OpenOpenTube.js / OpenClosedTube.js のコメント参照：
    //  一端閉管はL_eff=L+Δx、両端開管はL_eff=L+2Δxで、閉口端は補正を受けない）。
    const hasEndCorrection = endCorrection > 0;
    const isOpenClosed = boundaryType === BOUNDARY_TYPE_OPEN_CLOSED;
    const effectiveLength = isOpenClosed ? tubeLength + endCorrection : tubeLength + 2 * endCorrection;

    let eigenfrequencyLatex;
    if (!hasEndCorrection) {
      eigenfrequencyLatex = isOpenClosed
        ? `f_n = \\dfrac{(2n-1)v}{4L} = \\dfrac{(2\\times${modeNumber}-1)\\times${soundSpeed.toFixed(0)}}{4\\times${tubeLength.toFixed(2)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`
        : `f_n = \\dfrac{nv}{2L} = \\dfrac{${modeNumber}\\times${soundSpeed.toFixed(0)}}{2\\times${tubeLength.toFixed(2)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`;
    } else {
      const lengthTerm = isOpenClosed ? "L+\\Delta x" : "L+2\\Delta x";
      const lengthValue = isOpenClosed
        ? `${tubeLength.toFixed(2)}+${endCorrection.toFixed(3)}`
        : `${tubeLength.toFixed(2)}+2\\times${endCorrection.toFixed(3)}`;
      eigenfrequencyLatex = isOpenClosed
        ? `f_n = \\dfrac{(2n-1)v}{4(${lengthTerm})} = \\dfrac{(2\\times${modeNumber}-1)\\times${soundSpeed.toFixed(0)}}{4\\times(${lengthValue})} = \\dfrac{(2\\times${modeNumber}-1)\\times${soundSpeed.toFixed(0)}}{4\\times${effectiveLength.toFixed(3)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`
        : `f_n = \\dfrac{nv}{2(${lengthTerm})} = \\dfrac{${modeNumber}\\times${soundSpeed.toFixed(0)}}{2\\times(${lengthValue})} = \\dfrac{${modeNumber}\\times${soundSpeed.toFixed(0)}}{2\\times${effectiveLength.toFixed(3)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`;
    }

    if (!window.katex) {
      incidentWaveFormulaEl.textContent = `u1(x,t) = ${halfAmplitude.toFixed(3)} sin(${kText}x - ωt + π/2)`;
      reflectedWaveFormulaEl.textContent = `u2(x,t) = ${halfAmplitude.toFixed(3)} sin(${kText}x + ωt + π/2)`;
      sumFormulaEl.textContent =
        `u(x,t) = u1+u2 = ${halfAmplitude.toFixed(3)}sin(${kText}x-ωt+π/2) + ${halfAmplitude.toFixed(3)}sin(${kText}x+ωt+π/2)`;
      displacementFormulaEl.textContent = `u(x,t) = ${amplitude.toFixed(2)} sin(${kText}x+π/2) cos(ωt) = ${amplitude.toFixed(2)} cos(${kText}x) cos(ωt)`;
      eigenfrequencyFormulaEl.textContent = `f_n = ${eigenfrequency.toFixed(1)} Hz${hasEndCorrection ? ` (L_eff=${effectiveLength.toFixed(3)}m)` : ""}`;
      return;
    }

    window.katex.render(incidentLatex, incidentWaveFormulaEl);
    window.katex.render(reflectedLatex, reflectedWaveFormulaEl);
    window.katex.render(sumLatex, sumFormulaEl);
    window.katex.render(displacementLatex, displacementFormulaEl);
    window.katex.render(eigenfrequencyLatex, eigenfrequencyFormulaEl);
  }

  update();

  return { element: wrapper, update };
}
