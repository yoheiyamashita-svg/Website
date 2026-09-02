// 横波の反射（パルス）モードのRendering Layerの中心となるクラス
// （js/renderer/TransverseWaveRenderer.jsと対になる構造）。
//
// 縦波・横波（定常波）と同じく媒質を横長に表示する。粒子は表示せず、
// 入射波(パルス)・反射波(パルス)・合成波の3本の変位曲線を重ねて描画する。
// 加えて、右端の境界の種類（固定端/自由端）を、壁またはリングの絵で視覚的に示す
// （教科書的な標準表現：固定端＝壁、自由端＝棒に通したリング）。

import { createCoordinateTransform } from "../utils/math.js";
import { END_TYPE_FIXED } from "../utils/constants.js";

const MARGIN_PX = 40; // 媒質の左右に確保する余白 [px]
const ZERO_LINE_COLOR = "#c0c0c0";
const INCIDENT_COLOR = [44, 107, 217]; // 入射波の色 #2c6bd9
const REFLECTED_COLOR = [217, 123, 44]; // 反射波の色 #d97b2c
const COMBINED_COLOR = [44, 122, 75]; // 合成波の色 #2c7a4b
const LINE_WIDTH_PX = 2;
const LABEL_COLOR = "#333";
const LABEL_FONT = "12px sans-serif";
const WALL_COLOR = "#333";
const WALL_HALF_HEIGHT_PX = 95; // 壁・リングの絵の縦方向の半分の高さ [px]（表示専用、ユーザー要望でより大きく）

export class PulseReflectionRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext("2d");
    this.transform = createCoordinateTransform({ pixelsPerMeter: 1, originXPx: 0, originYPx: 0 });
    this.resizeToDisplaySize();
  }

  resizeToDisplaySize() {
    const displayWidth = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;
    if (displayWidth === 0 || displayHeight === 0) {
      return;
    }
    this.canvas.width = displayWidth;
    this.canvas.height = displayHeight;
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateTransform(mediumLength) {
    const displayWidth = this.canvas.width;
    const pixelsPerMeter = (displayWidth - MARGIN_PX * 2) / mediumLength;
    this.transform = createCoordinateTransform({
      pixelsPerMeter,
      originXPx: MARGIN_PX,
      originYPx: this.canvas.height / 2,
    });
  }

  /**
   * 現在のPulseReflectionStateを描画する。粒子は描かず、3本の変位曲線と
   * 右端の境界（壁/リング）を描く。
   *
   * @param {Object} pulseReflectionState - 描画対象のPulseReflectionState
   */
  render(pulseReflectionState) {
    this.clear();
    this.updateTransform(pulseReflectionState.mediumLength);

    const { points, endType, incidentOpacity, reflectedOpacity, combinedOpacity } =
      pulseReflectionState;
    const centerYPx = this.transform.originYPx;

    this.drawZeroLine(points, centerYPx);
    this.drawCurve(points, "incidentDisplacement", INCIDENT_COLOR, incidentOpacity, centerYPx);
    this.drawCurve(points, "reflectedDisplacement", REFLECTED_COLOR, reflectedOpacity, centerYPx);
    this.drawCurve(points, "combinedDisplacement", COMBINED_COLOR, combinedOpacity, centerYPx);

    this.drawBoundary(points, endType, centerYPx);
  }

  drawZeroLine(points, centerYPx) {
    this.context.strokeStyle = ZERO_LINE_COLOR;
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(this.transform.physicsXToPixel(points[0].initialPosition), centerYPx);
    this.context.lineTo(
      this.transform.physicsXToPixel(points[points.length - 1].initialPosition),
      centerYPx
    );
    this.context.stroke();
  }

  drawCurve(points, displacementKey, colorRgb, opacityPercent, centerYPx) {
    if (opacityPercent <= 0) {
      return;
    }
    const context = this.context;
    context.globalAlpha = opacityPercent / 100;
    context.strokeStyle = `rgb(${colorRgb[0]}, ${colorRgb[1]}, ${colorRgb[2]})`;
    context.lineWidth = LINE_WIDTH_PX;

    context.beginPath();
    points.forEach((point, index) => {
      const x = this.transform.physicsXToPixel(point.initialPosition);
      const y = this.transform.pixelYForOffset(centerYPx, point[displacementKey]);
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();

    context.globalAlpha = 1;
  }

  // 左端（振動源）にラベルを、右端に境界の種類に応じた絵とラベルを描く。
  drawBoundary(points, endType, centerYPx) {
    const leftXPx = this.transform.physicsXToPixel(points[0].initialPosition);
    const rightXPx = this.transform.physicsXToPixel(points[points.length - 1].initialPosition);

    this.drawLabel(leftXPx, centerYPx, "振動源");

    if (endType === END_TYPE_FIXED) {
      this.drawWall(rightXPx, centerYPx);
      this.drawLabel(rightXPx, centerYPx, "固定端");
    } else {
      this.drawRing(rightXPx, centerYPx);
      this.drawLabel(rightXPx, centerYPx, "自由端");
    }
  }

  // 固定端：壁（縦線＋斜線のハッチング）を描く。壁は動かない境界であることを表す。
  drawWall(xPx, centerYPx) {
    const context = this.context;
    context.strokeStyle = WALL_COLOR;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(xPx, centerYPx - WALL_HALF_HEIGHT_PX);
    context.lineTo(xPx, centerYPx + WALL_HALF_HEIGHT_PX);
    context.stroke();

    context.lineWidth = 1.5;
    const hatchCount = 9;
    for (let i = 0; i < hatchCount; i += 1) {
      const y = centerYPx - WALL_HALF_HEIGHT_PX + (i * (WALL_HALF_HEIGHT_PX * 2)) / (hatchCount - 1);
      context.beginPath();
      context.moveTo(xPx, y);
      context.lineTo(xPx + 9, y + 7);
      context.stroke();
    }
  }

  // 自由端：棒に通したリングを描く（弦の端が棒に沿って自由に上下できることを表す）。
  drawRing(xPx, centerYPx) {
    const context = this.context;
    context.strokeStyle = WALL_COLOR;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(xPx + 16, centerYPx - WALL_HALF_HEIGHT_PX);
    context.lineTo(xPx + 16, centerYPx + WALL_HALF_HEIGHT_PX);
    context.stroke();

    context.lineWidth = 3;
    context.beginPath();
    context.arc(xPx, centerYPx, 11, 0, Math.PI * 2);
    context.stroke();
  }

  drawLabel(xPx, centerYPx, text) {
    this.context.fillStyle = LABEL_COLOR;
    this.context.font = LABEL_FONT;
    this.context.textAlign = "center";
    this.context.textBaseline = "bottom";
    this.context.fillText(text, xPx, centerYPx - WALL_HALF_HEIGHT_PX - 6);
  }
}
