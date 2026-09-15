/**
 * Step2 | 変数
 * ・変数名「greet」を定義し、初期値に「こんにちは」を設定してください。
 * ・コンソール画面に「こんにちは」が表示されるよう、記述を加えましょう。
 */

const greet = 'こんにちは';
console.log(greet);

console.log('-- Step2 End --'); // このコードは、問題毎の区切り線をコンソールで表示させています。特に変更しないでください。

/**
 * Step3 | if文
・変数名「age」を定義し、適当な数値を代入してください。
・変数「age」を用いて、条件に基づいて成人か未成年かを判別するif文を作成してください。
・未成年の場合は、「{age}歳は未成年です」と出力し、成人の場合は、「{age}歳は成人です」と出力してください。
例:「age」に19を代入した場合は、「19歳は未成年です」が出力される。 */
const age = 20;
if (age < 20) {
  console.log(`${age}歳は、未成年です`);
} else {
  console.log(`${age}歳は、成人です`);
}
console.log('-- Step3 End --');

/**
 * Step4 | 関数
 * ・関数名「greeting」を関数で定義し、引数名「name」を設定してください。
 * ・関数の処理として、「〇〇さん、こんにちは」（〇〇に引数nameに渡した値が入ります）と出力される処理を記述してください。
 * ・関数「greeting」を、引数nameに文字列を渡して、呼び出してください。
 */
function greeting(name) {
  console.log(`${name}さん、こんにちは`);
}
greeting('佐藤');
console.log('-- Step4 End --');

/**
 * Step5 | JavaScript DOMの取得
 * ・単一の「.class-get_item」がついているDOMを取得してください。
 * ・取得したDOMをコンソールに出力してください。
 */
const dom = document.querySelector('.class-get_item');
console.log(dom);
console.log('-- Step5 End --');

/**
 * Step6 | JavaScript クラス操作
 *「.class-method_item」をクリックしたときに、is-activeクラスを追加するようにしてください。
 */
const classMethodItem = document.querySelector('.class-method_item');
classMethodItem.addEventListener('click', () => {
  classMethodItem.classList.add('is-active');
});
console.log('-- Step6 End --');

/**
 * Step7 | for文（授業では扱いませんが、重要な知識ではあるので余裕がある方はチャレンジしてみましょう！）
 * ・for文を用いて1~5の数字を出力してください。
 */
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
console.log('-- Step7 End --');

/**
 * Step8 | while文（授業では扱いませんが、重要な知識ではあるので余裕がある方はチャレンジしてみましょう！）
 * ・while文を用いて1~5の数字を出力してください。
 */
let num = 1;

while (num <= 5) {
  console.log(num);
  num++;
}
console.log('-- Step8 End --');

/**
 * Step9 | forEach文（授業では扱いませんが、重要な知識ではあるので余裕がある方はチャレンジしてみましょう！）
 * ・「fruits」という名前で、配列として「りんご・みかん・ぶどう・メロン」を定義してください。
 * ・forEach文を用いて、果物をそれぞれ出力してください。
 */
const fruits = ['りんご', 'みかん', 'ぶどう', 'メロン'];
fruits.forEach((fruit) => {
  console.log(fruit);
});
console.log('-- Step9 End --');
