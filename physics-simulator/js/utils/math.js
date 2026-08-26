// Physics Coordinate（物理座標 x [m]）と Canvas Coordinate（画面座標 X [px]）を
// 相互変換するユーティリティ（architecture.md §13-14）。
//
// なぜ分離するのか：
// 物理モデル(Physics Layer)は「メートル」という現実の単位だけを扱い、
// 「画面の何ピクセル目に描くか」を一切知らない状態に保ちたい。
// こうしておくと、画面サイズや拡大率が変わってもPhysics Layerのコードを
// 一切変更せずに済む（関心の分離）。

/**
 * 物理座標系とCanvas座標系を変換するオブジェクトを作る。
 *
 * 変換式:
 *   X[px] = originXPx + x[m] × pixelsPerMeter
 * scale（pixelsPerMeter）は「1mを何pxで表示するか」を表す倍率。
 *
 * @param {Object} params
 * @param {number} params.pixelsPerMeter - 1mあたりのピクセル数 [px/m]
 * @param {number} params.originXPx - 物理座標 x=0 に対応するCanvas上のX座標 [px]
 * @param {number} params.originYPx - 物理座標 y=0（変位0）に対応するCanvas上のY座標 [px]
 * @returns {Object} 座標変換メソッドを持つオブジェクト
 */
export function createCoordinateTransform({ pixelsPerMeter, originXPx, originYPx }) {
  return {
    pixelsPerMeter,
    originXPx,
    originYPx,

    // 物理座標 x[m] をCanvas上のX座標[px]に変換する。
    // X = originX + x × scale
    physicsXToPixel(xMeters) {
      return this.originXPx + xMeters * this.pixelsPerMeter;
    },

    // 物理座標 y[m]（変位など）をCanvas上のY座標[px]に変換する。
    // Canvasの座標系はY軸下向きが正（画面上ほど値が小さい）だが、
    // 物理量としては上向きを正としたいため、符号を反転させて変換する。
    physicsYToPixel(yMeters) {
      return this.originYPx - yMeters * this.pixelsPerMeter;
    },

    // 複数レーン（粒子レーン・波形レーンなど）を1つのCanvasに並べて描くための、
    // 任意のレーン中心Y座標(laneCenterYPx)からの変位オフセット変換。
    // physicsYToPixelとの違いは、原点をtransform固定のoriginYPxではなく
    // 呼び出し側が指定するlaneCenterYPxにできる点で、
    // 例えば「粒子レーン」と「波形レーン」を上下に並べて描くのに使う。
    pixelYForOffset(laneCenterYPx, valueMeters) {
      return laneCenterYPx - valueMeters * this.pixelsPerMeter;
    },

    // pixelYForOffsetの左右版。気柱振動は縦長の管として表示するため、
    // 「管の長さ方向の位置」をCanvasのY座標、「その位置での変位」をCanvasのX座標
    // （管の中心線からの横オフセット）として描く場面で使う
    // （js/renderer/acoustic/AirColumnWaveRenderer.js等）。
    // 符号を反転させないのは、横方向は物理・Canvasのどちらも「右が正」で一致しており、
    // pixelYForOffsetのような上下反転が不要なため。
    pixelXForOffset(centerXPx, valueMeters) {
      return centerXPx + valueMeters * this.pixelsPerMeter;
    },

    // Canvas上のX座標[px]を物理座標 x[m] に逆変換する（クリック位置の特定などに使用）。
    // 気柱振動（js/renderer/acoustic/AirColumnRenderer.js）では、管を縦長に表示する
    // ためoriginXPx/physicsXToPixel/pixelXToPhysicsを「管の長さ方向(画面のY軸)」の
    // 変換として転用する（このtransformオブジェクト自体はXが何を表すか関知しないため、
    // 呼び出し側でその軸が画面上どちら向きかを決めてよい）。
    pixelXToPhysics(xPixels) {
      return (xPixels - this.originXPx) / this.pixelsPerMeter;
    },
  };
}

/**
 * 値を[min, max]の範囲に収める。
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
