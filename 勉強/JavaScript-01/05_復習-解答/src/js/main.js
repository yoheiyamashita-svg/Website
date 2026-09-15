/*【Step1： 変数】*/
/*・「x」という名前の変数を定義し、（宣言はlet）初期値に数値「50」を代入しよう*/
const x = 50;

/*・「x」の値をコンソール画面に表示しよう*/
console.log(x);

/*・「x」の値と「5」を加算演算子した値をコンソール画面で表示しよう*/
console.log(x + 5);

/*・「x」の値と「5」を減算演算子した値をコンソール画面で表示しよう*/
console.log(x - 5);

/*・「x」の値と「5」を乗算演算子した値をコンソール画面で表示しよう*/
console.log(x * 5);

/*・「x」の値と「5」を除算演算子した値をコンソール画面で表示しよう*/
console.log(x / 5);

/*・「x」の値と「5」を剰余演算子した値をコンソール画面で表示しよう*/
console.log(x % 5);

/*・「x」の値と「5」をべき乗演算子した値をコンソール画面で表示しよう*/
console.log(x ** 5);

/*
【Step2： if文】
・テストの点数によって出力するメッセージを分岐しよう
  ・「score」という名前の変数を定義し、初期値に適当な数値を代入しよう
  ・変数「score」が80点以上であれば、「おめでとう！合格です！」とコンソール画面に出力しよう
  ・変数「score」が60点以上80点未満であれば、「惜しい！もう少しで合格です！」とコンソール画面に出力しよう
  ・変数「score」が30点以上60点未満であれば、「もう少し頑張りましょう！」とコンソール画面に出力しよう
  ・変数「score」が30点以下であれば、「残念です…。学習範囲を反復しましょう！」とコンソール画面に出力しよう
*/

const score = 100;
if (score >= 80) {
  console.log('おめでとう！合格です！');
} else if (score >= 60) {
  console.log('惜しい！もう少しで合格です！');
} else if (score >= 30) {
  console.log('もう少し頑張りましょう！');
} else {
  console.log('残念です…。学習範囲を反復しましょう！');
}

/*
【Step3： 関数】
・「average」という名前の関数を定義し、第一引数の値と第二引数の値の平均値を返す関数を作成しよう
  （例）第一引数が80、第二引数が50だった場合に65が返ってくる
*/

function average(a, b) {
  const result = (a + b) / 2;
  return result;
}

console.log(average(80, 50));

/*
【チャレンジ問題： 関数】
・「arrayAverage」という名前の関数を定義し、数値型の配列を受け取り、配列にある数値の平均値を返す関数を作成しよう
  （例）引数が[60, 70, 60, 80, 95] という配列だった場合に73が返ってくる
*/
function arrayAverage(scores) {
  let result = 0;
  for (let i = 0; i < scores.length; i++) {
    result += scores[i];
  }

  result = result / scores.length;
  return result;
}

console.log(arrayAverage([60, 70, 60, 80, 95]));

/*
【Step4： クラスを追加する】
1. 「.js_box」をクリックしたら、「.js_box」に「.is-active」を付け外しできるようにする
2. 「.js_box」に「.is-active」が追加された時に、以下のように見た目を変更する（style.cssにあらかじめ定義する）
  ・大きさが1.5倍になるようにする
  ・これらの変化が0.5秒で実行されるようにする
*/

const box = document.querySelector('.js_box');

box.addEventListener('click', () => {
  box.classList.add('is-active');
});

/*
【Step5： クラスを付け外しする】
1.「.js_box02」をクリックしたら、「.js_box02」に「.is-active」を付け外しできるようにする
2.「.js_box02」 に「.is-active」 が追加された時に、 以下のように見た目を変更する（ style.cssにあらかじめ定義する）
  ・y方向に300px移動する
  ・360度回転する
  ・これらの変化が0.5秒で実行されるようにする
*/

const box02 = document.querySelector('.js_box02');

box02.addEventListener('click', () => {
  box02.classList.toggle('is-active');
});
