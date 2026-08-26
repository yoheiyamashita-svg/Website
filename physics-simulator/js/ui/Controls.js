// REQ-201〜203・再生制御：パラメータスライダー、波速の読み取り専用表示、
// 再生系ボタン（再生/一時停止/リセット/コマ送り/速度変更）を組み立てる。
//
// このモジュールは「Slider → SimulationStateへの書き込み → updateParticlesの呼び出し」
// という一方向の流れだけを行い、変位や粒子速度の物理式そのものはここに書かない
// （architecture.md §15、原則2「UIから物理モデルを直接操作しない」の実践：
// UIはSimulationStateという“データ”を書き換えるだけで、Physics Engineの計算関数を
// 直接呼び出したりはしていない）。
import { createSlider } from "./Slider.js";
import {
  calculateFrequencyFromWaveSpeed,
  calculateWavelengthFromWaveSpeed,
  calculateWaveSpeed,
} from "../physics/wave/TravelingWave.js";
import { resizeParticles, resetSimulationParticles } from "../simulation/SimulationState.js";
import { updateParticles } from "../simulation/Simulation.js";
import {
  AMPLITUDE_MAX,
  AMPLITUDE_MIN,
  AMPLITUDE_STEP,
  FREQUENCY_MAX,
  FREQUENCY_MIN,
  FREQUENCY_STEP,
  PARTICLE_COUNT_MAX,
  PARTICLE_COUNT_MIN,
  PARTICLE_COUNT_STEP,
  PLAYBACK_SPEEDS,
  SOUND_SPEED_MAX,
  SOUND_SPEED_MIN,
  SOUND_SPEED_STEP,
  STEP_FRAME_DELTA_TIME,
  WAVELENGTH_MAX,
  WAVELENGTH_MIN,
  WAVELENGTH_STEP,
} from "../utils/constants.js";

/**
 * 振幅・波長・周波数・粒子数のスライダーと、波の速さvの表示（固定/自動）を作る。
 *
 * 物理量の整合性（REQ-203, physics.md §11、指示書§7-8「v固定」機能）：
 *   v = fλ
 * この関係を常に成立させるため、A・λ・f・vの4つを独立に操作できるようにはしない。
 *
 * - waveSpeedFixed = false（デフォルト）：λ・fがユーザー操作値、v=fλは表示のみ（従来どおり）。
 * - waveSpeedFixed = true：vがユーザー操作値（固定波速）。λを動かすとf=v/λが自動追従し、
 *   fを動かすとλ=v/fが自動追従する。「どちらを動かしても、もう片方が連動する」UIにすることで、
 *   例えば音速一定の音波で管の長さ(≒λ)を変えたときに振動数がどう変わるか、を直感的に扱える。
 *
 * @param {Object} params
 * @param {Object} params.appState - simulationStateを持つAppState
 * @returns {{element: HTMLElement, setEnabled: (enabled:boolean)=>void}}
 */
