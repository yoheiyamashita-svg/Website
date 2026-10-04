/*【演習1： 変数】
①「fruit」という名前の変数を定義し、（宣言はlet）初期値に文字列「りんご」を代入しよう
「fruit」の値をコンソール画面に表示しよう*/
//コードはこの下から書いてください
let fruit = "りんご";
console.log(fruit);

/*②「fruit」の値を再代入して「ぶどう」に変更し、値をコンソール画面で再度表示しよう*/
// コードはこの下から書いてください
fruit = "ぶどう";
console.log(fruit);

/*【チャレンジ問題】
・繰り返し構文を使用して「fruit」の値をコンソール画面に5回表示しよう*/
// コードはこの下から書いてください

fruit = 'りんご';
for (let count = 1; count <= 5; count++) {
	console.log(fruit);
}

/*【演習2： if文】
1. 「age」という名前の変数を定義し、初期値に適当な数値を代入しよう
2. 以下の条件分岐を作成しよう
  ・ageの値が0未満だったらコンソール画面に「正しい値を入力してください。」を出力
  ・ageの値が20未満だったらコンソール画面に「あなたは20歳未満です。」を出力
  ・ageの値が20以上だったらコンソール画面に「あなたは20歳以上です。」を出力
  ・ageの値がそれ以外だったらコンソール画面に「正しい値を入力してください。」を出力*/
// コードはこの下から書いてください
let age = 25;
if (age < 0) {
  console.log("正しい値を入力してください。");
} else if (age < 20) {
  console.log("あなたは20歳未満です。");
} else if (age >= 20) {
  console.log("あなたは20歳以上です。");
} else {
  console.log("正しい値を入力してください。");
}

/*【チャレンジ問題】
・if文の条件分岐に「ageの値が数値かどうか」を判定する条件を追加しよう*/
// コードはこの下から書いてください

age = 0;
if (age < 0 || isNaN(age)) {
console.log("正しい値を入力してください。");
} else if (age < 20) {
console.log("あなたは20歳未満です。");
} else if (age >= 20) {
console.log("あなたは20歳以上です。");
} else {
console.log("正しい値を入力してください。");
}


/*演習3・4・5は授業で取り扱わないので演習が早く終わった方は取り組んでみましょう。
なお、模範回答はポイントまとめシートの下部にあります。
*/

/*【演習3： While文】
・コンソール画面に1~15の値を出力しよう*/
// コードはこの下から書いてください
let i = 1;
while ( i <= 15) {
  console.log(i);
   i++
}

/*【演習4： for文】
・コンソール画面に1~15の値を出力しよう*/
// コードはこの下から書いてください
for (let i = 1; i <= 15; i++) {
  console.log(i);
}

/*【演習5： ループと条件分岐】
・1〜30の値をコンソール画面に出力し、3の倍数の時は「Fizz」、5の倍数の時は「Buzz」、15の倍数の時は「FizzBuzz!!」を出力しよう（ループ文の指定はない）*/
// コードはこの下から書いてください
for (let i = 1; i <= 30; i++) {
  if (i % 15 === 0) {
    console.log("FizzBuzz!!");
  } else if (i % 3 === 0) {
    console.log("Fizz");
  } else if (i % 5 === 0) {
    console.log("Buzz");
  } else {
    console.log(i);
  }
}
/*【演習6： 関数】
・「sum」という名前の関数を定義し、第一引数の値と第二引数の値を足した値を返す関数を作成しよう
  （例）第一引数が5、第二引数が3だった場合に8が返ってくる*/
// コードはこの下から書いてください
function sum(a, b) {
  return a + b;
}
console.log(sum(5, 3)); // 8

function panman (food,type="パンマン") {
  let name = food + type;
  return name;
}
console.log(panman("カレー")); // カレーパンマン
console.log(panman("しょく")); // しょくぱんまん
console.log(panman("ジャム","おじさん")); // ジャムおじさん
console.log(panman("ばいきん","")); // ばいきん


/*【サンプル： クラスを付ける】
1. 「.js_ttl」をクリックしたら、「.js_ttl」に「.is-active」を追加する
2. 「.js_ttl」に「.is-active」が追加された時に、以下のように見た目を変更する（style.cssにあらかじめ定義する）
  ・フォントサイズを50pxにする
  ・文字色を緑にする*/

const ttl = document.querySelector('.js_ttl');
ttl.addEventListener('click', () => {
  ttl.classList.add('is-active');
});
/**
var ttl = document.querySelector('.js_ttl');
ttl.addEventListener('click', function() {
  ttl.classList.add('is-active');
});
 */


/*【演習7： クラスを付ける】
1. 「.js_box」をクリックしたら、「.js_box」に「.is-active」を追加する
2. 「.js_box」に「.is-active」が追加された時に、以下のように見た目を変更する（style.cssにあらかじめ定義する）
  ・大きさが1.5倍になるようにする
  ・背景色を青にする
  ・これらの変化が0.5秒で実行されるようにする*/
// コードはこの下から書いてください
// .js_boxを取得してboxという名前の変数に代入する
const box = document.querySelector(".js_box");
// .js_boxをクリックしたら
box.addEventListener("click", function () {
  //.is-activeを追加
  box.classList.add("is-active");
});

/*【演習8： クラスを付け外しする】
1. 「.js_box02」をクリックしたら、「.js_box02」に「.is-active」を付け外しできるようにする
2. 「.js_box02」に「.is-active」が追加された時に、以下のように見た目を変更する（style.cssにあらかじめ定義する）
  ・X方向に200px移動する
  ・360度回転する
  ・これらの変化が0.5秒で実行されるようにする*/
// コードはこの下から書いてください
const box2 = document.querySelector(".js_box02");
box2.addEventListener("click", function () {
  box2.classList.toggle("is-active");
});

