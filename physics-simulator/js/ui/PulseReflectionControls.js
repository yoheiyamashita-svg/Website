// 横波の反射（パルス）モードのパラメータ操作UI（js/ui/TransverseWaveControls.jsの姉妹版）。
//
// 縦波・横波（定常波）と同じ設計：スライダー/ラジオボタンはPulseReflectionStateの
// フィールドを書き換えるだけで、Physics Layer（js/physics/wave/PulseWave.js）の
// 計算関数を直接呼ぶことはしない。パラメータを書き換えた後にupdatePointsを呼んで
// 再計算させる、という間接的な流れ（原則2「UIから物理モデルを直接操作しない」）を徹底する。
import { createSlider } from "./Slider.js";
import {
  rebuildPulseReflectionPoints,
  resetPulseReflection,
} from "../simulation/PulseReflectionState.js";
import { updatePoints } from "../simulation/PulseReflectionSimulation.js";
import {
  AMPLITUDE_MAX,
  AMPLITUDE_MIN,
  AMPLITUDE_STEP,
  END_TYPE_FIXED,
  END_TYPE_FREE,
  OPACITY_MAX,
  OPACITY_MIN,
  OPACITY_STEP,
  PLAYBACK_SPEEDS,
  PULSE_SHAPE_BUMP,
  PULSE_SHAPE_S,
  PULSE_WAVE_SPEED_MAX,
  PULSE_WAVE_SPEED_MIN,
  PULSE_WAVE_SPEED_STEP,
  PULSE_WIDTH_MAX,
  PULSE_WIDTH_MIN,
  PULSE_WIDTH_STEP,
  STEP_FRAME_DELTA_TIME,
  TRANSVERSE_MEDIUM_LENGTH_MAX,
  TRANSVERSE_MEDIUM_LENGTH_MIN,
  TRANSVERSE_MEDIUM_LENGTH_STEP,
} from "../utils/constants.js";

/**
 * 横波の反射（パルス）モードのパラメータ操作UIを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - pulseReflectionStateを持つAppState
 * @returns {{element: HTMLElement, setEnabled: (enabled:boolean)=>void}}
 */
