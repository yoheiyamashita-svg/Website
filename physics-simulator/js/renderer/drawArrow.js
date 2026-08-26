// 矢印を1本描く、Canvas描画の共通プリミティブ。
// 縦波のMode C（js/renderer/ArrowRenderer.js）と気柱振動のMode C
// （js/renderer/acoustic/AirColumnArrowRenderer.js）の両方から使う。
// どちらも「2点を結ぶ矢印を描く」という処理自体は同じであり、
// 意味（何のx方向変位を表すか等）はそれぞれの呼び出し側でコメントする
// （このファイル自体はCanvas描画の意味だけを説明し、物理的な意味には立ち入らない）。

const ARROWHEAD_LENGTH_PX = 6; // 矢印の先端(矢じり)の長さ [px]

/**
 * (x1,y1)から(x2,y2)へ向かう矢印を1本描く（線＋先端の矢じり）。
 * Canvas APIには「矢印を描く」専用命令が無いため、直線(stroke)と
 * 三角形(fill)を組み合わせて手動で矢印の形を作る。
 *
 * @param {CanvasRenderingContext2D} context
 * @param {number} x1 - 始点X [px]
 * @param {number} y1 - 始点Y [px]
 * @param {number} x2 - 終点X [px]（矢じりが向く先）
 * @param {number} y2 - 終点Y [px]
 * @param {string} color - 矢印の色（CSS色文字列）
 * @param {boolean} isHighlighted - trueのとき、通常より太い線で強調する
 */
export function drawArrow(context, x1, y1, x2, y2, color, isHighlighted) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Math.hypot(dx, dy)は sqrt(dx^2 + dy^2) と同じ、2点間の距離を求める組み込み関数。
  const length = Math.hypot(dx, dy);
  if (length < 1) {
    // 変位がほぼ0で矢印が短すぎる場合は、矢じりの向きが不安定になるため描画を省略する。
    return;
  }

  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = isHighlighted ? 3 : 1.5;

  // 矢印の軸となる直線を描く。
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();

  // 矢じり（三角形）を、矢印の向き(angle)から左右に30度(Math.PI/6)ずつ開いた
  // 2点と先端(x2,y2)を結んで作る。Math.atan2(dy, dx)は、
  // 原点から(dx,dy)方向を向くベクトルの角度[rad]を返す組み込み関数。
  const angle = Math.atan2(dy, dx);
  context.beginPath();
  context.moveTo(x2, y2);
  context.lineTo(
    x2 - ARROWHEAD_LENGTH_PX * Math.cos(angle - Math.PI / 6),
    y2 - ARROWHEAD_LENGTH_PX * Math.sin(angle - Math.PI / 6)
  );
  context.lineTo(
    x2 - ARROWHEAD_LENGTH_PX * Math.cos(angle + Math.PI / 6),
    y2 - ARROWHEAD_LENGTH_PX * Math.sin(angle + Math.PI / 6)
  );
  // closePath()は、現在のパスの始点(ここではmoveToした矢じりの片端)と
  // 終点を直線でつなぎ、パスを閉じるCanvas APIのメソッド。三角形を塗りつぶすために使う。
  context.closePath();
  context.fill();
}
