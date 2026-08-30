// 気柱振動のRendering Layerの中心となるクラス（js/renderer/CanvasRenderer.jsの気柱振動版）。
//
// 縦波は媒質を横長に表示するが、気柱は指示書§14の通り縦長に表示する。
// そのためこのクラスの座標変換は、管の長さ方向(x: 0〜tubeLength)をCanvasの
// 縦方向(Y)にマッピングする（js/utils/math.jsのphysicsXToPixel/pixelXToPhysicsを
// 「縦方向の変換」として転用する。詳しくはmath.js側のコメントを参照）。
//
// tubeLengthはスライダーでいつでも変わりうる（縦波のMEDIUM_LENGTHのような固定定数ではない）
// ため、座標変換はウィンドウリサイズ時だけでなく、毎フレームrender()の中で作り直す。
//
// 【開口端補正Δxの延長区間の表示スペースについて】
// 開口端補正Δx>0のとき、波形は管の物理的な開口部より外側（腹の理論位置まで）はみ出して
// 描画される（js/renderer/acoustic/AirColumnWaveRenderer.js参照）。このはみ出す分の
// スペースをCanvas上に確保するため、座標変換のスケール(pixelsPerMeter)は
// tubeLengthだけでなく、上下の延長区間の長さも含めた「総表示長」から計算する。

import { createCoordinateTransform } from "../../utils/math.js";
import {
  AIR_COLUMN_END_CLOSED,
  AIR_COLUMN_END_OPEN,
  MODE_PARTICLES,
  MODE_PARTICLES_AND_WAVE,
  MODE_WAVE_ONLY,
} from "../../utils/constants.js";
import { renderAirColumnParticles } from "./AirColumnParticleRenderer.js";
import { renderAirColumnWaveform } from "./AirColumnWaveRenderer.js";
import { renderAirColumnCorrespondenceArrows } from "./AirColumnArrowRenderer.js";

const TUBE_WIDTH_PX = 140; // 管を描く幅 [px]（表示専用の値。物理量ではない）
const ROW_SPACING_PX = 18; // 断面方向の粒子(行)の間隔 [px]（表示専用）
const TUBE_WALL_COLOR = "#555";
const TUBE_WALL_WIDTH_PX = 2;
const MARGIN_PX = 40; // 管（と延長区間）の上下に確保する余白 [px]

