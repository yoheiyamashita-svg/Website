// 縦波（進行波）用の学習モード。UIの土台（開始/終了・予想/結果フロー）は
// js/ui/QuestionFlow.js を再利用し、このファイルは縦波固有の設問データだけを持つ
// 薄いラッパーにする（気柱振動用の js/ui/acoustic/AirColumnLearningMode.js と対称）。
import { createQuestionFlow } from "./QuestionFlow.js";

// 出題データ。1問ごとに、問い・選択肢・正解の選択肢番号・解説（物理式との対応を含む）を持つ。
// 将来的に問題を追加したい場合は、この配列に要素を足すだけでよい設計にしてある。
const QUESTIONS = [
  {
    question: "振幅 A を2倍にすると、波の速さ v はどうなるか？",
    choices: ["2倍になる", "1/2になる", "変わらない", "わからない"],
    correctIndex: 2,
    explanation:
      "波の速さは v = fλ で決まり、振幅Aはこの式に含まれない。振幅は「揺れの大きさ」を表す量であり、" +
      "「波形が進む速さ」とは別の物理量なので、振幅を変えても波の速さは変わらない。",
  },
  {
    question: "波長 λ を固定したまま周波数 f を2倍にすると、波の速さ v はどうなるか？",
    choices: ["2倍になる", "1/2になる", "変わらない", "わからない"],
    correctIndex: 0,
    explanation: "v = fλ において λ を固定して f を2倍にすると、積である v も2倍になる。",
  },
  {
    question: "「波速を固定」をONにして波長λを1/2にすると、周波数fはどうなるか？",
    choices: ["2倍になる", "1/2になる", "変わらない", "わからない"],
    correctIndex: 0,
    explanation:
      "v固定ONのとき、v = fλ の関係を保つため f = v/λ として自動計算される。" +
      "λを1/2にすると、v(一定)を保つにはfを2倍にする必要がある。",
  },
];

/**
 * 縦波用の学習モードUIを作る。
 *
 * @param {Object} params
 * @param {{setEnabled:(enabled:boolean)=>void}} params.parameterControls
 * @param {{setEnabled:(enabled:boolean)=>void}} params.playbackControls
 * @returns {{element: HTMLElement}}
 */
export function createLearningMode({ parameterControls, playbackControls }) {
  return createQuestionFlow({ questions: QUESTIONS, parameterControls, playbackControls });
}
