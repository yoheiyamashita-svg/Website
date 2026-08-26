// 気柱振動の数式表示（js/ui/FormulaDisplay.jsの気柱振動版、指示書§31, §42）。
// KaTeXの使い方・フォールバック方針はFormulaDisplay.jsと同じなので、
// そちらのコメントも参照。ここでは気柱振動固有の数式（定常波の式・境界条件ごとのf_n）を扱う。
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

  const displacementFormulaEl = document.createElement("div");
  const eigenfrequencyFormulaEl = document.createElement("div");
  wrapper.appendChild(displacementFormulaEl);
  wrapper.appendChild(eigenfrequencyFormulaEl);

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

    // 物理式:
    //   u(x,t) = A cos(kx) cos(ωt)
    // 進行波(u=A sin(kx-ωt+φ))とは異なる定常波の式であることが数式上も分かるようにする。
    const displacementLatex = `u(x,t) = ${amplitude.toFixed(2)} \\cos(${waveNumber.toFixed(2)}x) \\cos(\\omega t)`;

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
      displacementFormulaEl.textContent = `u(x,t) = ${amplitude.toFixed(2)} cos(kx) cos(ωt)`;
      eigenfrequencyFormulaEl.textContent = `f_n = ${eigenfrequency.toFixed(1)} Hz${hasEndCorrection ? ` (L_eff=${effectiveLength.toFixed(3)}m)` : ""}`;
      return;
    }

    window.katex.render(displacementLatex, displacementFormulaEl);
    window.katex.render(eigenfrequencyLatex, eigenfrequencyFormulaEl);
  }

  update();

  return { element: wrapper, update };
}