export class AirColumnRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.context = canvasElement.getContext("2d");
    this.transform = createCoordinateTransform({ pixelsPerMeter: 1, originXPx: 0, originYPx: 0 });
    this.resizeToDisplaySize();
  }

  // Canvasの実ピクセル数をCSS表示サイズに合わせる（tubeLengthには依存しない部分）。
  // CanvasRenderer.resizeToDisplaySizeと同じ理由（表示解像度のズレを防ぐ）。
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

  // 現在のtubeLength[m]と、開口端補正による上下の延長区間の長さ[m]に基づいて、
  // 管の長さ方向をCanvasの縦方向にマッピングする座標変換を作り直す。
  // 上下にMARGIN_PXずつ余白を残し、残りの高さに「tubeLength + 延長区間」の
  // 総表示長を収める（延長区間が0のときはこれまでと同じ計算に一致する）。
  updateTransform(tubeLength, topExtensionLength, bottomExtensionLength) {
    const displayHeight = this.canvas.height;
    const totalVisualLength = tubeLength + topExtensionLength + bottomExtensionLength;
    const pixelsPerMeter = (displayHeight - MARGIN_PX * 2) / totalVisualLength;
    this.transform = createCoordinateTransform({
      pixelsPerMeter,
      // x=0（上端）を、上の延長区間の分だけ余白から下げた位置に置く。
      // topExtensionLength=0のときはMARGIN_PXのまま（これまでと同じ）。
      originXPx: MARGIN_PX + topExtensionLength * pixelsPerMeter,
      originYPx: 0, // このtransformでは横方向オフセットは呼び出し側が明示的に指定するため未使用
    });
    // drawTubeOutline()がbottomYPxを計算する際に使えるよう、今のtubeLengthを覚えておく。
    this._tubeLength = tubeLength;
  }

  /**
   * 現在のAirColumnStateを、指定した表示モードで描画する。
   *
   * @param {Object} airColumnState - 描画対象のAirColumnState
   * @param {string} mode - MODE_PARTICLES / MODE_PARTICLES_AND_WAVE / MODE_FULL_EXPLANATION / MODE_WAVE_ONLY
   * @param {Object} [options]
   * @param {number|null} [options.highlightedColumnIndex] - 選択中の列番号
   * @param {boolean} [options.tubeVisible=true] - 管の外枠を描くかどうか（表示専用の切り替え）
   */
  render(airColumnState, mode, { highlightedColumnIndex = null, tubeVisible = true } = {}) {
    this.clear();

    const { columns, sourceEndType, farEndType, sourceEndExtension, farEndExtension, endCorrection } =
      airColumnState;
    // 上端(x=0)が開口のときだけ上側の延長区間を確保する。
    // 下端(x=L)が開口のときだけ下側の延長区間を確保する
    // （閉口端は硬い壁で補正を受けないため、延長区間の長さは0＝はみ出さない）。
    const topExtensionLength = sourceEndType === AIR_COLUMN_END_OPEN ? endCorrection : 0;
    const bottomExtensionLength = farEndType === AIR_COLUMN_END_OPEN ? endCorrection : 0;
    this.updateTransform(airColumnState.tubeLength, topExtensionLength, bottomExtensionLength);

    const tubeCenterXPx = this.canvas.width / 2;

    if (tubeVisible) {
      this.drawTubeOutline(tubeCenterXPx, sourceEndType, farEndType);
    }

    if (mode === MODE_WAVE_ONLY) {
      // 粒子・矢印は描かず、波形だけを描く（ユーザー要望：粒子を表示しないモード）。
      renderAirColumnWaveform(
        this.context,
        this.transform,
        columns,
        sourceEndExtension,
        farEndExtension,
        tubeCenterXPx,
        sourceEndType,
        farEndType
      );
      return;
    }

    if (mode === MODE_PARTICLES) {
      renderAirColumnParticles(
        this.context,
        this.transform,
        columns,
        tubeCenterXPx,
        ROW_SPACING_PX,
        airColumnState.rowCount,
        highlightedColumnIndex
      );
      return;
    }

    renderAirColumnParticles(
      this.context,
      this.transform,
      columns,
      tubeCenterXPx,
      ROW_SPACING_PX,
      airColumnState.rowCount,
      highlightedColumnIndex
    );
    // 波形だけは、開口端補正によるはみ出し部分（sourceEndExtension/farEndExtension）も
    // 腹の理論位置まで重ねて描く（ユーザー要望：粒子格子は気柱内部のみでよい）。
    renderAirColumnWaveform(
      this.context,
      this.transform,
      columns,
      sourceEndExtension,
      farEndExtension,
      tubeCenterXPx,
      sourceEndType,
      farEndType
    );

    if (mode === MODE_PARTICLES_AND_WAVE) {
      return;
    }

    renderAirColumnCorrespondenceArrows(this.context, this.transform, columns, tubeCenterXPx, {
      highlightedIndex: highlightedColumnIndex,
    });
  }

  // 管の外枠を描く。壁(左右)は実線、開口端は隙間を空けて「開いている」ことを表し、
  // 閉口端は太い実線で「閉じている」ことを表す（見た目だけでなく、
  // AirColumnWaveRenderer側のテキストラベルとも一致させている）。
  // 管の壁そのものは、開口端補正の延長区間の影響を受けず、常に物理的なtubeLengthの
  // 範囲(x=0〜x=tubeLength)だけを描く（延長区間は「管の外にはみ出た波形」として描かれる）。
  drawTubeOutline(tubeCenterXPx, sourceEndType, farEndType) {
    const leftXPx = tubeCenterXPx - TUBE_WIDTH_PX / 2;
    const rightXPx = tubeCenterXPx + TUBE_WIDTH_PX / 2;
    const topYPx = this.transform.physicsXToPixel(0);
    const bottomYPx = this.transform.physicsXToPixel(this.currentTubeLength());

    this.context.strokeStyle = TUBE_WALL_COLOR;
    this.context.lineWidth = TUBE_WALL_WIDTH_PX;

    // 左右の壁。
    this.context.beginPath();
    this.context.moveTo(leftXPx, topYPx);
    this.context.lineTo(leftXPx, bottomYPx);
    this.context.moveTo(rightXPx, topYPx);
    this.context.lineTo(rightXPx, bottomYPx);
    this.context.stroke();

    // 上端(x=0)。開口なら描かず（＝開いたまま）、閉口なら太い横線で塞ぐ
    // （以前は上端＝音源側が常に開口だったため、この分岐は存在しなかった）。
    if (sourceEndType === AIR_COLUMN_END_CLOSED) {
      this.context.lineWidth = TUBE_WALL_WIDTH_PX * 2;
      this.context.beginPath();
      this.context.moveTo(leftXPx, topYPx);
      this.context.lineTo(rightXPx, topYPx);
      this.context.stroke();
    }

    // 下端(x=L)。開口なら描かず（＝開いたまま）、閉口なら太い横線で塞ぐ。
    if (farEndType === AIR_COLUMN_END_CLOSED) {
      this.context.lineWidth = TUBE_WALL_WIDTH_PX * 2;
      this.context.beginPath();
      this.context.moveTo(leftXPx, bottomYPx);
      this.context.lineTo(rightXPx, bottomYPx);
      this.context.stroke();
    }
  }

  // drawTubeOutlineはrender()内でthis.transformを作り直した直後にしか呼ばれないため、
  // 「今のtubeLength」をtransformから逆算する代わりに、直近にrender()へ渡された値を
  // 覚えておく。render()の中で必ずこのメソッドより先にセットする。
  currentTubeLength() {
    return this._tubeLength;
  }

  /**
   * Canvas上のクリック位置(canvasYPx)に最も近い列の番号を返す
   * （指示書§36の粒子選択機能のヒット判定。縦波のfindNearestParticleIndexの気柱振動版）。
   *
   * @param {number} canvasYPx - クリックされたCanvas上のY座標 [px]
   * @param {Array<Object>} columns - AirColumnState.columns
   * @returns {number} 最も近い列の配列インデックス
   */
  findNearestColumnIndex(canvasYPx, columns) {
    const clickedPhysicsX = this.transform.pixelXToPhysics(canvasYPx);

    let nearestIndex = 0;
    let nearestDistance = Infinity;
    columns.forEach((column, index) => {
      const distance = Math.abs(column.initialPosition - clickedPhysicsX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  }
}
