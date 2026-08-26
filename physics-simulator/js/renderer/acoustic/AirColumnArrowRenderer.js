// 気柱振動のMode C用Renderer（js/renderer/ArrowRenderer.jsの気柱振動版）。
//
// 縦波のMode Cでは「粒子の左右矢印」と「波形の上下矢印」を対応させたが、
// 気柱振動では管を縦長に表示しているため、軸の向きが90度回転している：
//   1. 列自身の変位矢印：管の長さ方向（Canvasの縦方向）の矢印
//      → 実際に空気の層がその場で振動する方向そのもの
//   2. 波形上の対応矢印：管の中心線からの横方向オフセット（Canvasの横方向）の矢印
//      → こちらは実際の運動方向ではなく、変位を読み取りやすくするためのグラフ表現
//        （js/renderer/acoustic/AirColumnWaveRenderer.jsと同じ変換規約）
// どちらの矢印も同じcolumn.displacementだけを参照し、値を再計算しない（REQ-105）。
//
// 矢印の描画そのものは js/renderer/drawArrow.js を再利用する（縦波側と実装を共有）。

import { drawArrow } from "../drawArrow.js";

const COLUMN_ARROW_COLOR = "#d97b2c"; // 列自身の変位矢印の色（縦波のPARTICLE_ARROW_COLORと対応）
const WAVE_ARROW_COLOR = "#2c6bd9"; // 波形上の対応矢印の色

/**
 * 列↔波形の対応矢印を描画する。
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} transform - 管の長さ方向をY軸とする座標変換
 * @param {Array<Object>} columns - AirColumnState.columns
 * @param {number} tubeCenterXPx - 管の中心線のCanvas X座標 [px]
 * @param {Object} [options]
 * @param {number} [options.sampleInterval=5] - 何列おきに矢印を描くか
 * @param {number|null} [options.highlightedIndex=null] - 強調表示する列番号
 */
export function renderAirColumnCorrespondenceArrows(
  context,
  transform,
  columns,
  tubeCenterXPx,
  { sampleInterval = 5, highlightedIndex = null } = {}
) {
  columns.forEach((column, index) => {
    const isSampled = index % sampleInterval === 0;
    const isHighlighted = index === highlightedIndex;
    if (!isSampled && !isHighlighted) {
      return;
    }

    // 1. 列自身の変位矢印：管の長さ方向（Canvas縦方向）に、初期位置から現在位置まで。
    const initialYPx = transform.physicsXToPixel(column.initialPosition);
    const currentYPx = transform.physicsXToPixel(column.position);
    drawArrow(
      context,
      tubeCenterXPx,
      initialYPx,
      tubeCenterXPx,
      currentYPx,
      COLUMN_ARROW_COLOR,
      isHighlighted
    );

    // 2. 波形上の対応矢印：中心線から、変位曲線までの横方向オフセット。
    const waveYPx = transform.physicsXToPixel(column.initialPosition);
    const waveXPx = transform.pixelXForOffset(tubeCenterXPx, column.displacement);
    drawArrow(context, tubeCenterXPx, waveYPx, waveXPx, waveYPx, WAVE_ARROW_COLOR, isHighlighted);
  });
}
