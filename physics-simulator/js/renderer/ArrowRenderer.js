// Mode C専用のRenderer（physics.md §8 Mode C、実装計画「教育的優位性1」の中核機能）。
//
// 目的：
//   粒子の左右方向の運動 → 粒子の変位 → 波形上の上下方向の変位
// という対応関係を、生徒が矢印の向き・長さとして視覚的に確認できるようにする。
//
// 粒子の格子と波形は同じ帯（laneCenterYPx）に重ねて表示するため（気柱振動と同じ設計）、
// 同じ粒子番号iについて、以下の2本の矢印を同一フレーム・同じ場所に重ねて描く。
//   1. 初期位置(x0_i)から現在のposition(x_i)への「左右方向」の矢印
//      → u_i = x_i - x0_i を横向きの矢印として可視化したもの
//   2. 波形の基準線(displacement=0)から、その粒子の変位u(x_i,t)の高さまでの
//      「上下方向」の矢印
// 2つの矢印はどちらも particle.displacement という同じ値だけを参照して描いており、
// このファイルの中で変位を計算し直すことはない（architecture.md §8, REQ-105）。
//
// 矢印そのものの描画処理（線＋矢じり）は js/renderer/drawArrow.js に共通化してあり、
// 気柱振動用の js/renderer/acoustic/AirColumnArrowRenderer.js も同じ関数を再利用する
// （同じ処理を2箇所に複製しない）。

import { drawArrow } from "./drawArrow.js";

const PARTICLE_ARROW_COLOR = "#d97b2c"; // 粒子の左右変位矢印の色
const WAVE_ARROW_COLOR = "#2c6bd9"; // 波形上の上下変位矢印の色

/**
 * 粒子↔波形の対応矢印を描画する。
 *
 * 粒子が多いと矢印だらけになり見づらくなるため、sampleIntervalおきに間引いて描画する。
 * ただし、ユーザーが選択中の粒子(highlightedIndex)は間引かず必ず描き、
 * 通常より太い線で強調する（Stage 7の粒子選択機能と連動する）。
 *
 * @param {CanvasRenderingContext2D} context
 * @param {Object} transform - 座標変換オブジェクト
 * @param {Array<Object>} particles - SimulationState.particles
 * @param {number} laneCenterYPx - 粒子の格子・波形を重ねて描く帯の中心Y座標 [px]
 * @param {Object} [options]
 * @param {number} [options.sampleInterval=10] - 何粒子おきに矢印を描くか
 * @param {number|null} [options.highlightedIndex=null] - 強調表示する粒子番号
 */
export function renderCorrespondenceArrows(
  context,
  transform,
  particles,
  laneCenterYPx,
  { sampleInterval = 10, highlightedIndex = null } = {}
) {
  particles.forEach((particle, index) => {
    // JavaScript構文メモ：`%`（剰余演算子）でindexをsampleIntervalで割った余りが0のときだけ
    // 描画対象にすることで、「sampleInterval個おきに1つ」を選び出している。
    const isSampled = index % sampleInterval === 0;
    const isHighlighted = index === highlightedIndex;
    if (!isSampled && !isHighlighted) {
      return;
    }

    // 1. 左右方向の変位矢印（x0_i → x_i）。粒子の格子と同じ帯の高さに描く。
    const initialXPx = transform.physicsXToPixel(particle.initialPosition);
    const currentXPx = transform.physicsXToPixel(particle.position);
    drawArrow(context, initialXPx, laneCenterYPx, currentXPx, laneCenterYPx, PARTICLE_ARROW_COLOR, isHighlighted);

    // 2. 同じ粒子に対応する、上下方向の変位矢印（基準線 → u(x_i,t)の高さ）。
    // X座標は横軸=初期位置x0という波形の定義（physics.md §7）に合わせる。
    const waveXPx = transform.physicsXToPixel(particle.initialPosition);
    const waveYPx = transform.pixelYForOffset(laneCenterYPx, particle.displacement);
    drawArrow(context, waveXPx, laneCenterYPx, waveXPx, waveYPx, WAVE_ARROW_COLOR, isHighlighted);
  });
}
