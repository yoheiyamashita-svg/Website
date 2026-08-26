// スライダーとその横の数値表示を1組にしたUI部品（REQ-201/202）。
// UI Layerに属し、DOM要素の生成とイベント配線だけを行う。
// 物理計算やSimulationStateへの直接書き込みはここでは行わず、
// 呼び出し側から渡されたonInputコールバックに値を渡すだけにとどめる
// （architecture.md §15: Slider → AppState/SimulationState → PhysicsEngine の一方向の流れ）。

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

  const inputElement = document.createElement("input");
  inputElement.type = "range"; // type="range"はブラウザ標準のスライダーUIを表示するHTML要素
  inputElement.min = String(min);
  inputElement.max = String(max);
  inputElement.step = String(step);
  inputElement.value = String(value);

  const valueElement = document.createElement("span");
  valueElement.className = "slider-value";

  // toFixed(decimals)は数値を指定した小数点以下の桁数の文字列に変換する
  // JavaScript組み込みメソッド（例：0.5.toFixed(2) === "0.50"）。
  function formatValue(currentValue) {
    return `${currentValue.toFixed(decimals)} ${unit}`;
  }

  valueElement.textContent = formatValue(value);

  // addEventListener("input", callback)は、DOM要素に対して
  // 「inputイベント（スライダーをドラッグして値が変わった瞬間）が起きるたびに
  // このcallback関数を呼び出してほしい」と登録するWeb APIのメソッド。
  // changeイベントと違い、ドラッグ中もリアルタイムに発火するため、
  // REQ-202「数値表示をリアルタイム反映」に適している。
  inputElement.addEventListener("input", () => {
    const currentValue = Number(inputElement.value);
    valueElement.textContent = formatValue(currentValue);
    onInput(currentValue);
  });

  wrapper.appendChild(labelElement);
  wrapper.appendChild(inputElement);
  wrapper.appendChild(valueElement);

  return {
    element: wrapper,
    // 外部（他のスライダーの操作の結果など）から値を書き換えたいときに使う。
    setValue(currentValue) {
      inputElement.value = String(currentValue);
      valueElement.textContent = formatValue(currentValue);
    },
  };
}