export function createParameterControls({ appState }) {
  const { simulationState } = appState;
  const wrapper = document.createElement("div");
  wrapper.className = "parameter-controls";

  const waveSpeedDisplay = document.createElement("div");
  waveSpeedDisplay.className = "wave-speed-display";

  // v固定チェックボックス。JavaScript構文メモ：<input type="checkbox">のchangeイベントは
  // チェック状態が切り替わった瞬間に発火し、input.checkedで現在のON/OFFを取得できる。
  const waveSpeedFixedLabel = document.createElement("label");
  waveSpeedFixedLabel.className = "wave-speed-fixed-toggle";
  const waveSpeedFixedCheckbox = document.createElement("input");
  waveSpeedFixedCheckbox.type = "checkbox";
  waveSpeedFixedCheckbox.checked = simulationState.waveSpeedFixed;
  waveSpeedFixedLabel.appendChild(waveSpeedFixedCheckbox);
  waveSpeedFixedLabel.appendChild(document.createTextNode(" 波速 v を固定する"));

  let fixedWaveSpeedSlider = null;

  function refreshDerivedValues() {
    if (simulationState.waveSpeedFixed) {
      waveSpeedDisplay.textContent = `波の速さ v = ${simulationState.fixedWaveSpeed.toFixed(1)} m/s（固定値・ユーザー操作値）`;
    } else {
      // 波長・周波数が変わるたびに、v = fλ を計算し直して表示を更新する。
      // ここではPhysics Layerの関数(calculateWaveSpeed)を「呼び出す」だけで、
      // 計算式そのものはTravelingWave.js側にコメント付きで定義されている。
      const waveSpeed = calculateWaveSpeed(simulationState.frequency, simulationState.wavelength);
      waveSpeedDisplay.textContent = `波の速さ v = fλ = ${waveSpeed.toFixed(2)} m/s（f, λから自動計算・直接操作不可）`;
    }
  }

  const amplitudeSlider = createSlider({
    label: "振幅 A",
    min: AMPLITUDE_MIN,
    max: AMPLITUDE_MAX,
    step: AMPLITUDE_STEP,
    value: simulationState.amplitude,
    unit: "m",
    onInput: (value) => {
      // スライダーの値をSimulationStateのamplitude[m]に書き込む。
      // Physics Engineの式を直接呼ぶのではなく、「パラメータを書き換えて、
      // updateParticlesに再計算させる」という間接的な流れにすることで、
      // 「UIから物理モデルを直接操作しない」という原則2を保っている。
      simulationState.amplitude = value;
      updateParticles(simulationState);
    },
  });

  const wavelengthSlider = createSlider({
    label: "波長 λ",
    min: WAVELENGTH_MIN,
    max: WAVELENGTH_MAX,
    step: WAVELENGTH_STEP,
    value: simulationState.wavelength,
    unit: "m",
    onInput: (value) => {
      simulationState.wavelength = value;
      if (simulationState.waveSpeedFixed) {
        // v = fλ を一定(fixedWaveSpeed)に保つため、f = v/λ として周波数を自動追従させる。
        simulationState.frequency = calculateFrequencyFromWaveSpeed(
          simulationState.fixedWaveSpeed,
          value
        );
        frequencySlider.setValue(simulationState.frequency);
      }
      updateParticles(simulationState);
      refreshDerivedValues();
    },
  });

  const frequencySlider = createSlider({
    label: "周波数 f",
    min: FREQUENCY_MIN,
    max: FREQUENCY_MAX,
    step: FREQUENCY_STEP,
    value: simulationState.frequency,
    unit: "Hz",
    onInput: (value) => {
      simulationState.frequency = value;
      if (simulationState.waveSpeedFixed) {
        // v = fλ を一定(fixedWaveSpeed)に保つため、λ = v/f として波長を自動追従させる。
        simulationState.wavelength = calculateWavelengthFromWaveSpeed(
          simulationState.fixedWaveSpeed,
          value
        );
        wavelengthSlider.setValue(simulationState.wavelength);
      }
      updateParticles(simulationState);
      refreshDerivedValues();
    },
  });

  fixedWaveSpeedSlider = createSlider({
    label: "固定波速 v",
    min: SOUND_SPEED_MIN,
    max: SOUND_SPEED_MAX,
    step: SOUND_SPEED_STEP,
    value: simulationState.fixedWaveSpeed,
    unit: "m/s",
    decimals: 1,
    onInput: (value) => {
      simulationState.fixedWaveSpeed = value;
      // vを変えたときは波長λを基準として保ち、周波数fの方を f = v/λ で追従させる
      // （λ・fのどちらを基準にするかは実装上の選択だが、他のλ操作時の追従方向と揃えるため
      // 「λが変わらない側」に統一している）。
      simulationState.frequency = calculateFrequencyFromWaveSpeed(value, simulationState.wavelength);
      frequencySlider.setValue(simulationState.frequency);
      updateParticles(simulationState);
      refreshDerivedValues();
    },
  });
  fixedWaveSpeedSlider.element.style.display = simulationState.waveSpeedFixed ? "" : "none";

  waveSpeedFixedCheckbox.addEventListener("change", () => {
    simulationState.waveSpeedFixed = waveSpeedFixedCheckbox.checked;
    if (simulationState.waveSpeedFixed) {
      // ONにした瞬間の見た目が飛ばないよう、今のλ・fから逆算したvをそのまま固定値として採用する
      // （v = fλ をONにした瞬間だけ計算し、以後はこのvを保つ）。
      simulationState.fixedWaveSpeed = calculateWaveSpeed(
        simulationState.frequency,
        simulationState.wavelength
      );
      fixedWaveSpeedSlider.setValue(simulationState.fixedWaveSpeed);
    }
    fixedWaveSpeedSlider.element.style.display = simulationState.waveSpeedFixed ? "" : "none";
    refreshDerivedValues();
  });

  const particleCountSlider = createSlider({
    label: "粒子数",
    min: PARTICLE_COUNT_MIN,
    max: PARTICLE_COUNT_MAX,
    step: PARTICLE_COUNT_STEP,
    value: simulationState.particles.length,
    unit: "個",
    decimals: 0,
    onInput: (value) => {
      // 指示書§9-2：粒子数変更はtime・モード等に副作用を与えない。
      // resizeParticles自体はtimeに触れない設計になっており、
      // その直後にupdateParticlesを呼んで「現在の時刻における」正しい変位を反映する。
      resizeParticles(simulationState, Math.round(value));
      updateParticles(simulationState);
    },
  });

  refreshDerivedValues();

  wrapper.appendChild(amplitudeSlider.element);
  wrapper.appendChild(wavelengthSlider.element);
  wrapper.appendChild(frequencySlider.element);
  wrapper.appendChild(waveSpeedFixedLabel);
  wrapper.appendChild(fixedWaveSpeedSlider.element);
  wrapper.appendChild(waveSpeedDisplay);
  wrapper.appendChild(particleCountSlider.element);

  return {
    element: wrapper,
    // 学習モード（REQ-301/302）が「予想を答えるまで操作させない」ために使う。
    // querySelectorAllで配下のすべての<input>を取得し、disabledプロパティを
    // 一括で切り替える（disabled=trueのinput[type=range]はドラッグ操作を受け付けなくなる）。
    setEnabled(enabled) {
      wrapper.querySelectorAll("input").forEach((input) => {
        input.disabled = !enabled;
      });
    },
  };
}

