'use strict';

/*---------- GSAP 設定 ----------*/

//存在しない要素を取得しようとするときに出るエラーを非表示にする
gsap.config({
  nullTargetWarn: false,
});

/*---------- ハンバーガーメニュー ----------*/
const hamburger = document.querySelector('.js_hamburger');
const navigation = document.querySelector('.js_nav');
const body = document.querySelector('.js_body');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('is-active');
  navigation.classList.toggle('is-active');
  body.classList.toggle('is-active');
});
/*---------- スライドイン ----------*/
// gsap
//   .timeline()
//   .from(".js_sub-copy", {
//     duration: 0.6,
//     autoAlpha: 0,
//     x: -100,
//   })
//   .from(".js_copy", {
//     duration: 0.6,
//     autoAlpha: 0,
//     x: -100,
//   });

/*---------- オープニングアニメーション ----------*/

// ここでスクロール禁止
body.classList.add('is-active');

gsap
  .timeline()
  .from('.js_opening-txt', {
    duration: 1.2,
    autoAlpha: 0,
    y: 40,
  })
  .to('.js_opening', {
    autoAlpha: 0,
    duration: 0.6,
    onComplete() {
      body.classList.remove('is-active');
    },
  })
  .from('.js_sub-copy', {
    duration: 0.6,
    autoAlpha: 0,
    x: -100,
  })
  .from('.js_copy', {
    duration: 0.6,
    autoAlpha: 0,
    x: -100,
  });

/*---------- スライドイン単体 ----------*/

/*---------- スライドイン 複数----------*/
