// 変位波形 u(x0) を描画するRenderer（physics.md §7, Mode B/C）。
//
// 教育上の注意（physics.md §23 誤解1）：
// この波形は「媒質が横方向にうねっている」のではなく、
// 「各位置x0の媒質が、今どれだけ変位uしているか」を
// 横軸=位置x0、縦軸=変位u としてグラフ化したものである。
// 縦波であっても変位のグラフは正弦カーブになる（グラフの形と実際の媒質の動きの向きは別物）。
//
// Simulation Stateにすでに計算済みの particle.displacement を読むだけで、
// 波の式(u = A sin(kx-ωt+φ))をこのファイルで再計算することはしない（REQ-105）。
//
// 波形は粒子の格子（js/renderer/ParticleRenderer.js）と同じ帯に重ねて描画する
// （気柱振動の描画方式と統一。ユーザー要望：「粗密波と波形を重ねる」）。

const WAVE_LINE_COLOR = "#2c7a4b";
const WAVE_LINE_WIDTH_PX = 2;
const ZERO_LINE_COLOR = "#c0c0c0"; // 変位0の基準線（水平線）の色

/**
 * 変位波形を折れ線として描画する。
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} transform - 座標変換オブジェクト
 * @param {Array<Object>} particles - SimulationState.particles（displacement計算済み）
 * @param {number} laneCenterYPx - 波形レーンの中心Y座標（=変位0の位置）[px]
 */
export function renderWaveform(context, transform, particles, laneCenterYPx) {
  // まず変位0の基準線を薄いグレーで描く。波形がこの線からどれだけ上下に
  // ずれているかで、変位の正負・大きさが直感的に読み取れるようにするため。
  context.strokeStyle = ZERO_LINE_COLOR;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(transform.physicsXToPixel(particles[0].initialPosition), laneCenterYPx);
  context.lineTo(
    transform.physicsXToPixel(particles[particles.length - 1].initialPosition),
    laneCenterYPx
  );
  // stroke()は、moveTo/lineToで組み立てたパス(線)を、strokeStyleの色・lineWidthの太さで
  // 実際に描画するCanvas APIのメソッド。fill()が「塗りつぶし」なのに対し、
  // strokeは「輪郭線を引く」操作。
  context.stroke();

  context.strokeStyle = WAVE_LINE_COLOR;
  context.lineWidth = WAVE_LINE_WIDTH_PX;
  context.beginPath();

  // JavaScript構文メモ：Array.prototype.forEachは配列の各要素に対して
  // コールバック関数を1回ずつ呼び出す高階関数。第2引数のindexで
  // 「これが何番目の粒子か」を受け取り、最初の点だけmoveTo（線の起点）、
  // それ以降はlineTo（起点から順につなぐ）で折れ線を組み立てている。
  particles.forEach((particle, index) => {
    // 横軸：粒子の初期位置x0[m]をCanvas X座標[px]に変換（physics.md §7）。
    const x = transform.physicsXToPixel(particle.initialPosition);
    // 縦軸：変位u[m]を、波形レーンの中心(laneCenterYPx)からのオフセットとして
    // Canvas Y座標[px]に変換する。
    const y = transform.pixelYForOffset(laneCenterYPx, particle.displacement);
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });

  context.stroke();
}
