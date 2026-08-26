// Rendering Layer の中心となるクラス。
// Canvas要素の取得・クリア・座標変換の管理、そして表示モード(Mode A/B/C)に応じて
// どのサブRenderer（Particle/Wave/Arrow）を呼び出すかを決める「司令塔」の役割を持つ。
//
// このファイルではCanvas描画・レイアウトの意味だけをコメントし、
// 物理的な意味（u, v_p等が何を表すか）はPhysics Layer側のコメントに任せる
// （コーディング規約 §8：物理モデルと描画処理でコメントの役割を分ける）。

import { createCoordinateTransform } from "../utils/math.js";
import { MEDIUM_LENGTH, MODE_PARTICLES, MODE_PARTICLES_AND_WAVE, PARTICLE_ROW_COUNT } from "../utils/constants.js";
import { renderParticles } from "./ParticleRenderer.js";
import { renderWaveform } from "./WaveRenderer.js";
import { renderCorrespondenceArrows } from "./ArrowRenderer.js";

const ROW_SPACING_PX = 10; // 断面方向（行）の間隔 [px]（表示専用の値。気柱振動と同じ考え方）

// JavaScript構文メモ：`class`はオブジェクトの設計図（テンプレート）を定義する構文。
// `new CanvasRenderer(canvasElement)`とすると、このclass内の`constructor`が呼ばれ、
// 個々のインスタンス（この場合は「1つのcanvasに対する描画係」）が作られる。
export class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    // getContext("2d")は、HTMLの<canvas>要素から「2D描画命令を送るための窓口」
    // （CanvasRenderingContext2Dオブジェクト）を取得するCanvas APIのメソッド。
    // 以後、円や線を描く命令はすべてこのcontext経由で行う。
    this.context = canvasElement.getContext("2d");
    // 実際の表示サイズが決まる前の仮の変換（resizeToDisplaySizeで正しい値に置き換わる）。
    this.transform = createCoordinateTransform({
      pixelsPerMeter: 1,
      originXPx: 0,
      originYPx: 0,
    });
    this.resizeToDisplaySize();
  }

  // Canvasの「実ピクセル数」(canvas.width/height)を、CSSで決まる「表示サイズ」
  // (canvas.clientWidth/clientHeight)に合わせる。
  //
  // なぜ必要か：<canvas>はCSSで見た目のサイズを変えても、描画用の解像度
  // (width/height属性)は自動的には変わらない。両者がずれると、描画内容が
  // 引き伸ばされてぼやけてしまうため、表示サイズが変わるたび（ウィンドウリサイズ時など）に
  // 明示的に合わせ直す必要がある。
  //
  // あわせて、媒質の全長(MEDIUM_LENGTH[m])がCanvas幅にちょうど収まるように
  // pixelsPerMeter（1mあたりのピクセル数）を計算し直す。
  resizeToDisplaySize() {
    const displayWidth = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;

    if (displayWidth === 0 || displayHeight === 0) {
      return;
    }

    this.canvas.width = displayWidth;
    this.canvas.height = displayHeight;

    // 左右に40pxずつ余白を残し、残りの幅にMEDIUM_LENGTH[m]分の媒質を収める。
    const marginPx = 40;
    const pixelsPerMeter = (displayWidth - marginPx * 2) / MEDIUM_LENGTH;

    this.transform = createCoordinateTransform({
      pixelsPerMeter,
      originXPx: marginPx,
      originYPx: displayHeight / 2,
    });
  }

  // clearRect(x, y, width, height)は、指定した矩形範囲のCanvas上の描画内容を
  // 透明にリセットするCanvas APIのメソッド。
  // 毎フレームの描画前に画面全体をクリアしないと、前のフレームの粒子や波形が
  // 消えずに残り続けてしまう（アニメーションの基本操作）。
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 現在のSimulationStateを、指定した表示モードで描画する。
   *
   * このメソッドはsimulationStateを読み取るだけで、値を変更したり
   * 物理量を再計算したりしない（architecture.md §8：Physics → State → Renderer の
   * 一方向データフローを守る）。
   *
   * レイアウト：
   * 気柱振動（js/renderer/acoustic/AirColumnRenderer.js）と同じく、粒子の格子（行列表示）と
   * 波形・矢印を、画面中央の同じ帯に重ねて描画する（別々のレーンに分けない）。
   * Mode A/B/Cの違いは「その帯に何を重ねて描くか」だけで、帯の位置自体は変わらない。
   *
   * @param {Object} simulationState - 描画対象のSimulationState
   * @param {string} mode - MODE_PARTICLES / MODE_PARTICLES_AND_WAVE / MODE_FULL_EXPLANATION
   * @param {Object} [options]
   * @param {number|null} [options.highlightedParticleIndex] - 選択中の粒子番号（Stage 7で使用）
   */
  render(simulationState, mode, { highlightedParticleIndex = null } = {}) {
    this.clear();

    const { particles } = simulationState;
    const centerYPx = this.canvas.height / 2;

    renderParticles(
      this.context,
      this.transform,
      particles,
      centerYPx,
      ROW_SPACING_PX,
      PARTICLE_ROW_COUNT,
      highlightedParticleIndex
    );

    if (mode === MODE_PARTICLES) {
      return;
    }

    renderWaveform(this.context, this.transform, particles, centerYPx);

    if (mode === MODE_PARTICLES_AND_WAVE) {
      return;
    }

    // Mode C：粒子の左右変位矢印と、波形上の対応する上下変位矢印を同じ帯に重ねて描く。
    renderCorrespondenceArrows(this.context, this.transform, particles, centerYPx, {
      highlightedIndex: highlightedParticleIndex,
    });
  }

  /**
   * Canvas上のクリック位置(canvasXPx)に最も近い粒子の番号(インデックス)を返す
   * （requirements §7 粒子選択機能のヒット判定）。
   *
   * 粒子はすべて同じX座標上（初期位置initialPositionの順）に並んでいるため、
   * クリックされたX座標を物理座標に変換し、initialPositionが最も近い粒子を探す。
   *
   * @param {number} canvasXPx - クリックされたCanvas上のX座標 [px]
   * @param {Array<Object>} particles - SimulationState.particles
   * @returns {number} 最も近い粒子の配列インデックス
   */
  findNearestParticleIndex(canvasXPx, particles) {
    const clickedPhysicsX = this.transform.pixelXToPhysics(canvasXPx);

    let nearestIndex = 0;
    let nearestDistance = Infinity;
    // JavaScript構文メモ：forEachのコールバックにはindexも渡されるため、
    // 「何番目の要素か」を使いながら配列を1周する典型的な書き方。
    particles.forEach((particle, index) => {
      const distance = Math.abs(particle.initialPosition - clickedPhysicsX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return nearestIndex;
  }
}
