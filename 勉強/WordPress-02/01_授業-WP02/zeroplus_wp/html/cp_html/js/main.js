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

/*---------- スライドイン（単体） ----------*/
gsap.from('.js_problem', {
  y: 200,
  autoAlpha: 0,
  duration: 1, //アニメーションの長さ
  ease: 'Power4.inOut', //アニメーションの変化率
  scrollTrigger: {
    trigger: '.js_problem-trigger',
    start: 'top center',
    // 発火するスクロール位置や終了位置をマーカーする
    // markers: true,
  },
  stagger: {
    // each: 指定した時間が経過した時に次の要素のアニメーションを開始する
    each: 0.6,
    // amount: アニメーションの総時間（eachかamountのどちらかを指定する）
    // amount: 1,
    from: 'start',
    //start：1番目から始める
    // center： 中央から始める
    // edges： 両端から始める
    // random： ランダムに始める
    // end： 最後から始める
  },
});

/*---------- スライドイン（複数） ----------*/
const items = document.querySelectorAll('.js_h-slide');

// forEach文のコールバック関数
// 対象要素.forEach(function (value, index,array) {
// });
// value： 配列データの値
// index： 配列のインデックス番号→省略可能
// array： 現在処理している配列→省略可能

// 三項演算子の書き方
// "条件" ? "条件の内容がtrueになる場合の値" : "条件の内容がfalseになる場合の値";

items.forEach((item, idx) => {
  gsap.from(item, {
    // インデックス番号に+1して、2で割った時にあまりが0だったら100%、でなければ-100%に配置する
    x: (idx + 1) % 2 == 0 ? '100%' : '-100%',
    autoAlpha: 0,
    ease: 'Power4.inOut',
    scrollTrigger: {
      // item.parentNode: itemの親要素
      trigger: item.parentNode,
      start: 'top center',
      // 発火するスクロール位置や終了位置をマーカーする
      // markers: true,
    },
  });
});

//別解答
// const items = document.querySelectorAll(".js_h-slide");

// items.forEach(function (item, idx) {

//   gsap.from(item, {
//     インデックス番号に+1して、2で割った時にあまりが0だったら100%、でなければ-100%に配置する
//     x: function () {
//       if ((idx + 1) % 2 == 0) {
//         return "100%";
//       } else {
//         return "-100%";
//       }
//     },
//     autoAlpha: 0,
//     ease: "Power4.inOut",
//     scrollTrigger: {
//       item.parentNode: itemの親要素
//       trigger: item.parentNode,
//       start: "top center",
//        発火するスクロール位置や終了位置をマーカーする
//        markers: true,
//     },
//   });
// });

/*---------- アコーディオンメニュー ----------*/

const faq = document.querySelectorAll('.js_faq');

faq.forEach((element) => {
  const faqA = element.querySelector('.js_faq-a');

  element.addEventListener('click', () => {
    if (element.classList.contains('is-active')) {
      // アコーディオンを閉じるときの処理
      // アイコン操作用クラスを切り替える(クラスを取り除く)
      element.classList.remove('is-active');
      element.querySelector('.js_faq_mark').classList.remove('is-open');

      // アニメーション実行
      closingAnim(faqA);
    } else {
      // アコーディオンを開くときの処理
      // アイコン操作用クラスを切り替える(クラスを付与)
      element.classList.add('is-active');
      element.querySelector('.js_faq_mark').classList.add('is-open');

      // アニメーション実行
      openingAnim(faqA);
    }
  });
});

const closingAnim = function (content) {
  gsap.to(content, {
    height: 0,
    autoAlpha: 0,
    duration: 0.4,
    ease: 'Power4.inOut',
  });
};

const openingAnim = function (content) {
  gsap.to(content, {
    height: 'auto',
    autoAlpha: 1,
    duration: 0.4,
    ease: 'Power4.inOut',
  });
};

/*---------- スライドショー ----------*/

const slideshow = new Swiper('.js_slideshow', {
  speed: 1200,
  effect: 'fade',
  pagination: {
    el: '.swiper-pagination_slideshow',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next_slideshow',
    prevEl: '.swiper-button-prev_slideshow',
  },
  autoplay: {
    delay: 1600,
    disableOnInteraction: false,
  },
});

/*---------- カルーセルパネル ----------*/

const swiper = new Swiper('.js_success-swiper', {
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  spaceBetween: 20,
  breakpoints: {
    768: {
      slidesPerView: 2,
    },
    1088: {
      slidesPerView: 3,
    },
  },
});
