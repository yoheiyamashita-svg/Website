// 気柱振動の粒子（列）選択機能（js/ui/ParticleInspector.jsの気柱振動版、指示書§36）。
// Canvasのクリックを検知して最も近い列を選び、その列のinitialPosition/position/
// displacement/velocityを数値表示する。描画（ハイライト表示）はRenderer側に任せ、
// このモジュールは「どの列が選ばれているか」を管理するだけ。

/**
 * 気柱振動の粒子（列）選択UIを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - selectedColumnIndexを持つAppState
 * @param {HTMLCanvasElement} params.canvasElement - クリックを検知するcanvas要素
 * @param {(canvasYPx: number, columns: Array<Object>) => number} params.findNearestColumnIndex
 *   - AirColumnRenderer.findNearestColumnIndexを渡す
 * @returns {{element: HTMLElement, update: () => void}}
 */
export function createAirColumnParticleInspector({ appState, canvasElement, findNearestColumnIndex }) {
  const wrapper = document.createElement("div");
  wrapper.className = "particle-inspector";

  const titleElement = document.createElement("h3");
  titleElement.textContent = "気柱内の粒子を選択してください（管をクリック）";

  const infoElement = document.createElement("dl");
  infoElement.className = "particle-inspector-info";

  wrapper.appendChild(titleElement);
  wrapper.appendChild(infoElement);

  // 気柱は縦長に表示しているため、クリック位置のY座標（管の長さ方向）から
  // 列を特定する（js/ui/ParticleInspector.jsがX座標を使うのと対応する違い）。
  canvasElement.addEventListener("click", (event) => {
    const rect = canvasElement.getBoundingClientRect();
    const canvasYPx = event.clientY - rect.top;
    const columns = appState.airColumnState.columns;
    appState.selectedColumnIndex = findNearestColumnIndex(canvasYPx, columns);
    update();
  });

  function appendRow(label, valueText) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = valueText;
    infoElement.appendChild(dt);
    infoElement.appendChild(dd);
  }

  function update() {
    infoElement.innerHTML = "";

    const index = appState.selectedColumnIndex;
    if (index === null) {
      titleElement.textContent = "気柱内の粒子を選択してください（管をクリック）";
      return;
    }

    const column = appState.airColumnState.columns[index];
    titleElement.textContent = `列 #${index} の物理量`;
    appendRow("初期位置 x0", `${column.initialPosition.toFixed(3)} m`);
    appendRow("現在位置 x(t)", `${column.position.toFixed(3)} m`);
    appendRow("変位 u", `${column.displacement.toFixed(3)} m`);
    appendRow("粒子速度 v_p", `${column.velocity.toFixed(3)} m/s`);
  }

  update();

  return { element: wrapper, update };
}
