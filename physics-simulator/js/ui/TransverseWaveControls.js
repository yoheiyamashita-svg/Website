// 横波（定常波）モードのパラメータ操作UI（js/ui/Controls.jsの横波版）。
//
// 縦波のControls.jsと全く同じ設計方針：スライダー/ラジオボタンはTransverseWaveStateの
// フィールドを書き換えるだけで、Physics Layer（TravelingWave.js・TransverseStandingWave.js）の
// 計算関数を直接呼ぶことはしない。パラメータを書き換えた後にupdatePointsを呼んで
// 再計算させる、という間接的な流れ（原則2「UIから物理モデルを直接操作しない」）を徹底する。
//
// 指示書「波のv,f,λの設定方法は縦波（進行波）と同様」に従い、v固定トグルの実装は
// js/ui/Controls.jsのcreateParameterControlsとほぼ同一（対象がsimulationStateではなく
// transverseWaveStateである点だけが異なる）。
import { createSlider } from "./Slider.js";
import {
  calculateFrequencyFromWaveSpeed,
  calculateWavelengthFromWaveSpeed,
  calculateWaveSpeed,
} from "../physics/wave/TravelingWave.js";
import { rebuildTransverseWavePoints, resetTransverseWave } from "../simulation/TransverseWaveState.js";
import { updatePoints } from "../simulation/TransverseWaveSimulation.js";
import {
  AMPLITUDE_MAX,
  AMPLITUDE_MIN,
  AMPLITUDE_STEP,
  END_TYPE_FIXED,
  END_TYPE_FREE,
  FREQUENCY_MAX,
  FREQUENCY_MIN,
  FREQUENCY_STEP,
  OPACITY_MAX,
  OPACITY_MIN,
  OPACITY_STEP,
  PLAYBACK_SPEEDS,
  SOUND_SPEED_MAX,
  SOUND_SPEED_MIN,
  SOUND_SPEED_STEP,
  STEP_FRAME_DELTA_TIME,
  TRANSVERSE_MEDIUM_LENGTH_MAX,
  TRANSVERSE_MEDIUM_LENGTH_MIN,
  TRANSVERSE_MEDIUM_LENGTH_STEP,
  WAVELENGTH_MAX,
  WAVELENGTH_MIN,
  WAVELENGTH_STEP,
} from "../utils/constants.js";

/**
 * 横波（定常波）モードのパラメータ操作UIを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - transverseWaveStateを持つAppState
 * @returns {{element: HTMLElement, setEnabled: (enabled:boolean)=>void}}
 */
