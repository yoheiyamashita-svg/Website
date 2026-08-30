// 気柱内部に重ねて描く定常波の変位曲線（指示書§23-24）。
//
// 波形は気柱の外側に別グラフとして置かず、気柱の内部に重ねて描画する。
// 横軸：変位u（管の中心線からの左右オフセット）、縦軸：管の長さ方向の位置x
// （js/renderer/WaveRenderer.jsの横軸=位置・縦軸=変位という縦波の描き方を、
// 気柱では管が縦長であることに合わせて90度回転させた形で適用している）。
//
// Simulation側で計算済みのcolumn.displacementを読むだけで、
// ここで変位を再計算することはしない（REQ-105の精神を気柱にも適用）。
//
// 【開口端補正Δxによる、管からはみ出す部分の表示について】
// sourceEndExtension（上端、上端が開口のときだけ存在）とfarEndExtension（下端、下端が
// 開口のときだけ存在）は、管の物理的な範囲(x∈[0,tubeLength])の外側で計算された変位点列
// （js/simulation/AirColumnState.jsのrebuildEndExtensions参照）。管の内部(columns)は
// 実線、管の外側にはみ出す延長区間は破線で描き分けることで、「ここから先は実際の
// 管の外（腹の理論位置まで）」であることを視覚的に区別する。

import { AIR_COLUMN_END_CLOSED } from "../../utils/constants.js";

const WAVE_LINE_COLOR = "#2c7a4b";
const WAVE_LINE_WIDTH_PX = 2;
const EXTENSION_DASH_PATTERN = [5, 4]; // 延長区間（管の外側）を破線で描くためのパターン [px]
const CENTER_LINE_COLOR = "#c0c0c0";
const BOUNDARY_LABEL_COLOR = "#333";
const BOUNDARY_LABEL_FONT = "12px sans-serif";

/**
 * 気柱内部の変位曲線（開口端補正による延長区間を含む）と、
 * 両端の境界条件ラベル（腹/節）を描画する。
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} transform - 管の長さ方向をY軸とする座標変換
 * @param {Array<Object>} columns - AirColumnState.columns（管の内部、実線で描く）
 * @param {Array<Object>} sourceEndExtension - 音源側の延長区間（管の外側、破線で描く）
 * @param {Array<Object>} farEndExtension - 反対側の延長区間（両端開管のときだけ存在。破線）
 * @param {number} tubeCenterXPx - 管の中心線のCanvas X座標 [px]（変位0の基準線）
 * @param {string} sourceEndType - AIR_COLUMN_END_OPEN | AIR_COLUMN_END_CLOSED（x=0側＝上端）
 * @param {string} farEndType - AIR_COLUMN_END_OPEN | AIR_COLUMN_END_CLOSED（x=L側＝下端）
 */
export function renderAirColumnWaveform(
  context,
  transform,
  columns,
  sourceEndExtension,
  farEndExtension,
  tubeCenterXPx,
  sourceEndType,
  farEndType
) {
  // ラベル・基準線の両端は、延長区間があればその先端（腹の理論位置）、
  // なければ管の物理的な端(columns[0]/columns[末尾])を使う。
  const topPoint = sourceEndExtension.length > 0 ? sourceEndExtension[0] : columns[0];
  const bottomPoint = farEndExtension.length > 0 ? farEndExtension[farEndExtension.length - 1] : columns[columns.length - 1];
  const topYPx = transform.physicsXToPixel(topPoint.initialPosition);
  const bottomYPx = transform.physicsXToPixel(bottomPoint.initialPosition);

  // 変位0の基準線（管の中心線）を薄いグレーの縦線で描く。延長区間も含めた全区間に引く。
  context.strokeStyle = CENTER_LINE_COLOR;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(tubeCenterXPx, topYPx);
  context.lineTo(tubeCenterXPx, bottomYPx);
  context.stroke();

  // 音源側の延長区間（管の外側、破線）。
  if (sourceEndExtension.length > 0) {
    drawWaveSegment(context, transform, sourceEndExtension, tubeCenterXPx, true);
  }
  // 管の内部（実線）。縦波のWaveRenderer.jsと同様、moveTo/lineToで折れ線として結ぶ。
  drawWaveSegment(context, transform, columns, tubeCenterXPx, false);
  // 反対側の延長区間（両端開管のときだけ、管の外側、破線）。
  if (farEndExtension.length > 0) {
    drawWaveSegment(context, transform, farEndExtension, tubeCenterXPx, true);
  }

  // x=0（上端）・x=L（下端）とも、選択された境界条件に従い、腹（開口）または節（閉口）。
  const sourceEndLabel = sourceEndType === AIR_COLUMN_END_CLOSED ? "閉口（節）" : "開口（腹）";
  drawBoundaryLabel(context, tubeCenterXPx, topYPx, sourceEndLabel, "above");
  const farEndLabel = farEndType === AIR_COLUMN_END_CLOSED ? "閉口（節）" : "開口（腹）";
  drawBoundaryLabel(context, tubeCenterXPx, bottomYPx, farEndLabel, "below");
}

// 変位曲線の1区間（管の内部、または開口端補正の延長区間）を折れ線として描く。
function drawWaveSegment(context, transform, points, tubeCenterXPx, dashed) {
  context.strokeStyle = WAVE_LINE_COLOR;
  context.lineWidth = WAVE_LINE_WIDTH_PX;
  // setLineDash([a, b])は、これ以降のstroke()で描く線を「aピクセル描いてbピクセル空ける」
  // 破線にするCanvas APIのメソッド。空配列を渡すと実線に戻る。管の外側にはみ出す
  // 延長区間だけ破線にすることで、「ここから先は理論上の延長」であることを示す。
  context.setLineDash(dashed ? EXTENSION_DASH_PATTERN : []);

  context.beginPath();
  points.forEach((point, index) => {
    const y = transform.physicsXToPixel(point.initialPosition);
    const x = transform.pixelXForOffset(tubeCenterXPx, point.displacement);
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.stroke();

  // 他のRenderer（実線を前提にしている箇所）に影響しないよう、破線設定を元に戻しておく。
  context.setLineDash([]);
}

// 境界端に「開口（腹）」「閉口（節）」というラベルを描く。
// fillText(text, x, y)はCanvas APIで文字列を描画するメソッド。
// textAlign/textBaselineで基準点をどこに取るかを指定できる。
function drawBoundaryLabel(context, xPx, yPx, text, position) {
  context.fillStyle = BOUNDARY_LABEL_COLOR;
  context.font = BOUNDARY_LABEL_FONT;
  context.textAlign = "center";
  context.textBaseline = position === "above" ? "bottom" : "top";
  const offsetPx = position === "above" ? -6 : 6;
  context.fillText(text, xPx, yPx + offsetPx);
}
