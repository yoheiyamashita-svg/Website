// アプリケーションのエントリーポイント。
// DOM要素の取得、2つのApp（縦波・気柱振動）の初期化、タブ切り替え、そして
// アニメーションループ（requestAnimationFrame）の起動を行う
// （architecture.md §10-11: 時間管理とループの起点）。
import { createWaveApp } from "./app/App.js";
import { createAirColumnApp } from "./app/AirColumnApp.js";
import { createTransverseWaveApp } from "./app/TransverseWaveApp.js";
import { MAX_DELTA_TIME } from "./utils/constants.js";

// document.getElementById(id)は、指定したid属性を持つDOM要素を1つ取得するWeb APIの
// メソッド。index.html側で<canvas id="simulation-canvas">のように書いた要素と、
// ここでのJavaScriptのオブジェクトを結びつけている。
const waveApp = createWaveApp({
  canvasElement: document.getElementById("simulation-canvas"),
  parameterContainer: document.getElementById("parameter-controls"),
  playbackContainer: document.getElementById("playback-controls"),
  modeContainer: document.getElementById("mode-selector"),
  inspectorContainer: document.getElementById("particle-inspector"),
  formulaContainer: document.getElementById("formula-panel"),
  learningModeContainer: document.getElementById("learning-mode"),
});

const airColumnApp = createAirColumnApp({
  canvasElement: document.getElementById("air-column-canvas"),
  parameterContainer: document.getElementById("air-column-parameter-controls"),
  playbackContainer: document.getElementById("air-column-playback-controls"),
  modeContainer: document.getElementById("air-column-mode-selector"),
  inspectorContainer: document.getElementById("air-column-particle-inspector"),
  formulaContainer: document.getElementById("air-column-formula-panel"),
  learningModeContainer: document.getElementById("air-column-learning-mode"),
});

const transverseWaveApp = createTransverseWaveApp({
  canvasElement: document.getElementById("transverse-wave-canvas"),
  parameterContainer: document.getElementById("transverse-wave-parameter-controls"),
  playbackContainer: document.getElementById("transverse-wave-playback-controls"),
  formulaContainer: document.getElementById("transverse-wave-formula-panel"),
});

// タブ切り替え：どのsectionを表示するかだけを切り替える。
// 縦波・気柱振動・横波のどのシミュレーションも裏側では時刻が進み続け（下のtick呼び出しを参照）、
// タブを切り替えても「戻ってきたら時間が止まっていた」ということが起きないようにする
// （REQ-104のモード切替と同じ考え方：表示の切り替えと物理状態の進行は独立させる）。
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = {
  wave: document.getElementById("wave-panel"),
  "air-column": document.getElementById("air-column-panel"),
  "transverse-wave": document.getElementById("transverse-wave-panel"),
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.dataset.tab;
    tabButtons.forEach((otherButton) => {
      otherButton.classList.toggle("active", otherButton === button);
    });
    Object.entries(tabPanels).forEach(([tabName, panelElement]) => {
      panelElement.classList.toggle("active", tabName === targetTab);
    });

    // 非表示中のCanvasはclientWidth/Heightが0のため、表示された直後は
    // まだ正しいサイズで座標変換が作られていない。タブを切り替えて
    // 表示された瞬間に、そのタブのCanvasだけhandleResizeを呼び直す。
    if (targetTab === "wave") {
      waveApp.handleResize();
    } else if (targetTab === "air-column") {
      airColumnApp.handleResize();
    } else if (targetTab === "transverse-wave") {
      transverseWaveApp.handleResize();
    }
  });
});

// windowはブラウザ全体を表すグローバルオブジェクト。"resize"イベントは
// ブラウザウィンドウ（＝Canvasの表示サイズ）が変わるたびに発火するため、
// そのたびに両方のCanvasの解像度と座標変換を計算し直す
// （非表示中のタブのCanvasはclientWidth/Heightが0になりうるため、
// 各Rendererのresize処理側でその場合は何もしないようガードしてある）。
window.addEventListener("resize", () => {
  waveApp.handleResize();
  airColumnApp.handleResize();
  transverseWaveApp.handleResize();
});

let previousTimestampMs = null;

/**
 * 毎フレーム呼ばれるアニメーション関数。
 *
 * requestAnimationFrameは、ブラウザが次の画面を再描画する直前のタイミングで
 * 指定した関数を呼び出すWeb API。setIntervalのように「一定時間ごと」ではなく
 * 「画面のリフレッシュに同期して」呼ばれるため、アニメーションのカクつきが起きにくい。
 * このAPIはコールバックの引数として、ページ読み込みからの経過時間[ms]
 * （高精度タイムスタンプ）を渡してくれる。
 *
 * @param {number} currentTimestampMs - 現在のタイムスタンプ [ms]
 */
function animationFrame(currentTimestampMs) {
  if (previousTimestampMs === null) {
    // 初回フレームは「前回との差」を計算できないため、基準時刻として記録するだけにする。
    previousTimestampMs = currentTimestampMs;
  }

  // 前フレームからの経過時間 deltaTime [s]。
  // タイムスタンプの単位はミリ秒[ms]なので、秒[s]に直すため1000で割る。
  const rawDeltaTimeSeconds = (currentTimestampMs - previousTimestampMs) / 1000;
  previousTimestampMs = currentTimestampMs;

  // タブの非アクティブ化などでフレーム間隔が一時的に大きく開いても、
  // 物理時間が一気に飛んで粒子が瞬間移動して見えないよう、
  // 1フレームで進める時間の上限をMAX_DELTA_TIMEに制限する（NFR-001）。
  const deltaTimeSeconds = Math.min(rawDeltaTimeSeconds, MAX_DELTA_TIME);

  // 表示中でない方のシミュレーションも含め、3つとものtickを毎フレーム呼ぶ。
  // 描画自体はCanvasRenderer/AirColumnRendererが行うが、非表示中のCanvasは
  // clientWidth/Heightが0になるため実際の描画コストはほぼ発生しない。
  waveApp.tick(deltaTimeSeconds);
  airColumnApp.tick(deltaTimeSeconds);
  transverseWaveApp.tick(deltaTimeSeconds);

  // 次のフレームでもこの関数が呼ばれるよう、ループの最後で自分自身を再登録する。
  requestAnimationFrame(animationFrame);
}

// 最初のフレームをスケジュールし、アニメーションループを開始する。
requestAnimationFrame(animationFrame);
