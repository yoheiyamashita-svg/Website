// 気柱振動の数式表示（js/ui/FormulaDisplay.jsの気柱振動版、指示書§31, §42）。
// KaTeXの使い方・フォールバック方針はFormulaDisplay.jsと同じなので、
// そちらのコメントも参照。ここでは気柱振動固有の数式（定常波の式・境界条件ごとのf_n）を扱う。
//
// 【入射波・反射波・重ね合わせの表示について】
// 気柱内の定常波は、実は「単独で存在する1つの波」ではなく、上端から下端へ進む入射波と、
// 下端で反射して上端へ戻ってくる反射波という2つの逆向きの進行波が重なり合ってできている
// （physics.md §14の重ね合わせ導出）。このモジュールは、最終形の式だけでなく、
//   入射波 u1 → 反射波 u2 → 重ね合わせ(u1+u2) → 和積公式を適用した最終形
// という導出の過程を、実際の数値（k・振幅）を代入した実数の式として順番に表示する。
//
// 入射波・反射波は、physics.md §4-5で定義した進行波の「定義通り」の式
//   u(x,t) = A sin(kx - ωt + φ)
// の形（sinを使う形）で表す。位相φは上端(x=0)の境界条件で決まる：
//   - 上端が開口（x=0が腹）→ φ=π/2（sin(θ+π/2)=cosθ なので、結局cos(kx-ωt)と同じ）
//   - 上端が閉口（x=0が節）→ φ=0（そのままsin(kx-ωt)）
// この位相φを選んだ結果として、和積公式を適用した最終形が自動的にcos(kx)cos(ωt)
// （上端開口）またはsin(kx)cos(ωt)（上端閉口）の形に一致する
// （js/physics/acoustic/AirColumn.jsのヘッダーコメントで数式的に検証済み）。
// u1・u2の式の形自体はどの境界条件でも同じで、境界条件によって変わるのは
// 位相φと波数k（どちらもjs/physics/acoustic/AirColumn.jsが決定）だけである。
import { calculateEigenfrequency, calculateWaveNumber } from "../../physics/acoustic/AirColumn.js";
import { AIR_COLUMN_END_OPEN } from "../../utils/constants.js";

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
    const { amplitude, tubeLength, soundSpeed, sourceEndType, farEndType, modeNumber, endCorrection } =
      appState.airColumnState;
    const key = `${amplitude}|${tubeLength}|${soundSpeed}|${sourceEndType}|${farEndType}|${modeNumber}|${endCorrection}|${!!window.katex}`;
    if (key === lastRenderedKey) {
      return;
    }
    lastRenderedKey = key;

    const waveNumber = calculateWaveNumber(sourceEndType, farEndType, modeNumber, tubeLength, endCorrection);
    const eigenfrequency = calculateEigenfrequency(
      sourceEndType,
      farEndType,
      modeNumber,
      soundSpeed,
      tubeLength,
      endCorrection
    );
    const kText = waveNumber.toFixed(2);

    // 入射波・反射波は、それぞれ振幅A/2の進行波としてモデル化する
    // （2つを重ね合わせるとちょうど振幅Aの定常波になるように。physics.md §14参照）。
    // physics.md §4-5の進行波の定義 u(x,t)=A sin(kx-ωt+φ) の形（sinを使う形）で表し、
    // 上端(x=0)の境界条件で決まる位相φを代入する（ファイル冒頭コメント参照：
    // 上端が開口ならφ=π/2、閉口ならφ=0）。
    //
    // 物理式:
    //   u1(x,t) = (A/2) sin(kx - ωt + φ)   … +x方向（上端→下端）に進む入射波
    //   u2(x,t) = (A/2) sin(kx + ωt + φ)   … -x方向（下端→上端）に進む反射波
    const halfAmplitude = amplitude / 2;
    const isSourceOpen = sourceEndType === AIR_COLUMN_END_OPEN;
    // φ=0のときは「+0」を式に出さず、φ=π/2のときだけ位相項を付け足す。
    const phaseTermLatex = isSourceOpen ? " + \\dfrac{\\pi}{2}" : "";
    const phaseTermText = isSourceOpen ? " + π/2" : "";
    const incidentLatex = `u_1(x,t) = ${halfAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x - \\omega t${phaseTermLatex}\\right)`;
    const reflectedLatex = `u_2(x,t) = ${halfAmplitude.toFixed(3)}\\ \\sin\\!\\left(${kText}x + \\omega t${phaseTermLatex}\\right)`;

    // 物理式（重ね合わせ、まだ簡単化する前）:
    //   u(x,t) = u1 + u2 = (A/2)sin(kx-ωt+φ) + (A/2)sin(kx+ωt+φ)
    const sumLatex =
      `u(x,t) = u_1+u_2 = ${halfAmplitude.toFixed(3)}\\sin\\!\\left(${kText}x-\\omega t${phaseTermLatex}\\right) ` +
      `+ ${halfAmplitude.toFixed(3)}\\sin\\!\\left(${kText}x+\\omega t${phaseTermLatex}\\right)`;

    // 物理式（和積公式 sinA+sinB = 2sin((A+B)/2)cos((A-B)/2) を適用した形。
    // A=(kx-ωt+φ), B=(kx+ωt+φ) とすると (A+B)/2=kx+φ, (A-B)/2=-ωt なので、
    //   u(x,t) = A sin(kx+φ) cos(ωt)
    // φ=π/2のときはさらに sin(θ+π/2)=cosθ という関係から、最終的にcos(kx)の形と一致する。
    // φ=0のときは sin(kx+0)=sin(kx) なので、この時点で既に最終形（追加の変形は不要）。
    const displacementLatex = isSourceOpen
      ? `u(x,t) = ${amplitude.toFixed(2)}\\sin\\!\\left(${kText}x+\\dfrac{\\pi}{2}\\right)\\cos(\\omega t) ` +
        `= ${amplitude.toFixed(2)} \\cos(${kText}x) \\cos(\\omega t)`
      : `u(x,t) = ${amplitude.toFixed(2)}\\sin(${kText}x)\\cos(\\omega t)`;

    // 固有値条件は、両端の種類が一致するか（kL=nπ）・不一致か（kL=(2n-1)π/2）で決まる
    // （js/physics/acoustic/AirColumn.jsのヘッダーコメント参照）。
    // 開口端補正Δxは開口端の本数（0・1・2）に比例して効く。開口端が1本もない
    // （両端閉口）ときは、Δxの値によらず補正は一切効かない。
    const endsMatch = sourceEndType === farEndType;
    const openEndCount = (sourceEndType === AIR_COLUMN_END_OPEN ? 1 : 0) + (farEndType === AIR_COLUMN_END_OPEN ? 1 : 0);
    const hasEndCorrection = endCorrection > 0 && openEndCount > 0;
    const effectiveLength = tubeLength + openEndCount * endCorrection;

    let eigenfrequencyLatex;
    if (!hasEndCorrection) {
      eigenfrequencyLatex = !endsMatch
        ? `f_n = \\dfrac{(2n-1)v}{4L} = \\dfrac{(2\\times${modeNumber}-1)\\times${soundSpeed.toFixed(0)}}{4\\times${tubeLength.toFixed(2)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`
        : `f_n = \\dfrac{nv}{2L} = \\dfrac{${modeNumber}\\times${soundSpeed.toFixed(0)}}{2\\times${tubeLength.toFixed(2)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`;
    } else {
      const lengthTerm = openEndCount === 1 ? "L+\\Delta x" : "L+2\\Delta x";
      const lengthValue =
        openEndCount === 1
          ? `${tubeLength.toFixed(2)}+${endCorrection.toFixed(3)}`
          : `${tubeLength.toFixed(2)}+2\\times${endCorrection.toFixed(3)}`;
      eigenfrequencyLatex = !endsMatch
        ? `f_n = \\dfrac{(2n-1)v}{4(${lengthTerm})} = \\dfrac{(2\\times${modeNumber}-1)\\times${soundSpeed.toFixed(0)}}{4\\times(${lengthValue})} = \\dfrac{(2\\times${modeNumber}-1)\\times${soundSpeed.toFixed(0)}}{4\\times${effectiveLength.toFixed(3)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`
        : `f_n = \\dfrac{nv}{2(${lengthTerm})} = \\dfrac{${modeNumber}\\times${soundSpeed.toFixed(0)}}{2\\times(${lengthValue})} = \\dfrac{${modeNumber}\\times${soundSpeed.toFixed(0)}}{2\\times${effectiveLength.toFixed(3)}} = ${eigenfrequency.toFixed(1)}\\ \\text{Hz}`;
    }

    if (!window.katex) {
      incidentWaveFormulaEl.textContent = `u1(x,t) = ${halfAmplitude.toFixed(3)} sin(${kText}x - ωt${phaseTermText})`;
      reflectedWaveFormulaEl.textContent = `u2(x,t) = ${halfAmplitude.toFixed(3)} sin(${kText}x + ωt${phaseTermText})`;
      sumFormulaEl.textContent =
        `u(x,t) = u1+u2 = ${halfAmplitude.toFixed(3)}sin(${kText}x-ωt${phaseTermText}) + ${halfAmplitude.toFixed(3)}sin(${kText}x+ωt${phaseTermText})`;
      displacementFormulaEl.textContent = isSourceOpen
        ? `u(x,t) = ${amplitude.toFixed(2)} sin(${kText}x+π/2) cos(ωt) = ${amplitude.toFixed(2)} cos(${kText}x) cos(ωt)`
        : `u(x,t) = ${amplitude.toFixed(2)} sin(${kText}x) cos(ωt)`;
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
