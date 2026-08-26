// 気柱振動用の学習モード（js/ui/LearningMode.jsの気柱振動版）。
// UIの土台（開始/終了・予想/結果フロー）はjs/ui/QuestionFlow.jsを再利用し、
// このファイルは気柱振動固有の設問データだけを持つ薄いラッパーにする。
import { createQuestionFlow } from "../QuestionFlow.js";

// 出題データ（指示書§44の例に基づく）。
const QUESTIONS = [
  {
    question: "一端閉管で、閉口端の空気粒子はどのように動くか？",
    choices: ["大きく動く", "ほとんど動かない", "音源側と同じ大きさで動く", "わからない"],
    correctIndex: 1,
    explanation:
      "閉口端は変位の節であり、u(L,t)=0が常に成り立つ。物理的には、閉じた壁に押し付けられた" +
      "空気はそこから動けないため、閉口端付近の空気粒子はほとんど動かない。",
  },
  {
    question: "気柱の長さLを2倍にすると、基本振動数(n=1)はどうなるか？",
    choices: ["2倍になる", "1/2になる", "変わらない", "わからない"],
    correctIndex: 1,
    explanation:
      "両端開管ではf_n=nv/(2L)、一端閉管ではf_n=(2n-1)v/(4L)であり、" +
      "どちらもLに反比例する。Lを2倍にすると、固有振動数はすべて1/2になる。",
  },
  {
    question: "一端閉管で、2倍振動（偶数次の振動）が存在しないのはなぜか？",
    choices: [
      "偶数次では閉口端の節条件(u(L,t)=0)を満たせないから",
      "偶数次では開口端の腹条件を満たせないから",
      "音速が足りないから",
      "わからない",
    ],
    correctIndex: 0,
    explanation:
      "一端閉管ではkL=(2n-1)π/2（奇数×π/2）でなければ閉口端でcos(kL)=0、" +
      "すなわちu(L,t)=0という節条件を満たせない。kLが偶数×π/2になるモードは" +
      "この条件を満たさないため、物理的に存在できない。",
  },
  {
    question: "開口端付近の空気粒子が最も大きく動くのはなぜか？",
    choices: [
      "開口端は変位の腹であり、振幅がAそのままだから",
      "開口端は変位の節であり、振幅が最大になるから",
      "開口端では音速が速くなるから",
      "わからない",
    ],
    correctIndex: 0,
    explanation:
      "u(x,t)=A cos(kx) cos(ωt) において、開口端(x=0)ではcos(0)=1なので、" +
      "変位の振幅がAのままの「腹」になる。腹では時刻によって変位が最大A・最小-Aまで" +
      "振れるため、その場の粒子が最も大きく動く。",
  },
];

/**
 * 気柱振動用の学習モードUIを作る。
 *
 * @param {Object} params
 * @param {{setEnabled:(enabled:boolean)=>void}} params.parameterControls
 * @param {{setEnabled:(enabled:boolean)=>void}} params.playbackControls
 * @returns {{element: HTMLElement}}
 */
export function createAirColumnLearningMode({ parameterControls, playbackControls }) {
  return createQuestionFlow({ questions: QUESTIONS, parameterControls, playbackControls });
}
