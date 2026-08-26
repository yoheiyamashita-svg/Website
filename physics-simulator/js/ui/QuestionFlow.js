// 学習モードのUIシェル（EDU-006, REQ-301〜304）を、縦波・気柱振動の両方から
// 再利用できる汎用コンポーネントとして提供する。
//
// 【重要な設計変更（バグ修正）】
// 以前の実装は、このモジュールが生成された瞬間に無条件で
// parameterControls.setEnabled(false) / playbackControls.setEnabled(false) を呼んでおり、
// ページを開いた直後からメインのスライダー・再生ボタンが全て操作不能になっていた
// （ユーザー報告：「ボタン・スライダーが操作できない」）。
// これはREQ-301/302「予想確定前は操作不可」を、学習モードに入ってもいない状態の
// ページ全体に対して常時適用してしまっていたのが原因。
//
// 修正方針：学習モードを「開始する/終了する」を明示的に選べる独立モードにする。
// デフォルト（idle状態）ではparameterControls/playbackControlsに一切触れず、
// 「学習モードを開始する」ボタンが押された後の予想フェーズでだけロックする。

const FLOW_STATE_IDLE = "idle"; // 学習モード未開始（フリー探索中、何もロックしない）
const FLOW_STATE_PREDICTING = "predicting"; // 予想入力中（操作ロック中）
const FLOW_STATE_EXPERIMENTING = "experimenting"; // 予想確定後、操作可能（結果確認待ち）
const FLOW_STATE_REVIEWING = "reviewing"; // 結果確認済み（次の問題へ進める）

/**
 * 学習モード（予想→操作→結果確認→数式対応）のUIを作る。
 *
 * @param {Object} params
 * @param {Array<{question:string, choices:string[], correctIndex:number, explanation:string}>} params.questions
 *   - 出題データ。呼び出し側（縦波用・気柱振動用）が独自の設問配列を渡す。
 * @param {{setEnabled:(enabled:boolean)=>void}} params.parameterControls
 * @param {{setEnabled:(enabled:boolean)=>void}} params.playbackControls
 * @returns {{element: HTMLElement}}
 */
export function createQuestionFlow({ questions, parameterControls, playbackControls }) {
  const wrapper = document.createElement("div");
  wrapper.className = "learning-mode";

  const startButton = document.createElement("button");
  startButton.type = "button";
  startButton.textContent = "▶ 学習モードを開始する";

  const endButton = document.createElement("button");
  endButton.type = "button";
  endButton.textContent = "✕ 学習モードを終了する";

  const questionElement = document.createElement("p");
  questionElement.className = "learning-mode-question";

  const choicesElement = document.createElement("div");
  choicesElement.className = "learning-mode-choices";

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.textContent = "予想を確定する";

  const checkResultButton = document.createElement("button");
  checkResultButton.type = "button";
  checkResultButton.textContent = "結果を確認する";

  const resultElement = document.createElement("div");
  resultElement.className = "learning-mode-result";

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "次の問題へ";

  // 学習モードの本体（設問〜結果表示）はstartButtonの下にまとめ、
  // idle状態のときはこの要素ごと非表示にする。
  const sessionElement = document.createElement("div");
  sessionElement.className = "learning-mode-session";
  sessionElement.appendChild(questionElement);
  sessionElement.appendChild(choicesElement);
  sessionElement.appendChild(confirmButton);
  sessionElement.appendChild(checkResultButton);
  sessionElement.appendChild(resultElement);
  sessionElement.appendChild(nextButton);
  sessionElement.appendChild(endButton);

  wrapper.appendChild(startButton);
  wrapper.appendChild(sessionElement);

  let currentQuestionIndex = 0;
  let selectedChoiceIndex = null;

  /**
   * flowStateに応じて、各ボタンの表示/非表示とparameterControls/playbackControlsの
   * 有効/無効を切り替える。UI操作のロックはここ1箇所にまとめ、
   * 「今どの状態でロックすべきか」が一目で分かるようにする。
   */
  function applyFlowState(flowState) {
    const isSessionActive = flowState !== FLOW_STATE_IDLE;
    startButton.style.display = isSessionActive ? "none" : "";
    sessionElement.style.display = isSessionActive ? "" : "none";

    confirmButton.style.display = flowState === FLOW_STATE_PREDICTING ? "" : "none";
    checkResultButton.style.display = flowState === FLOW_STATE_EXPERIMENTING ? "" : "none";
    nextButton.style.display = flowState === FLOW_STATE_REVIEWING ? "" : "none";

    // REQ-301/302：予想入力中(PREDICTING)だけ操作をロックする。
    // idle（学習モード未開始）では絶対にロックしない＝バグ修正の核心部分。
    const shouldLockControls = flowState === FLOW_STATE_PREDICTING;
    parameterControls.setEnabled(!shouldLockControls);
    playbackControls.setEnabled(!shouldLockControls);
  }

  function renderQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    selectedChoiceIndex = null;

    questionElement.textContent = `予想：${currentQuestion.question}`;
    choicesElement.innerHTML = "";
    resultElement.textContent = "";
    resultElement.className = "learning-mode-result";

    currentQuestion.choices.forEach((choiceText, choiceIndex) => {
      const choiceLabel = document.createElement("label");
      choiceLabel.className = "learning-mode-choice";

      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "learning-mode-choice";
      radioInput.value = String(choiceIndex);
      radioInput.addEventListener("change", () => {
        selectedChoiceIndex = choiceIndex;
      });

      choiceLabel.appendChild(radioInput);
      choiceLabel.appendChild(document.createTextNode(choiceText));
      choicesElement.appendChild(choiceLabel);
    });

    applyFlowState(FLOW_STATE_PREDICTING);
  }

  startButton.addEventListener("click", () => {
    renderQuestion();
  });

  endButton.addEventListener("click", () => {
    // 学習モードを中断してフリー探索に戻る。isPlaying等のシミュレーション状態には触れない。
    applyFlowState(FLOW_STATE_IDLE);
  });

  // REQ-302：予想を確定したら、実験（パラメータ操作・再生操作）を許可する。
  confirmButton.addEventListener("click", () => {
    if (selectedChoiceIndex === null) {
      resultElement.textContent = "選択肢を1つ選んでから確定してください。";
      return;
    }
    applyFlowState(FLOW_STATE_EXPERIMENTING);
  });

  // REQ-303/304：実験結果（＝正解）を確認し、数式による説明を表示する。
  checkResultButton.addEventListener("click", () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedChoiceIndex === currentQuestion.correctIndex;

    resultElement.className = `learning-mode-result ${isCorrect ? "correct" : "incorrect"}`;
    resultElement.textContent =
      `あなたの予想：「${currentQuestion.choices[selectedChoiceIndex]}」 / ` +
      `正解：「${currentQuestion.choices[currentQuestion.correctIndex]}」（${isCorrect ? "正解！" : "不正解"}）\n` +
      currentQuestion.explanation;

    applyFlowState(FLOW_STATE_REVIEWING);
  });

  nextButton.addEventListener("click", () => {
    // `%`（剰余演算子）により、最後の問題の次は自動的に0番目（最初の問題）に戻る。
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    renderQuestion();
  });

  applyFlowState(FLOW_STATE_IDLE);

  return { element: wrapper };
}