export function createPulseReflectionControls({ appState }) {
  const { pulseReflectionState } = appState;
  const wrapper = document.createElement("div");
  wrapper.className = "parameter-controls";

  const amplitudeSlider = createSlider({
    label: "振幅 A",
    min: AMPLITUDE_MIN,
    max: AMPLITUDE_MAX,
    step: AMPLITUDE_STEP,
    value: pulseReflectionState.amplitude,
    unit: "m",
    onInput: (value) => {
      pulseReflectionState.amplitude = value;
      updatePoints(pulseReflectionState);
    },
  });

  const pulseWidthSlider = createSlider({
    label: "パルス幅 w",
    min: PULSE_WIDTH_MIN,
    max: PULSE_WIDTH_MAX,
    step: PULSE_WIDTH_STEP,
    value: pulseReflectionState.pulseWidth,
    unit: "m",
    onInput: (value) => {
      pulseReflectionState.pulseWidth = value;
      updatePoints(pulseReflectionState);
    },
  });

  const waveSpeedSlider = createSlider({
    label: "パルスの速さ v",
    min: PULSE_WAVE_SPEED_MIN,
    max: PULSE_WAVE_SPEED_MAX,
    step: PULSE_WAVE_SPEED_STEP,
    value: pulseReflectionState.waveSpeed,
    unit: "m/s",
    decimals: 1,
    onInput: (value) => {
      pulseReflectionState.waveSpeed = value;
      updatePoints(pulseReflectionState);
    },
  });

  // 媒質（弦）の長さL。変えると反射が起きる位置(x=L)自体が変わるため、
  // 点の配置(points)をrebuildPulseReflectionPointsで作り直す必要がある
  // （js/ui/TransverseWaveControls.jsのmediumLengthSliderと同じ考え方）。
  const mediumLengthSlider = createSlider({
    label: "媒質の長さ L",
    min: TRANSVERSE_MEDIUM_LENGTH_MIN,
    max: TRANSVERSE_MEDIUM_LENGTH_MAX,
    step: TRANSVERSE_MEDIUM_LENGTH_STEP,
    value: pulseReflectionState.mediumLength,
    unit: "m",
    onInput: (value) => {
      pulseReflectionState.mediumLength = value;
      rebuildPulseReflectionPoints(pulseReflectionState);
      updatePoints(pulseReflectionState);
    },
  });

  // 左端(x=0)は振動源であり境界条件を持たないため選択肢を作らない
  // （js/ui/TransverseWaveControls.jsと同じ設計）。
  const sourceEndLabel = document.createElement("div");
  sourceEndLabel.className = "air-column-source-label";
  sourceEndLabel.textContent = "左端（振動源）：境界条件なし";

  const endTypeFieldset = document.createElement("fieldset");
  endTypeFieldset.className = "air-column-boundary-fieldset";
  const endTypeLegend = document.createElement("legend");
  endTypeLegend.textContent = "右端（x = L）";
  endTypeFieldset.appendChild(endTypeLegend);

  [
    { value: END_TYPE_FIXED, label: "固定端" },
    { value: END_TYPE_FREE, label: "自由端" },
  ].forEach(({ value, label }) => {
    const optionLabel = document.createElement("label");
    optionLabel.className = "air-column-boundary-option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "pulse-reflection-end-type";
    radio.value = value;
    radio.checked = pulseReflectionState.endType === value;
    radio.addEventListener("change", () => {
      if (!radio.checked) {
        return;
      }
      pulseReflectionState.endType = value;
      updatePoints(pulseReflectionState);
    });
    optionLabel.appendChild(radio);
    optionLabel.appendChild(document.createTextNode(label));
    endTypeFieldset.appendChild(optionLabel);
  });

  // パルスの形（単一の山 / S字型）。ユーザー確認済み：どちらも選択できるようにする。
  const shapeFieldset = document.createElement("fieldset");
  shapeFieldset.className = "air-column-boundary-fieldset";
  const shapeLegend = document.createElement("legend");
  shapeLegend.textContent = "パルスの形";
  shapeFieldset.appendChild(shapeLegend);

  [
    { value: PULSE_SHAPE_BUMP, label: "単一の山" },
    { value: PULSE_SHAPE_S, label: "S字型" },
  ].forEach(({ value, label }) => {
    const optionLabel = document.createElement("label");
    optionLabel.className = "air-column-boundary-option";
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "pulse-reflection-shape";
    radio.value = value;
    radio.checked = pulseReflectionState.shape === value;
    radio.addEventListener("change", () => {
      if (!radio.checked) {
        return;
      }
      pulseReflectionState.shape = value;
      updatePoints(pulseReflectionState);
    });
    optionLabel.appendChild(radio);
    optionLabel.appendChild(document.createTextNode(label));
    shapeFieldset.appendChild(optionLabel);
  });

  // 入射波・反射波・合成波の3本を、それぞれ独立した不透明度[%]で表示できるようにする
  // （js/ui/TransverseWaveControls.jsのcreateOpacitySliderと同じ考え方）。
  function createOpacitySlider(label, initialValue, onChange) {
    return createSlider({
      label,
      min: OPACITY_MIN,
      max: OPACITY_MAX,
      step: OPACITY_STEP,
      value: initialValue,
      unit: "%",
      decimals: 0,
      onInput: (value) => {
        onChange(Math.round(value));
      },
    });
  }

  const incidentOpacitySlider = createOpacitySlider(
    "入射波の透明度",
    pulseReflectionState.incidentOpacity,
    (value) => {
      pulseReflectionState.incidentOpacity = value;
    }
  );
  const reflectedOpacitySlider = createOpacitySlider(
    "反射波の透明度",
    pulseReflectionState.reflectedOpacity,
    (value) => {
      pulseReflectionState.reflectedOpacity = value;
    }
  );
  const combinedOpacitySlider = createOpacitySlider(
    "合成波の透明度",
    pulseReflectionState.combinedOpacity,
    (value) => {
      pulseReflectionState.combinedOpacity = value;
    }
  );

  wrapper.appendChild(sourceEndLabel);
  wrapper.appendChild(endTypeFieldset);
  wrapper.appendChild(shapeFieldset);
  wrapper.appendChild(amplitudeSlider.element);
  wrapper.appendChild(pulseWidthSlider.element);
  wrapper.appendChild(waveSpeedSlider.element);
  wrapper.appendChild(mediumLengthSlider.element);
  wrapper.appendChild(incidentOpacitySlider.element);
  wrapper.appendChild(reflectedOpacitySlider.element);
  wrapper.appendChild(combinedOpacitySlider.element);

  return {
    element: wrapper,
    setEnabled(enabled) {
      wrapper.querySelectorAll("input").forEach((input) => {
        input.disabled = !enabled;
      });
    },
  };
}

