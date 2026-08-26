// EDU-005: 数式とシミュレーション結果を対応させる（requirements §9 数式表示）。
//
// KaTeXは、LaTeX形式の数式文字列をブラウザ上で見やすい数式組版として描画してくれる
// 外部ライブラリ。index.html側で<script src="...katex.min.js">を読み込んでおり、
// window.katex というグローバルオブジェクトとして使えるようになる。
// このモジュールでは、現在のシミュレーションパラメータを代入した数式文字列を組み立て、
// katex.render(文字列, 表示先のDOM要素) を呼んで描画するだけで、数式のレイアウト計算自体は
// KaTeX側に任せる。
import { calculateWaveSpeed } from "../physics/wave/TravelingWave.js";

/**
 * 数式表示パネルを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - simulationStateを持つAppState
 * @returns {{element: HTMLElement, update: () => void}}
 */
export function createFormulaDisplay({ appState }) {
  const wrapper = document.createElement("div");
  wrapper.className = "formula-display";

  const displacementFormulaEl = document.createElement("div");
  const waveSpeedFormulaEl = document.createElement("div");
  wrapper.appendChild(displacementFormulaEl);
  wrapper.appendChild(waveSpeedFormulaEl);

  // 直前に描画した値を覚えておき、値が変わっていなければKaTeXの再描画をスキップする。
  // アニメーションのtickごとにupdate()を呼んでも、A・λ・f・φはスライダー操作でしか
  // 変わらないため、この最適化により毎フレームの数式再組版コスト（NFR-001の60FPS目標に
  // 影響しうる）を避けられる。
  let lastRenderedKey = null;

  /**
   * 現在のsimulationStateのパラメータを使って数式を再描画する。
   * 値が前回描画時と同じ場合は何もしない。
   */
  function update() {
    const { amplitude, wavelength, frequency, phase } = appState.simulationState;
    // window.katexの有無もキーに含める。KaTeXはCDNから非同期に読み込まれるため、
    // 「パラメータは変わっていないが、KaTeXが後から読み込み完了した」瞬間にも
    // 再描画してプレーンテキスト表示から数式表示へ切り替えられるようにするため。
    const key = `${amplitude}|${wavelength}|${frequency}|${phase}|${!!window.katex}`;
    if (key === lastRenderedKey) {
      return;
    }
    lastRenderedKey = key;

    // KaTeXが未読み込み（CDNへのアクセスに失敗した等）の場合は、
    // プレーンテキストにフォールバックし、アプリ自体は止めない。
    if (!window.katex) {
      displacementFormulaEl.textContent = `u(x,t) = ${amplitude.toFixed(2)} sin(kx - ωt + ${phase.toFixed(2)})`;
      waveSpeedFormulaEl.textContent = `v = fλ = ${calculateWaveSpeed(frequency, wavelength).toFixed(2)} m/s`;
      return;
    }

    // 物理式:
    //   u(x,t) = A sin(kx - ωt + φ)
    // に、現在のスライダー値(A, φ)を代入した文字列をLaTeX記法で組み立てる。
    // katex.renderはLaTeX文字列を第1引数、描画先のDOM要素を第2引数に取る。
    window.katex.render(
      `u(x,t) = ${amplitude.toFixed(2)} \\sin(kx - \\omega t + ${phase.toFixed(2)})`,
      displacementFormulaEl
    );

    // 物理式:
    //   v = fλ
    // 波の速さは、周波数fと波長λの積から求められる（physics.md §10「波の基本量」）。
    const waveSpeed = calculateWaveSpeed(frequency, wavelength);
    window.katex.render(
      `v = f\\lambda = ${frequency.toFixed(2)} \\times ${wavelength.toFixed(2)} = ${waveSpeed.toFixed(2)}\\ \\text{m/s}`,
      waveSpeedFormulaEl
    );
  }

  update();

  return { element: wrapper, update };
}