/**
 * 再生・一時停止・リセット・コマ送り・再生速度変更のボタン群を作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - isPlaying / playbackSpeed / simulationState を持つAppState
 * @returns {{element: HTMLElement}}
 */
export function createPlaybackControls({ appState }) {
  const wrapper = document.createElement("div");
  wrapper.className = "playback-controls";

  const playPauseButton = document.createElement("button");
  playPauseButton.type = "button";

  function refreshPlayPauseLabel() {
    playPauseButton.textContent = appState.isPlaying ? "⏸ 一時停止" : "▶ 再生";
  }

  playPauseButton.addEventListener("click", () => {
    // isPlayingを反転させるだけ。実際に時刻を進める処理(advanceSimulationTime)は
    // main.jsのアニメーションループ側で、isPlayingを見て判断する。
    appState.isPlaying = !appState.isPlaying;
    refreshPlayPauseLabel();
  });

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "↻ リセット";
  resetButton.addEventListener("click", () => {
    // 時刻を0に戻し粒子を初期配置に作り直した直後、updateParticlesを呼んで
    // t=0時点の正しいdisplacement/position/velocityを反映させる。
    // これを呼ばないと、次に再生を再開するまで古い変位が画面に残ってしまう。
    resetSimulationParticles(appState.simulationState);
    updateParticles(appState.simulationState);
  });

  const stepButton = document.createElement("button");
  stepButton.type = "button";
  stepButton.textContent = "⏭ コマ送り";
  stepButton.addEventListener("click", () => {
    // コマ送りは「一時停止した状態で1フレーム分だけ時間を進める」操作のため、
    // まず確実に一時停止させてから、STEP_FRAME_DELTA_TIME(1/60秒)だけ時刻を進める。
    appState.isPlaying = false;
    refreshPlayPauseLabel();
    appState.simulationState.time += STEP_FRAME_DELTA_TIME;
    updateParticles(appState.simulationState);
  });

  // <select>はプルダウン(ドロップダウン)メニューを作るHTML要素。
  // <option>を子要素として複数追加すると、その中から1つを選べるUIになる。
  const speedSelect = document.createElement("select");
  PLAYBACK_SPEEDS.forEach((speed) => {
    const option = document.createElement("option");
    option.value = String(speed);
    option.textContent = `${speed}x`;
    option.selected = speed === appState.playbackSpeed;
    speedSelect.appendChild(option);
  });
  // "change"イベントは、プルダウンの選択肢が確定した瞬間に発火する
  // （"input"と違い、選んでいる最中には発火しない）。
  speedSelect.addEventListener("change", () => {
    appState.playbackSpeed = Number(speedSelect.value);
  });

  refreshPlayPauseLabel();

  wrapper.appendChild(playPauseButton);
  wrapper.appendChild(stepButton);
  wrapper.appendChild(resetButton);
  wrapper.appendChild(speedSelect);

  return {
    element: wrapper,
    // 学習モードが「予想を答えるまで再生操作させない」ために使う（parameter-controlsの
    // setEnabledと同じ考え方）。
    setEnabled(enabled) {
      wrapper.querySelectorAll("button, select").forEach((control) => {
        control.disabled = !enabled;
      });
    },
  };
}