/**
 * 横波の反射（パルス）モードの再生・一時停止・パルスを送る・コマ送り・
 * 再生速度変更のボタン群を作る（js/ui/TransverseWaveControls.jsの
 * createTransverseWavePlaybackControlsとほぼ同一。リセットボタンが
 * 「パルスを送る」という名前・役割になっている点だけが異なる：既定で
 * 自動ループ再生されるため、このボタンは主に「今すぐ新しいパルスを見たい」
 * ときに使う、時刻0への手動リセットである）。
 *
 * @param {Object} params
 * @param {Object} params.appState - isPlaying / playbackSpeed / pulseReflectionState を持つAppState
 * @returns {{element: HTMLElement, setEnabled: (enabled:boolean)=>void}}
 */
export function createPulseReflectionPlaybackControls({ appState }) {
  const wrapper = document.createElement("div");
  wrapper.className = "playback-controls";

  const playPauseButton = document.createElement("button");
  playPauseButton.type = "button";

  function refreshPlayPauseLabel() {
    playPauseButton.textContent = appState.isPlaying ? "⏸ 一時停止" : "▶ 再生";
  }

  playPauseButton.addEventListener("click", () => {
    appState.isPlaying = !appState.isPlaying;
    refreshPlayPauseLabel();
  });

  const sendPulseButton = document.createElement("button");
  sendPulseButton.type = "button";
  sendPulseButton.textContent = "↻ パルスを送る";
  sendPulseButton.addEventListener("click", () => {
    resetPulseReflection(appState.pulseReflectionState);
    updatePoints(appState.pulseReflectionState);
  });

  const stepButton = document.createElement("button");
  stepButton.type = "button";
  stepButton.textContent = "⏭ コマ送り";
  stepButton.addEventListener("click", () => {
    appState.isPlaying = false;
    refreshPlayPauseLabel();
    appState.pulseReflectionState.time += STEP_FRAME_DELTA_TIME;
    updatePoints(appState.pulseReflectionState);
  });

  const speedSelect = document.createElement("select");
  PLAYBACK_SPEEDS.forEach((speed) => {
    const option = document.createElement("option");
    option.value = String(speed);
    option.textContent = `${speed}x`;
    option.selected = speed === appState.playbackSpeed;
    speedSelect.appendChild(option);
  });
  speedSelect.addEventListener("change", () => {
    appState.playbackSpeed = Number(speedSelect.value);
  });

  refreshPlayPauseLabel();

  wrapper.appendChild(playPauseButton);
  wrapper.appendChild(stepButton);
  wrapper.appendChild(sendPulseButton);
  wrapper.appendChild(speedSelect);

  return {
    element: wrapper,
    setEnabled(enabled) {
      wrapper.querySelectorAll("button, select").forEach((control) => {
        control.disabled = !enabled;
      });
    },
  };
}
