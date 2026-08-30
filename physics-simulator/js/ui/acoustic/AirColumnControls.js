// 気柱振動のパラメータ操作UI（js/ui/Controls.jsの気柱振動版、指示書§16, §30-34, §37）。
//
// 縦波のControls.jsと同じ設計：スライダー/ラジオボタンはAirColumnStateのフィールドを
// 書き換え、Physics Engine（AirColumn.js）の計算関数を直接呼ぶことはしない。
// パラメータを書き換えた後にupdateColumnsを呼んで再計算させる、という間接的な流れ
// （原則2「UIから物理モデルを直接操作しない」）を徹底する。
import { createSlider } from "../Slider.js";
import { calculateEigenfrequency } from "../../physics/acoustic/AirColumn.js";
import {
  rebuildEndExtensions,
  resetAirColumnColumns,
  resizeAirColumnColumns,
} from "../../simulation/AirColumnState.js";
import { updateColumns } from "../../simulation/AirColumnSimulation.js";
import {
  AIR_COLUMN_AMPLITUDE_MAX,
  AIR_COLUMN_AMPLITUDE_MIN,
  AIR_COLUMN_AMPLITUDE_STEP,
  AIR_COLUMN_COLUMN_COUNT_MAX,
  AIR_COLUMN_COLUMN_COUNT_MIN,
  AIR_COLUMN_COLUMN_COUNT_STEP,
  AIR_COLUMN_END_CLOSED,
  AIR_COLUMN_END_OPEN,
  AIR_COLUMN_PLAYBACK_SPEEDS,
  END_CORRECTION_MAX,
  END_CORRECTION_MIN,
  END_CORRECTION_STEP,
  MODE_NUMBER_MAX,
  MODE_NUMBER_MIN,
  SOUND_SPEED_MAX,
  SOUND_SPEED_MIN,
  SOUND_SPEED_STEP,
  STEP_FRAME_DELTA_TIME,
  TUBE_LENGTH_MAX,
  TUBE_LENGTH_MIN,
  TUBE_LENGTH_STEP,
} from "../../utils/constants.js";

/**
 * 気柱振動のパラメータ操作UIを作る。
 *
 * @param {Object} params
 * @param {Object} params.appState - airColumnStateを持つAppState（selectedColumnIndex等）
 * @returns {{element: HTMLElement, setEnabled: (enabled:boolean)=>void}}
 */
