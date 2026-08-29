// 横波（定常波）モードのRendering Layerの中心となるクラス
// （js/renderer/CanvasRenderer.js・js/renderer/acoustic/AirColumnRenderer.jsと対になる構造）。
//
// 縦波と同じく媒質を横長に表示するが、このモードでは粒子は一切表示しない
// （ユーザー要望）。代わりに、右向き波(入射波)・左向き波(反射波)・合成波の
// 3本の変位曲線を、それぞれ独立した透明度で重ねて描画する。
//
// 媒質の長さ(mediumLength)は気柱の管の長さと同様スライダーでいつでも変わりうるため、
// 座標変換はウィンドウリサイズ時だけでなく、毎フレームrender()の中で作り直す
// （js/renderer/acoustic/AirColumnRenderer.jsと同じ設計）。

import { createCoordinateTransform } from "../utils/math.js";
import { END_TYPE_FIXED } from "../utils/constants.js";

const MARGIN_PX = 40; // 媒質の左右に確保する余白 [px]
const ZERO_LINE_COLOR = "#c0c0c0";
const INCIDENT_COLOR = [44, 107, 217]; // 右向き波（入射波）の色 #2c6bd9 をRGB配列で保持
const REFLECTED_COLOR = [217, 123, 44]; // 左向き波（反射波）の色 #d97b2c
const COMBINED_COLOR = [44, 122, 75]; // 合成波の色 #2c7a4b
const LINE_WIDTH_PX = 2;
const BOUNDARY_LABEL_COLOR = "#333";
const BOUNDARY_LABEL_FONT = "12px sans-serif";

// RGB色を白と混ぜて明るくするヘルパー。半波長ごとの色分け表示（drawSegmentedCurve）で
// 使う「濃い/薄い」の2トーンを、既存の基本色(INCIDENT_COLOR/REFLECTED_COLOR)から
// 自動的に作る。新しい色を別途決め打ちすると、基本色と紐付いた色だという意図が
// コードから読み取りにくくなるため、この関数経由で導出する。
// whiteRatio=0なら元の色のまま、1なら真っ白になる（線形補間）。
function lightenColor(rgb, whiteRatio) {
  return rgb.map((channel) => Math.round(channel + (255 - channel) * whiteRatio));
}

// 半波長ごとの色分け表示（ユーザー要望：「入射波に対応する反射波がどれかがわかる」ように
// したい）専用の、薄いトーンのバリエーション。
const INCIDENT_COLOR_LIGHT = lightenColor(INCIDENT_COLOR, 0.55);
const REFLECTED_COLOR_LIGHT = lightenColor(REFLECTED_COLOR, 0.55);

