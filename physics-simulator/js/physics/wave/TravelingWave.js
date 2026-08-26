// 正弦進行波の物理モデル（physics.md §4-5）。
//
// このファイルはPhysics Layerに属する。Canvas等の描画には一切関与せず、
// 「パラメータを渡すと物理量が返ってくる」純粋な計算関数だけを提供する
// （architecture.md §3.3「Physics LayerはCanvas APIを直接参照してはならない」）。
//
// 重要：粒子の位置を描く処理（Renderer側）も、波形グラフを描く処理（Renderer側）も、
// 必ずこのファイルの calculateDisplacement を経由して変位を求める。
// 見た目だけ違う2つの表現（粒子の動き／波形グラフ）を、
// 別々の近似式で「それらしく」描くことはしない（REQ-105, physics.md §5）。

/**
 * 波数 k を求める。
 *
 * 物理式:
 *   k = 2π / λ
 *
 * - k: 波数 [rad/m]。位置が1m進むごとに位相がどれだけ変化するかを表す。
 * - λ (wavelength): 波長 [m]。波が1回繰り返す長さ。
 *
 * @param {number} wavelength - 波長 λ [m]
 * @returns {number} 波数 k [rad/m]
 */
export function calculateWaveNumber(wavelength) {
  return (2 * Math.PI) / wavelength;
}

/**
 * 角周波数 ω を求める。
 *
 * 物理式:
 *   ω = 2πf
 *
 * - ω: 角周波数 [rad/s]。時間が1秒進むごとに位相がどれだけ変化するかを表す。
 * - f (frequency): 周波数 [Hz]。1秒間に何回振動するか。
 *
 * @param {number} frequency - 周波数 f [Hz]
 * @returns {number} 角周波数 ω [rad/s]
 */
export function calculateAngularFrequency(frequency) {
  return 2 * Math.PI * frequency;
}

/**
 * 波の速さ v を求める。
 *
 * 物理式:
 *   v = fλ
 *
 * 波の速さ v [m/s] は、波が1秒間に進む距離のこと。
 * 「1秒間に f 回、波長 λ ぶんずつ波形が進む」と考えると、
 * 1秒間に進む距離は f × λ になる。
 *
 * 注意：この v は「波形（山や谷のパターン）が進む速さ」であり、
 * 個々の粒子がその場で振動する速さ v_p（LongitudinalWave.jsのcalculateParticleVelocity）
 * とは別の物理量である（physics.md §23 誤解3、混同しないこと）。
 *
 * @param {number} frequency - 周波数 f [Hz]
 * @param {number} wavelength - 波長 λ [m]
 * @returns {number} 波の速さ v [m/s]
 */
export function calculateWaveSpeed(frequency, wavelength) {
  return frequency * wavelength;
}

/**
 * 波速vを固定したまま波長λを変更したときの、追従すべき周波数fを求める
 * （指示書§7-8「v固定」機能）。
 *
 * 物理式:
 *   v = fλ を f について解くと f = v / λ
 *
 * @param {number} waveSpeed - 固定する波の速さ v [m/s]
 * @param {number} wavelength - 波長 λ [m]
 * @returns {number} 周波数 f [Hz]
 */
export function calculateFrequencyFromWaveSpeed(waveSpeed, wavelength) {
  return waveSpeed / wavelength;
}

/**
 * 波速vを固定したまま周波数fを変更したときの、追従すべき波長λを求める。
 *
 * 物理式:
 *   v = fλ を λ について解くと λ = v / f
 *
 * @param {number} waveSpeed - 固定する波の速さ v [m/s]
 * @param {number} frequency - 周波数 f [Hz]
 * @returns {number} 波長 λ [m]
 */
export function calculateWavelengthFromWaveSpeed(waveSpeed, frequency) {
  return waveSpeed / frequency;
}

/**
 * 位置 x、時刻 t における変位 u(x,t) を求める（正弦進行波モデル）。
 *
 * 物理式:
 *   u(x,t) = A sin(kx - ωt + φ)
 *
 * - u: 変位 [m]。媒質がその場の釣り合いの位置からどれだけずれているか。
 * - A (amplitude): 振幅 [m]。変位の最大値。
 * - k: 波数 [rad/m]（calculateWaveNumberで求める）。
 * - x: 位置 [m]。
 * - ω: 角周波数 [rad/s]（calculateAngularFrequencyで求める）。
 * - t: 時刻 [s]。
 * - φ (phase): 初期位相 [rad]。t=0, x=0のときの位相のずれ。
 *
 * この式1つだけが「波とは何か」を定義する。粒子の位置も、波形グラフの高さも、
 * すべてこの u(x,t) を呼び出した結果から作る（REQ-105参照）。
 *
 * @param {number} x - 位置 [m]
 * @param {number} t - 時刻 [s]
 * @param {{amplitude: number, wavelength: number, frequency: number, phase: number}} parameters
 *   - amplitude: 振幅 A [m]
 *   - wavelength: 波長 λ [m]
 *   - frequency: 周波数 f [Hz]
 *   - phase: 初期位相 φ [rad]
 * @returns {number} 変位 u [m]
 */
export function calculateDisplacement(x, t, { amplitude, wavelength, frequency, phase }) {
  const waveNumber = calculateWaveNumber(wavelength);
  const angularFrequency = calculateAngularFrequency(frequency);
  return amplitude * Math.sin(waveNumber * x - angularFrequency * t + phase);
}