export function createAirColumnControls({ appState }) {
  const { airColumnState } = appState;
  const wrapper = document.createElement("div");
  wrapper.className = "parameter-controls";

  const eigenfrequencyDisplay = document.createElement("div");
  eigenfrequencyDisplay.className = "wave-speed-display";

  // 現在のsourceEndType・farEndType・modeNumber・soundSpeed・tubeLengthから
  // 固有振動数f_nを計算して表示する。計算そのものはPhysics Layer
  // （AirColumn.calculateEigenfrequency）に委譲する。
  function refreshEigenfrequencyDisplay() {
    const eigenfrequency = calculateEigenfrequency(
      airColumnState.sourceEndType,
      airColumnState.farEndType,
      airColumnState.modeNumber,
      airColumnState.soundSpeed,
      airColumnState.tubeLength,
      airColumnState.endCorrection
    );
    const endTypeLabel = (endType) => (endType === AIR_COLUMN_END_CLOSED ? "閉口" : "開口");
    const boundaryLabel = `上端：${endTypeLabel(airColumnState.sourceEndType)} / 下端：${endTypeLabel(airColumnState.farEndType)}`;
    eigenfrequencyDisplay.textContent =
      `境界条件：${boundaryLabel} / モード n = ${airColumnState.modeNumber} / ` +
      `固有振動数 f = ${eigenfrequency.toFixed(1)} Hz`;
  }

  const tubeLengthSlider = createSlider({
    label: "気柱長 L",
    min: TUBE_LENGTH_MIN,
    max: TUBE_LENGTH_MAX,
    step: TUBE_LENGTH_STEP,
    value: airColumnState.tubeLength,
    unit: "m",
    onInput: (value) => {
      airColumnState.tubeLength = value;
      // 気柱長が変わると列の間隔(x0の配置)も変わるため、今の列数を保ったまま作り直す
      // （resizeAirColumnColumnsは列数だけを引数に取り、tubeLengthは呼び出し時点の
      // airColumnState.tubeLengthを見るため、直前に更新した新しい長さが使われる）。
      resizeAirColumnColumns(airColumnState, airColumnState.columns.length);
      // 開口端補正の延長区間(x∈[L,L+Δx]等)もtubeLengthに依存するため作り直す。
      rebuildEndExtensions(airColumnState);
      updateColumns(airColumnState);
      refreshEigenfrequencyDisplay();
    },
  });

  // 開口端補正 Δx（指示書追記：ユーザー要望）。Δx=0のときは補正なし＝これまでと
  // 完全に同じ挙動になる（js/physics/acoustic/OpenOpenTube.js等のコメント参照）。
  const endCorrectionSlider = createSlider({
    label: "開口端補正 Δx",
    min: END_CORRECTION_MIN,
    max: END_CORRECTION_MAX,
    step: END_CORRECTION_STEP,
    value: airColumnState.endCorrection,
    unit: "m",
    decimals: 3,
    onInput: (value) => {
      airColumnState.endCorrection = value;
      // 延長区間の長さ(Δx)そのものが変わるため作り直す。
      rebuildEndExtensions(airColumnState);
      updateColumns(airColumnState);
      refreshEigenfrequencyDisplay();
    },
  });

  const soundSpeedSlider = createSlider({
    label: "音速 v",
    min: SOUND_SPEED_MIN,
    max: SOUND_SPEED_MAX,
    step: SOUND_SPEED_STEP,
    value: airColumnState.soundSpeed,
    unit: "m/s",
    decimals: 0,
    onInput: (value) => {
      airColumnState.soundSpeed = value;
      updateColumns(airColumnState);
      refreshEigenfrequencyDisplay();
    },
  });

  const amplitudeSlider = createSlider({
    label: "振幅 A",
    min: AIR_COLUMN_AMPLITUDE_MIN,
    max: AIR_COLUMN_AMPLITUDE_MAX,
    step: AIR_COLUMN_AMPLITUDE_STEP,
    value: airColumnState.amplitude,
    unit: "m",
    onInput: (value) => {
      airColumnState.amplitude = value;
      updateColumns(airColumnState);
    },
  });

  const modeNumberSlider = createSlider({
    label: "振動モード n",
    min: MODE_NUMBER_MIN,
    max: MODE_NUMBER_MAX,
    step: 1,
    value: airColumnState.modeNumber,
    unit: "",
    decimals: 0,
    onInput: (value) => {
      airColumnState.modeNumber = Math.round(value);
      updateColumns(airColumnState);
      refreshEigenfrequencyDisplay();
    },
  });

  const columnCountSlider = createSlider({
    label: "列数（粒子の細かさ）",
    min: AIR_COLUMN_COLUMN_COUNT_MIN,
    max: AIR_COLUMN_COLUMN_COUNT_MAX,
    step: AIR_COLUMN_COLUMN_COUNT_STEP,
    value: airColumnState.columns.length,
    unit: "列",
    decimals: 0,
    onInput: (value) => {
      // 指示書§9-2/§37-38の考え方：列数変更はtime等に副作用を与えない。
      resizeAirColumnColumns(airColumnState, Math.round(value));
      updateColumns(airColumnState);
    },
  });

  // 上端(x=0)・下端(x=L)とも、開口/閉口をラジオボタンで選べる
  // （以前は上端＝音源側が常に開口の絶対条件だったが、ユーザー要望により両端とも
  // 選択可能にした）。同じ構造を2箇所で使うため、共通のヘルパー関数にまとめる。
  //
  // @param {string} legendText - fieldsetの見出し（「上端」または「下端」）
  // @param {string} currentValue - 現在の値（airColumnState.sourceEndType/farEndType）
  // @param {string} radioGroupName - ラジオボタンのname属性（上端・下端で別グループにする）
  // @param {(value:string)=>void} onChange - 選択が変わったときに呼ばれる
  function createEndTypeFieldset(legendText, currentValue, radioGroupName, onChange) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "air-column-boundary-fieldset";
    const legend = document.createElement("legend");
    legend.textContent = legendText;
    fieldset.appendChild(legend);

    [
      { value: AIR_COLUMN_END_OPEN, label: "開口" },
      { value: AIR_COLUMN_END_CLOSED, label: "閉口" },
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

  // 境界条件（開口/閉口）が変わったときに共通で必要な再計算
  // （延長区間は開口のときだけ存在するため作り直す→変位を再計算→固有振動数の表示を更新）。
  function handleEndTypeChange() {
    rebuildEndExtensions(airColumnState);
    updateColumns(airColumnState);
    refreshEigenfrequencyDisplay();
  }

  const sourceEndFieldset = createEndTypeFieldset(
    "上端（x = 0）",
    airColumnState.sourceEndType,
    "air-column-source-end-type",
    (value) => {
      airColumnState.sourceEndType = value;
      handleEndTypeChange();
    }
  );

  const farEndFieldset = createEndTypeFieldset(
    "下端（x = L）",
    airColumnState.farEndType,
    "air-column-far-end-type",
    (value) => {
      airColumnState.farEndType = value;
      handleEndTypeChange();
    }
  );

  // 管の外枠を表示するかどうかのトグル（appState側の表示専用フラグ）。
  // 物理計算には一切関わらないため、変更してもupdateColumnsを呼ぶ必要はない
  // （次のrender()でAirColumnRendererがこのフラグを読んで描画方法を変えるだけ）。
  const tubeVisibleLabel = document.createElement("label");
  tubeVisibleLabel.className = "wave-speed-fixed-toggle";
  const tubeVisibleCheckbox = document.createElement("input");
  tubeVisibleCheckbox.type = "checkbox";
  tubeVisibleCheckbox.checked = appState.tubeVisible;
  tubeVisibleLabel.appendChild(tubeVisibleCheckbox);
  tubeVisibleLabel.appendChild(document.createTextNode(" 管の外枠を表示する"));
  tubeVisibleCheckbox.addEventListener("change", () => {
    appState.tubeVisible = tubeVisibleCheckbox.checked;
  });

  refreshEigenfrequencyDisplay();

  wrapper.appendChild(sourceEndFieldset);
  wrapper.appendChild(farEndFieldset);
  wrapper.appendChild(tubeVisibleLabel);
  wrapper.appendChild(tubeLengthSlider.element);
  wrapper.appendChild(endCorrectionSlider.element);
  wrapper.appendChild(soundSpeedSlider.element);
  wrapper.appendChild(amplitudeSlider.element);
  wrapper.appendChild(modeNumberSlider.element);
  wrapper.appendChild(eigenfrequencyDisplay);
  wrapper.appendChild(columnCountSlider.element);

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
 * 気柱振動の再生・一時停止・リセット・コマ送り・再生速度変更のボタン群を作る
 * （js/ui/Controls.jsのcreatePlaybackControlsの気柱振動版。対象がsimulationStateではなく
 * airColumnStateであり、呼び出す関数もresetAirColumnColumns/updateColumnsになる点だけが異なる）。
 *
 * @param {Object} params
 * @param {Object} params.appState - isPlaying / playbackSpeed / airColumnState を持つAppState
 * @returns {{element: HTMLElement, setEnabled: (enabled:boolean)=>void}}
 */
export function createAirColumnPlaybackControls({ appState }) {
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
    resetAirColumnColumns(appState.airColumnState);
    updateColumns(appState.airColumnState);
  });

  const stepButton = document.createElement("button");
  stepButton.type = "button";
  stepButton.textContent = "⏭ コマ送り";
  stepButton.addEventListener("click", () => {
    appState.isPlaying = false;
    refreshPlayPauseLabel();
    appState.airColumnState.time += STEP_FRAME_DELTA_TIME;
    updateColumns(appState.airColumnState);
  });

  // 気柱の固有振動数は数十〜数百Hzあり、等倍〜0.25倍程度の減速では振動が目に見えないため、
  // 縦波用より大幅に遅い選択肢(AIR_COLUMN_PLAYBACK_SPEEDS)を使う。
  const speedSelect = document.createElement("select");
  AIR_COLUMN_PLAYBACK_SPEEDS.forEach((speed) => {
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
