// 粒子選択機能（requirements §7）。
// Canvasのクリックを検知して最も近い粒子を選び、その粒子の
// initialPosition/position/displacement/velocityを数値表示する。
// 選択結果は appState.selectedParticleIndex に書き込むだけで、
// CanvasRenderer側（ParticleRenderer/ArrowRenderer）がその値を読んで
// ハイライト表示するため、このモジュール自身はCanvasへの描画を行わない
// （役割の分離：UI Layerは「何を選んだか」を管理し、描画はRenderer Layerに任せる）。

/**
 * 粒子選択UIを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - selectedParticleIndexを持つAppState
 * @param {HTMLCanvasElement} params.canvasElement - クリックを検知するcanvas要素
 * @param {(canvasXPx: number, particles: Array<Object>) => number} params.findNearestParticleIndex
 *   - CanvasRenderer.findNearestParticleIndexを渡す（クリック位置→粒子番号の変換はRenderer側の
 *     座標変換ロジックに依存するため、UIはその関数を呼び出すだけにする）
 * @returns {{element: HTMLElement, update: () => void}}
 */
export function createParticleInspector({ appState, canvasElement, findNearestParticleIndex }) {
  const wrapper = document.createElement("div");
  wrapper.className = "particle-inspector";

  const titleElement = document.createElement("h3");
  titleElement.textContent = "粒子を選択してください（Canvasをクリック）";

  const infoElement = document.createElement("dl");
  infoElement.className = "particle-inspector-info";

  wrapper.appendChild(titleElement);
  wrapper.appendChild(infoElement);

  // getBoundingClientRect()は、要素が画面上のどこに、どのサイズで表示されているかを
  // 返すDOM APIのメソッド。クリックイベントのclientX/clientYは「画面全体における座標」
  // なので、そこからCanvas要素の左上端(rect.left)を引くことで、
  // 「Canvas内部での座標」に変換できる。
  canvasElement.addEventListener("click", (event) => {
    const rect = canvasElement.getBoundingClientRect();
    const canvasXPx = event.clientX - rect.left;
    const particles = appState.simulationState.particles;
    appState.selectedParticleIndex = findNearestParticleIndex(canvasXPx, particles);
    update();
  });

  // 単位付きで1行分の情報(ラベルと値)を組み立てる。
  // <dl>(定義リスト)は<dt>(用語)と<dd>(説明)のペアを並べるためのHTML要素で、
  // 「初期位置：1.23 m」のようなラベル付き数値の並びを表現するのに適している。
  function appendRow(label, valueText) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = valueText;
    infoElement.appendChild(dt);
    infoElement.appendChild(dd);
  }

  /**
   * 選択中の粒子の現在の物理量を再表示する。
   * 選択中の粒子は時刻とともに変位・速度が変わり続けるため、
   * このメソッドはApp.jsのtick()から毎フレーム呼ばれる想定。
   */
  function update() {
    infoElement.innerHTML = "";

    const index = appState.selectedParticleIndex;
    if (index === null) {
      titleElement.textContent = "粒子を選択してください（Canvasをクリック）";
      return;
    }

    const particle = appState.simulationState.particles[index];
    titleElement.textContent = `粒子 #${index} の物理量`;
    appendRow("初期位置 x0", `${particle.initialPosition.toFixed(3)} m`);
    appendRow("現在位置 x(t)", `${particle.position.toFixed(3)} m`);
    appendRow("変位 u", `${particle.displacement.toFixed(3)} m`);
    appendRow("粒子速度 v_p", `${particle.velocity.toFixed(3)} m/s`);
  }

  update();

  return { element: wrapper, update };
}
