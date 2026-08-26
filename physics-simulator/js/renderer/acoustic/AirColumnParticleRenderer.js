// 気柱内部の空気粒子を「列×行」の格子として描画するRenderer
// （指示書§19-22、js/renderer/ParticleRenderer.jsの気柱振動版）。
//
// 物理量を持つのは「列」だけ（AirColumnState.columns、1次元）。
// 同じ列に属する行(row)は、指示書§21「同じ縦列にある粒子は、同じx方向変位を持つ」
// のとおり、列のdisplacementをそのまま使って複数個描画する（表示上の複製であり、
// 行ごとに異なる物理量を計算することはない）。
//
// 振幅による横方向のはみ出しは一切制限しない（指示書§25-26）。
//
// 色について：粗密は列どうしの間隔（＝現在位置position自体）で自然に表現されるため、
// 色を密度に応じて変化させることはしない。同じ粒子が時間経過や密度によって
// 色を変える表現は避け、常に同じ色で描く（選択中の列だけ輪郭の強調で区別する）。

const DOT_RADIUS_PX = 3;
const PARTICLE_COLOR = "#4a90d9"; // 粒子の色（密度によらず常に固定）
const HIGHLIGHT_RING_COLOR = "#222";
const HIGHLIGHT_RING_RADIUS_PX = 7;

/**
 * 気柱内部の空気粒子（列×行の格子）を描画する。
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} transform - AirColumnRendererが管の長さ方向をCanvasのY軸として作った座標変換
 * @param {Array<Object>} columns - AirColumnState.columns
 * @param {number} tubeCenterXPx - 管の中心線のCanvas X座標 [px]
 * @param {number} rowSpacingPx - 断面方向（行）の間隔 [px]（表示専用）
 * @param {number} rowCount - 断面方向に並べる行数（表示専用）
 * @param {number|null} [highlightedIndex=null] - 選択中の列番号
 */
export function renderAirColumnParticles(
  context,
  transform,
  columns,
  tubeCenterXPx,
  rowSpacingPx,
  rowCount,
  highlightedIndex = null
) {
  columns.forEach((column, columnIndex) => {
    // 管の長さ方向の現在位置(position[m])を、Canvasの縦方向(Y)座標に変換する。
    // AirColumnRenderer側で「x=0(音源・開口)がCanvas上部」となるようtransformを
    // 作っているため、ここではphysicsXToPixelを呼ぶだけでよい。
    const y = transform.physicsXToPixel(column.position);

    for (let row = 0; row < rowCount; row += 1) {
      // 行は物理量を持たない表示専用の複製。中心を0として左右に等間隔で並べる。
      const rowOffsetIndex = row - (rowCount - 1) / 2;
      const x = tubeCenterXPx + rowOffsetIndex * rowSpacingPx;

      context.fillStyle = PARTICLE_COLOR;
      context.beginPath();
      context.arc(x, y, DOT_RADIUS_PX, 0, Math.PI * 2);
      context.fill();

      if (columnIndex === highlightedIndex) {
        context.strokeStyle = HIGHLIGHT_RING_COLOR;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(x, y, HIGHLIGHT_RING_RADIUS_PX, 0, Math.PI * 2);
        context.stroke();
      }
    }
  });
}
