'use strict';

/*---------- GSAP 設定 ----------*/

//存在しない要素を取得しようとするときに出るエラーを非表示にする
gsap.config({
  nullTargetWarn: false,
});

/*---------- ハンバーガーメニュー ----------*/
const hamburger = document.querySelector('.js_hamburger');
const navigation = document.querySelector('.js_navigation');
const body = document.querySelector('.js_body');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('is-active');
  navigation.classList.toggle('is-active');
  body.classList.toggle('is-active');
});

/*---------- スライドイン ----------*/
// gsap.timeline()
// 	.from('.js_copy', {
// 		duration: 0.6,
// 		autoAlpha: 0,
// 		x: -100,
// 	})
// 	.from('.js_sub-copy', {
// 		duration: 0.6,
// 		autoAlpha: 0,
// 		x: -100,
// 	});

/*---------- スライドイン（problem） ----------*/

gsap.from(".js_problem", {
  // y軸方向の開始位置
  y: 100,
  // 開始時の透明度
  autoAlpha: 0,
  // 時間
  duration: 1,
  // 動きのなめらかさ(Power4.inOut)
  ease: "Power4.inOut",
  scrollTrigger: {
    trigger: ".js_problem-trigger", // 目印の要素
    start: "top center", // 上端が画面中央に来たら開始
  },
  stagger: {
    // 0.6秒ずつズラす
    each: 0.6,
    // どこから順番に動かすか指定
    from: "start",
  },
});

/*---------- スライドイン（info） ----------*/
const items = document.querySelectorAll(".js_h-side");

// forEach((値,index番号))
  items.forEach((item,idx) => {
    gsap.from(item, {
      // インデックス番号に+1して、2で割った時にあまりが0だったらx位置100%、でなければx位置-100%に配置する
      // "条件" ? "条件の内容がtrueになる場合の値" : "条件の内容がfalseになる場合の値";
      x: (idx+1)%2==0 ? "100%" : "-100%",
          // 開始時の透明度
      autoAlpha: 0,
    // 時間
    duration: 1,
    // 動きのなめらかさ(Power4.inOut)
    ease: "Power4.inOut",
    scrollTrigger: {
      trigger: ".js_problem-trigger", // 目印の要素
      start: "top center", // 上端が画面中央に来たら開始
    },
    stagger: {
      // 0.6秒ずつズラす
      each: 0.6,
      // どこから順番に動かすか指定
      from: "start",
    },
  });