'use strict';

//index.htmlのみで読み込み、他のページでエラーにならないようにファイルを分割している
/*---------- オープニングアニメーション ----------*/

// オープニングアニメーションが学習の邪魔になるのでコメントアウトしています！
// 動作を確認したい場合はHTMLとJSのコメントアウトを外してみてください！

// function openingAnime() {
//   body.classList.toggle('is-active');

//   gsap
//     .timeline()
//     .from('.js_opening-txt', {
//       duration: 1.2,
//       autoAlpha: 0,
//       y: 40,
//     })
//     .to('.js_opening', {
//       autoAlpha: 0,
//       duration: 0.6,
//       onComplete() {
//         body.classList.toggle('is-active');
//       },
//     })
//     .from('.js_copy', {
//       duration: 0.6,
//       autoAlpha: 0,
//       x: -100,
//     })
//     .from('.js_sub-copy', {
//       duration: 0.6,
//       autoAlpha: 0,
//       x: -100,
//     });
// }

// const opening = document.querySelector('.js_opening');

// function webStorage() {
//   if (sessionStorage.getItem('access')) {
//     //2回目以降アクセス時の処理には関数を実行しない
//     opening.classList.add('is-active');
//   } else {
//     //初回アクセス時の処理
//     sessionStorage.setItem('access', 0);
//     openingAnime();
//   }
// }
// webStorage();

//sessionStorageの使い方について
//https: //developer.mozilla.org/ja/docs/Web/API/Window/sessionStorage