export function createTransverseWaveControls({ appState }) {
  const { transverseWaveState } = appState;
  const wrapper = document.createElement("div");
  wrapper.className = "parameter-controls";

  const waveSpeedDisplay = document.createElement("div");
  waveSpeedDisplay.className = "wave-speed-display";

  const waveSpeedFixedLabel = document.createElement("label");
  waveSpeedFixedLabel.className = "wave-speed-fixed-toggle";
  const waveSpeedFixedCheckbox = document.createElement("input");
  waveSpeedFixedCheckbox.type = "checkbox";
  waveSpeedFixedCheckbox.checked = transverseWaveState.waveSpeedFixed;
  waveSpeedFixedLabel.appendChild(waveSpeedFixedCheckbox);
  waveSpeedFixedLabel.appendChild(document.createTextNode(" 波速 v を固定する"));

  let fixedWaveSpeedSlider = null;

  function refreshDerivedValues() {
    if (transverseWaveState.waveSpeedFixed) {
      waveSpeedDisplay.textContent = `波の速さ v = ${transverseWaveState.fixedWaveSpeed.toFixed(1)} m/s（固定値・ユーザー操作値）`;
    } else {
      const waveSpeed = calculateWaveSpeed(transverseWaveState.frequency, transverseWaveState.wavelength);
      waveSpeedDisplay.textContent = `波の速さ v = fλ = ${waveSpeed.toFixed(2)} m/s（f, λから自動計算・直接操作不可）`;
    }
  }

  const amplitudeSlider = createSlider({
    label: "振幅 A",
    min: AMPLITUDE_MIN,
    max: AMPLITUDE_MAX,
    step: AMPLITUDE_STEP,
    value: transverseWaveState.amplitude,
    unit: "m",
    onInput: (value) => {
      transverseWaveState.amplitude = value;
      updatePoints(transverseWaveState);
    },
  });

  const wavelengthSlider = createSlider({
    label: "波長 λ",
    min: WAVELENGTH_MIN,
    max: WAVELENGTH_MAX,
    step: WAVELENGTH_STEP,
    value: transverseWaveState.wavelength,
    unit: "m",
    onInput: (value) => {
      transverseWaveState.wavelength = value;
      if (transverseWaveState.waveSpeedFixed) {
        transverseWaveState.frequency = calculateFrequencyFromWaveSpeed(
          transverseWaveState.fixedWaveSpeed,
          value
        );
        frequencySlider.setValue(transverseWaveState.frequency);
      }
      updatePoints(transverseWaveState);
      refreshDerivedValues();
    },
  });

  const frequencySlider = createSlider({
    label: "周波数 f",
    min: FREQUENCY_MIN,
    max: FREQUENCY_MAX,
    step: FREQUENCY_STEP,
    value: transverseWaveState.frequency,
    unit: "Hz",
    onInput: (value) => {
      transverseWaveState.frequency = value;
      if (transverseWaveState.waveSpeedFixed) {
        transverseWaveState.wavelength = calculateWavelengthFromWaveSpeed(
          transverseWaveState.fixedWaveSpeed,
          value
        );
        wavelengthSlider.setValue(transverseWaveState.wavelength);
      }
      updatePoints(transverseWaveState);
      refreshDerivedValues();
    },
  });

  fixedWaveSpeedSlider = createSlider({
    label: "固定波速 v",
    min: SOUND_SPEED_MIN,
    max: SOUND_SPEED_MAX,
    step: SOUND_SPEED_STEP,
    value: transverseWaveState.fixedWaveSpeed,
    unit: "m/s",
    decimals: 1,
    onInput: (value) => {
      transverseWaveState.fixedWaveSpeed = value;
      transverseWaveState.frequency = calculateFrequencyFromWaveSpeed(value, transverseWaveState.wavelength);
      frequencySlider.setValue(transverseWaveState.frequency);
      updatePoints(transverseWaveState);
      refreshDerivedValues();
    },
  });
  fixedWaveSpeedSlider.element.style.display = transverseWaveState.waveSpeedFixed ? "" : "none";

  waveSpeedFixedCheckbox.addEventListener("change", () => {
    transverseWaveState.waveSpeedFixed = waveSpeedFixedCheckbox.checked;
    if (transverseWaveState.waveSpeedFixed) {
      transverseWaveState.fixedWaveSpeed = calculateWaveSpeed(
        transverseWaveState.frequency,
        transverseWaveState.wavelength
      );
      fixedWaveSpeedSlider.setValue(transverseWaveState.fixedWaveSpeed);
    }
    fixedWaveSpeedSlider.element.style.display = transverseWaveState.waveSpeedFixed ? "" : "none";
    refreshDerivedValues();
  });

  // 媒質（弦）の長さL。変えると反射が起きる位置(x=L)自体が変わるため、
  // 点の配置(points)をrebuildTransverseWavePointsで作り直す必要がある
  // （js/ui/acoustic/AirColumnControls.jsのtubeLengthSliderと同じ考え方）。
  const mediumLengthSlider = createSlider({
    label: "媒質の長さ L",
    min: TRANSVERSE_MEDIUM_LENGTH_MIN,
    max: TRANSVERSE_MEDIUM_LENGTH_MAX,
    step: TRANSVERSE_MEDIUM_LENGTH_STEP,
    value: transverseWaveState.mediumLength,
    unit: "m",
    onInput: (value) => {
      transverseWaveState.mediumLength = value;
      rebuildTransverseWavePoints(transverseWaveState);
      updatePoints(transverseWaveState);
    },
  });

  // 両端(x=0・x=L)とも、固定端/自由端をラジオボタンで選べる
  // （以前は左端を「振動源」として境界条件を持たない特別な点にしていたが、
  // ユーザー要望により両端とも対等に選択可能にした）。同じ構造を2箇所で使うため、
  // 共通のヘルパー関数にまとめる（js/ui/acoustic/AirColumnControls.jsの
  // createEndTypeFieldsetと同じパターン）。
  //
  // @param {string} legendText - fieldsetの見出し（「左端」または「右端」）
  // @param {string} currentValue - 現在の値（transverseWaveState.leftEndType/rightEndType）
  // @param {string} radioGroupName - ラジオボタンのname属性（左端・右端で別グループにする）
  // @param {(value:string)=>void} onChange - 選択が変わったときに呼ばれる
  function createEndTypeFieldset(legendText, currentValue, radioGroupName, onChange) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "air-column-boundary-fieldset";
    const legend = document.createElement("legend");
    legend.textContent = legendText;
    fieldset.appendChild(legend);

    [
      { value: END_TYPE_FIXED, label: "固定端" },
      { value: END_TYPE_FREE, label: "自由端" },
    ].forEach(({ value, label }) => {
      const optionLabel = document.createElement("label");
      optionLabel.className = "air-column-boundary-option";
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = radioGroupName;
      radio.value = value;
      radio.checked = currentValue === value;
      radio.addEventListener("change", () => {
        if (!radio.checked) {
          return;
        }
        onChange(value);
      });
      optionLabel.appendChild(radio);
      optionLabel.appendChild(document.createTextNode(label));
      fieldset.appendChild(optionLabel);
    });

    return fieldset;
  }

  const leftEndFieldset = createEndTypeFieldset(
    "左端（x = 0）",
    transverseWaveState.leftEndType,
    "transverse-wave-left-end-type",
    (value) => {
      transverseWaveState.leftEndType = value;
      updatePoints(transverseWaveState);
    }
  );

  const farEndFieldset = createEndTypeFieldset(
    "右端（x = L）",
    transverseWaveState.rightEndType,
    "transverse-wave-right-end-type",
    (value) => {
      transverseWaveState.rightEndType = value;
      updatePoints(transverseWaveState);
    }
  );

  // 右向き波(入射波)・左向き波(反射波)・合成波の3本を、それぞれ独立した不透明度[%]で
  // 表示できるようにするスライダー。Rendererにはstate.incidentOpacity等をそのまま渡すだけで、
  // 描画の重ね合わせ処理自体はTransverseWaveRenderer.js側が行う。
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
    "右向き波の透明度",
    transverseWaveState.incidentOpacity,
    (value) => {
      transverseWaveState.incidentOpacity = value;
    }
  );
  const reflectedOpacitySlider = createOpacitySlider(
    "左向き波の透明度",
    transverseWaveState.reflectedOpacity,
    (value) => {
      transverseWaveState.reflectedOpacity = value;
    }
  );
  const combinedOpacitySlider = createOpacitySlider(
    "合成波の透明度",
    transverseWaveState.combinedOpacity,
    (value) => {
      transverseWaveState.combinedOpacity = value;
    }
  );

  refreshDerivedValues();

  wrapper.appendChild(leftEndFieldset);
  wrapper.appendChild(farEndFieldset);
  wrapper.appendChild(amplitudeSlider.element);
  wrapper.appendChild(wavelengthSlider.element);
  wrapper.appendChild(frequencySlider.element);
  wrapper.appendChild(waveSpeedFixedLabel);
  wrapper.appendChild(fixedWaveSpeedSlider.element);
  wrapper.appendChild(waveSpeedDisplay);
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
 * 横波（定常波）モードの再生・一時停止・リセット・コマ送り・再生速度変更のボタン群を作る
 * （js/ui/Controls.jsのcreatePlaybackControlsとほぼ同一。対象がsimulationStateではなく
 * transverseWaveStateであり、呼び出す関数がresetTransverseWave/updatePointsになる点だけが異なる）。
 *
 * @param {Object} params
 * @param {Object} params.appState - isPlaying / playbackSpeed / transverseWaveState を持つAppState
 * @returns {{element: HTMLElement, setEnabled: (enabled:boolean)=>void}}
 */
export function createTransverseWavePlaybackControls({ appState }) {
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

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.textContent = "↻ リセット";
  resetButton.addEventListener("click", () => {
    resetTransverseWave(appState.transverseWaveState);
    updatePoints(appState.transverseWaveState);
  });

  const stepButton = document.createElement("button");
  stepButton.type = "button";
  stepButton.textContent = "⏭ コマ送り";
  stepButton.addEventListener("click", () => {
    appState.isPlaying = false;
    refreshPlayPauseLabel();
    appState.transverseWaveState.time += STEP_FRAME_DELTA_TIME;
    updatePoints(appState.transverseWaveState);
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
  wrapper.appendChild(resetButton);
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
