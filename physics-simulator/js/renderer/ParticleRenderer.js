// 媒質(粒子)を「列×行」の格子として描画するRenderer
// （js/renderer/acoustic/AirColumnParticleRenderer.js と同じ考え方を縦波にも適用したもの）。
//
// 物理量を持つのは「列」だけ（SimulationState.particles、1次元）。
// 同じ列に属する行(row)は、物理的には同じ位置x(t)を共有する表示上の複製であり
// （気柱振動の指示書§21「同じ縦列にある粒子は、同じ変位を持つ」と同じ考え方）、
// 行ごとに異なる物理量を計算することはない。
//
// Simulation Stateにすでに計算済みの値(particle.position)を読んで座標変換し、
// Canvas APIで円を描くだけで、物理量そのものの計算は一切行わない
// （architecture.md §3.5「Rendererは物理法則を計算してはならない」）。
//
// 色について：粗密は「粒子どうしの間隔」そのもの（＝現在位置position自体）で
// 自然に表現されるため、色を密度に応じて変化させることはしない。
// 同じ粒子が時間経過や密度によって色を変える表現は、
// 「これは同じ粒子なのか、別の粒子なのか」を分かりにくくするため避け、
// 常に同じ色で描く（選択中の粒子だけ、色を変えず輪郭の強調で区別する）。

const PARTICLE_RADIUS_PX = 4; // 粒子を表す円の半径 [px]（見やすさのための表示上の値）
const PARTICLE_COLOR = "#4a90d9"; // 粒子の色（密度によらず常に固定）
const HIGHLIGHT_RING_COLOR = "#222"; // 選択中の粒子を示す輪郭線の色（requirements §7 粒子選択）
const HIGHLIGHT_RING_RADIUS_PX = 8; // 選択中の粒子の輪郭線の半径 [px]（本体より一回り大きくする）

/**
 * 粒子群を「列×行」の格子として描画する。
 *
 * @param {CanvasRenderingContext2D} context - 描画先のCanvas 2Dコンテキスト
 * @param {Object} transform - createCoordinateTransformで作った座標変換オブジェクト
 * @param {Array<Object>} particles - SimulationState.particles
 * @param {number} centerYPx - 粒子の行を並べる中心の高さ（Canvas Y座標）[px]
 * @param {number} rowSpacingPx - 断面方向（行）の間隔 [px]（表示専用）
 * @param {number} rowCount - 断面方向に並べる行数（表示専用）
 * @param {number|null} [highlightedIndex=null] - 選択中の粒子番号（Stage 7の粒子選択機能で使用）
 */
export function renderParticles(context, transform, particles, centerYPx, rowSpacingPx, rowCount, highlightedIndex = null) {
  for (let i = 0; i < particles.length; i += 1) {
    const particle = particles[i];
    // 物理座標(現在位置position[m])をCanvas座標[px]に変換する。
    // 縦波なので、粒子はこの列上を左右にだけ動く（列内の全ての行が同じX座標になる）。
    const x = transform.physicsXToPixel(particle.position);

    for (let row = 0; row < rowCount; row += 1) {
      // 行は物理量を持たない表示専用の複製。中心を0として上下に等間隔で並べる。
      const rowOffsetIndex = row - (rowCount - 1) / 2;
      const y = centerYPx + rowOffsetIndex * rowSpacingPx;

      context.fillStyle = PARTICLE_COLOR;
      // beginPath()は新しい描画パスを開始するCanvas APIのメソッド。
      // 呼び出しておかないと、前の粒子の円の描画パスと意図せずつながってしまう。
      context.beginPath();
      // arc(x, y, radius, startAngle, endAngle)は円弧を描くCanvas APIのメソッド。
      // startAngle=0, endAngle=2πを指定すると円全体になる。
      context.arc(x, y, PARTICLE_RADIUS_PX, 0, Math.PI * 2);
      // fill()は、直前に定義したパス(ここでは円)の内側を、fillStyleの色で塗りつぶす。
      context.fill();

      if (i === highlightedIndex) {
        // 選択中の粒子だけ、本体より一回り大きい輪(輪郭線のみの円)を重ねて描く。
        // strokeはfillと違い、パスの内側を塗らず輪郭線だけを描くため、
        // 下にある粒子本体の色を隠さずに「選択されている」ことを示せる。
        context.strokeStyle = HIGHLIGHT_RING_COLOR;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, HIGHLIGHT_RING_RADIUS_PX, 0, Math.PI * 2);
        context.stroke();
      }
    }
  }
}
