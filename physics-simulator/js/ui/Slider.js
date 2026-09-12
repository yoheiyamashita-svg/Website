// スライダーと、その横のキーボード直接入力欄を1組にしたUI部品（REQ-201/202）。
// UI Layerに属し、DOM要素の生成とイベント配線だけを行う。
// 物理計算やSimulationStateへの直接書き込みはここでは行わず、
// 呼び出し側から渡されたonInputコールバックに値を渡すだけにとどめる
// （architecture.md §15: Slider → AppState/SimulationState → PhysicsEngine の一方向の流れ）。
//
// 【数値入力欄について（ユーザー要望：値をキーボードから直接入力可能に）】
// type="range"のスライダーはドラッグ操作に向くが、狙った数値ちょうどに合わせにくい。
// そこでtype="number"の入力欄を併設し、range/numberのどちらを操作してももう片方に
// 反映される（双方向同期）ようにする。number欄はブラウザ標準のスピンボタンや
// 矢印キーでの増減にも対応する。
import { clamp } from "../utils/math.js";

/**
 * スライダー1個分のDOM要素一式を作る。
 *
 * @param {Object} params
 * @param {string} params.label - スライダーのラベル文字列（例："振幅 A"）
 * @param {number} params.min - スライダーの最小値
 * @param {number} params.max - スライダーの最大値
 * @param {number} params.step - スライダーの刻み幅
 * @param {number} params.value - 初期値
 * @param {string} params.unit - 単位表示文字列（例："m"）
 * @param {number} [params.decimals=2] - 数値表示の小数点以下桁数
 * @param {(value: number) => void} params.onInput - 値が変わるたびに呼ばれるコールバック
 * @returns {{element: HTMLElement, setValue: (value:number)=>void}}
 */
export function createSlider({ label, min, max, step, value, unit, decimals = 2, onInput }) {
  // document.createElement()は、指定したタグ名(div, label, input等)のDOM要素を
  // メモリ上に新しく作るWeb APIのメソッド。この時点ではまだ画面には表示されない。
  const wrapper = document.createElement("div");
  wrapper.className = "slider-control";

  const labelElement = document.createElement("label");
  labelElement.textContent = label;

  const rangeElement = document.createElement("input");
  rangeElement.type = "range"; // type="range"はブラウザ標準のスライダーUIを表示するHTML要素
  rangeElement.min = String(min);
  rangeElement.max = String(max);
  rangeElement.step = String(step);
  rangeElement.value = String(value);

  const valueRow = document.createElement("div");
  valueRow.className = "slider-value-row";

  const numberElement = document.createElement("input");
  numberElement.type = "number"; // ブラウザ標準の数値入力欄。キーボードで直接値を打ち込める
  numberElement.className = "slider-value-input";
  numberElement.min = String(min);
  numberElement.max = String(max);
  numberElement.step = String(step);

  const unitElement = document.createElement("span");
  unitElement.className = "slider-unit";
  unitElement.textContent = unit;

  // toFixed(decimals)は数値を指定した小数点以下の桁数の文字列に変換する
  // JavaScript組み込みメソッド（例：0.5.toFixed(2) === "0.50"）。
  function formatNumber(currentValue) {
    return currentValue.toFixed(decimals);
  }

  numberElement.value = formatNumber(value);

  // addEventListener("input", callback)は、DOM要素に対して
  // 「inputイベント（スライダーをドラッグして値が変わった瞬間）が起きるたびに
  // このcallback関数を呼び出してほしい」と登録するWeb APIのメソッド。
  // changeイベントと違い、ドラッグ中もリアルタイムに発火するため、
  // REQ-202「数値表示をリアルタイム反映」に適している。
  rangeElement.addEventListener("input", () => {
    const currentValue = Number(rangeElement.value);
    numberElement.value = formatNumber(currentValue);
    onInput(currentValue);
  });

  numberElement.addEventListener("input", () => {
    // 入力途中（"-"だけ・"1."で止まっているなど）はNumber()がNaNを返す。
    // また、値を打ち直そうと一度全部消して空欄にした瞬間はNumber("")===0になり、
    // NaN判定をすり抜けてしまう（JavaScript組み込みの仕様）。空欄はNaNと同様に
    // 「まだ入力中」として扱い、確定した数値になるまではonInputを呼ばない
    // （呼んでしまうと、消している途中でいきなり最小値にスナップしてしまう）。
    if (numberElement.value.trim() === "") {
      return;
    }
    const parsed = Number(numberElement.value);
    if (Number.isNaN(parsed)) {
      return;
    }
    // number欄の表示自体はユーザーが打ち込んだ文字のままにしておく（範囲外の値を
    // 打っている途中で勝手に書き換えると入力の邪魔になるため）が、実際にonInputへ
    // 渡す値・rangeスライダーの位置は範囲内にクランプする（js/utils/math.jsのclamp参照。
    // 例えば波長に0や負の値が渡ると計算式の中でゼロ除算・不正な値になってしまうため）。
    const clamped = clamp(parsed, min, max);
    rangeElement.value = String(clamped);
    onInput(clamped);
  });

  // フォーカスが外れたとき、number欄の表示を実際に使われた値（クランプ後・桁数統一）に揃える。
  // 空欄のまま（またはNaNになる不正な文字列のまま）フォーカスを外した場合は、
  // 直前まで有効だったrangeスライダーの値まで戻す（空欄をNumber("")===0として
  // 最小値に飛ばしてしまわないように、上のinputハンドラーと同じ考え方で扱う）。
  numberElement.addEventListener("blur", () => {
    const isEmpty = numberElement.value.trim() === "";
    const parsed = Number(numberElement.value);
    const resolved = isEmpty || Number.isNaN(parsed) ? Number(rangeElement.value) : clamp(parsed, min, max);
    numberElement.value = formatNumber(resolved);
  });

  // Enterキーで即座に確定させる（フォームではないのでsubmitは起きないが、
  // blur()を呼ぶことでフォーカスを外し、上のblurハンドラーによる表示の整形を発火させる）。
  numberElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      numberElement.blur();
    }
  });

  valueRow.appendChild(numberElement);
  valueRow.appendChild(unitElement);

  wrapper.appendChild(labelElement);
  wrapper.appendChild(rangeElement);
  wrapper.appendChild(valueRow);

  return {
    element: wrapper,
    // 外部（他のスライダーの操作の結果など）から値を書き換えたいときに使う。
    setValue(currentValue) {
      rangeElement.value = String(currentValue);
      numberElement.value = formatNumber(currentValue);
    },
  };
}