export class TransverseWaveRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext("2d");
    this.transform = createCoordinateTransform({ pixelsPerMeter: 1, originXPx: 0, originYPx: 0 });
    this.resizeToDisplaySize();
  }

  // Canvasの実ピクセル数をCSS表示サイズに合わせる（mediumLengthには依存しない部分）。
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

  // 現在のmediumLength[m]に基づいて、媒質の左右方向をCanvasの横方向にマッピングする
  // 座標変換を作り直す。左右にMARGIN_PXずつ余白を残す。
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
   * 現在のTransverseWaveStateを描画する。粒子は描かず、3本の変位曲線だけを描く。
   *
   * @param {Object} transverseWaveState - 描画対象のTransverseWaveState
   */
  render(transverseWaveState) {
    this.clear();
    this.updateTransform(transverseWaveState.mediumLength);

    const {
      points,
      endType,
      incidentOpacity,
      reflectedOpacity,
      combinedOpacity,
      halfWavelengthColoringEnabled,
      mediumLength,
      wavelength,
    } = transverseWaveState;
    const centerYPx = this.transform.originYPx;

    this.drawZeroLine(points, centerYPx);

    if (halfWavelengthColoringEnabled) {
      // 入射波・反射波を、右端(x=L、反射が起きる位置)基準のλ/2区間ごとに交互の濃淡で塗り分ける。
      // 同じx区間なら入射波・反射波とも同じ濃淡になるため、「この区間の入射波が、
      // 反射後にこの区間の反射波として見えている」という対応関係が一目でわかる。
      // 合成波は対応関係を示す対象ではないため、常に単色のまま描く。
      this.drawSegmentedCurve(
        points,
        "incidentDisplacement",
        INCIDENT_COLOR,
        INCIDENT_COLOR_LIGHT,
        incidentOpacity,
        centerYPx,
        mediumLength,
        wavelength
      );
      this.drawSegmentedCurve(
        points,
        "reflectedDisplacement",
        REFLECTED_COLOR,
        REFLECTED_COLOR_LIGHT,
        reflectedOpacity,
        centerYPx,
        mediumLength,
        wavelength
      );
    } else {
      this.drawCurve(points, "incidentDisplacement", INCIDENT_COLOR, incidentOpacity, centerYPx);
      this.drawCurve(points, "reflectedDisplacement", REFLECTED_COLOR, reflectedOpacity, centerYPx);
    }
    this.drawCurve(points, "combinedDisplacement", COMBINED_COLOR, combinedOpacity, centerYPx);

    this.drawBoundaryLabels(points, endType, centerYPx);
  }

  drawZeroLine(points, centerYPx) {
    this.context.strokeStyle = ZERO_LINE_COLOR;
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(this.transform.physicsXToPixel(points[0].initialPosition), centerYPx);
    this.context.lineTo(this.transform.physicsXToPixel(points[points.length - 1].initialPosition), centerYPx);
    this.context.stroke();
  }

  // 1本の変位曲線を、指定した色・不透明度で描く。
  // displacementKeyは、points[i]のどのフィールド（incident/reflected/combined）を
  // 描くかを指定する文字列。Rendererはこの値を読むだけで、変位そのものは計算しない。
  drawCurve(points, displacementKey, colorRgb, opacityPercent, centerYPx) {
    if (opacityPercent <= 0) {
      // 透明度0のときは描画自体を省略する（globalAlpha=0でも見た目は同じだが、
      // 無駄な描画コストを避けるため）。
      return;
    }
    const context = this.context;
    // globalAlphaは、これ以降の全ての描画命令に対して適用される不透明度(0〜1)を
    // 設定するCanvas APIのプロパティ。0=完全に透明、1=完全に不透明。
    // スライダーの0〜100[%]の値を0〜1の範囲に変換して設定する。
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

    // 他の描画（次のcurveや境界ラベル等）に影響しないよう、不透明度を元に戻しておく。
    context.globalAlpha = 1;
  }

  // 半波長ごとに交互の濃淡2色で塗り分けながら、1本の変位曲線を描く。
  // drawCurveとの違いは、strokeStyleを区間ごとに切り替えながら複数のパスに分けて
  // 描画する点だけで、変位の計算はしない（Rendererは値を読むだけ、REQ-105の精神）。
  //
  // 区間の基準は右端(x=mediumLength、反射が起きる位置)。そこからλ/2ずつ左へ数えた
  // 区間番号（0, 1, 2, ...）の偶奇で、darkColorRgb/lightColorRgbを交互に選ぶ。
  // 入射波・反射波の両方でこの同じ基準・同じ配色ルールを使うことで、
  // 「同じx区間＝同じ濃淡」が「入射波のこの部分と反射波のこの部分が対応する」という
  // 意味を持つようにしている。
  drawSegmentedCurve(points, displacementKey, darkColorRgb, lightColorRgb, opacityPercent, centerYPx, mediumLength, wavelength) {
    if (opacityPercent <= 0) {
      return;
    }
    const context = this.context;
    context.globalAlpha = opacityPercent / 100;
    context.lineWidth = LINE_WIDTH_PX;

    const halfWavelength = wavelength / 2;
    function colorForPosition(xMeters) {
      // (mediumLength - xMeters)は理論上[0, mediumLength]の範囲だが、xMetersが
      // 浮動小数点誤差でmediumLengthよりわずかに大きくなる点（右端ちょうどの点）では
      // 差がわずかに負の値になり、Math.floorで-1になってしまう（本来は区間0であるべき）。
      // Math.maxで0未満にならないようにし、右端の点が必ず区間0（濃い色）になるようにする。
      const segmentIndex = Math.max(0, Math.floor((mediumLength - xMeters) / halfWavelength));
      return segmentIndex % 2 === 0 ? darkColorRgb : lightColorRgb;
    }

    let currentColorRgb = null;
    points.forEach((point) => {
      const segmentColorRgb = colorForPosition(point.initialPosition);
      const x = this.transform.physicsXToPixel(point.initialPosition);
      const y = this.transform.pixelYForOffset(centerYPx, point[displacementKey]);

      if (segmentColorRgb !== currentColorRgb) {
        if (currentColorRgb !== null) {
          // 色が変わる境目の点まで前の色のパスを延ばしてから区切ることで、
          // 曲線が途中で途切れて見えないようにする。
          context.lineTo(x, y);
          context.stroke();
        }
        currentColorRgb = segmentColorRgb;
        context.strokeStyle = `rgb(${segmentColorRgb[0]}, ${segmentColorRgb[1]}, ${segmentColorRgb[2]})`;
        context.beginPath();
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.stroke();

    context.globalAlpha = 1;
  }

  // 左端（振動源、境界条件を持たない）と右端（固定端=節 / 自由端=腹）にラベルを描く。
  drawBoundaryLabels(points, endType, centerYPx) {
    const leftXPx = this.transform.physicsXToPixel(points[0].initialPosition);
    const rightXPx = this.transform.physicsXToPixel(points[points.length - 1].initialPosition);

    this.drawLabel(leftXPx, centerYPx, "振動源");
    const rightLabel = endType === END_TYPE_FIXED ? "固定端（節）" : "自由端（腹）";
    this.drawLabel(rightXPx, centerYPx, rightLabel);
  }

  drawLabel(xPx, centerYPx, text) {
    this.context.fillStyle = BOUNDARY_LABEL_COLOR;
    this.context.font = BOUNDARY_LABEL_FONT;
    this.context.textAlign = "center";
    this.context.textBaseline = "bottom";
    this.context.fillText(text, xPx, centerYPx - 60);
  }
}
