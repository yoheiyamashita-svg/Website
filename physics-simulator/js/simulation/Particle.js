// 媒質を構成する1つの粒子を表すデータ構造（architecture.md §6 Particle Object）。
// ここではデータの入れ物（プレーンオブジェクト）を作るだけで、
// 運動の計算そのものは行わない。計算はPhysics Layer（js/physics/以下）が担当する
// （原則1: 物理計算と描画・データ管理を混在させない）。

/**
 * 1つの粒子の初期状態を作る。
 *
 * @param {number} initialPosition - 粒子の初期位置 x0 [m]（媒質が振動していないときの位置）
 * @returns {{initialPosition: number, position: number, displacement: number, velocity: number}}
 *   initialPosition: 初期位置 x0 [m]
 *   position:        現在位置 x(t) [m]（= initialPosition + displacement）
 *   displacement:     変位 u(t) [m]（現在位置と初期位置の差）
 *   velocity:         粒子速度 v_p(t) [m/s]（波の伝わる速さvとは別の物理量。physics.md §12参照）
 */
export function createParticle(initialPosition) {
  return {
    initialPosition,
    position: initialPosition,
    displacement: 0,
    velocity: 0,
  };
}
