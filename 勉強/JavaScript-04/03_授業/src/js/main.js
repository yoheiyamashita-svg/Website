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

/*---------- スライドイン（info） ----------*/

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

/*---------- スライドショー ----------*/
const slideShowDomCase = document.querySelector(".js_slideshow");

if (slideShowDomCase) {
  const slideshow = new Swiper(slideShowDomCase, {
    speed: 1200,
    effect: "fade",
    autoplay: {
      delay: 1600,
      disableOnInteraction: false,
    },
  });
}

/*---------- カルーセルパネル ----------*/
// .js_success-swiperクラスを持つ要素を取得して、変数slidesCarouselDomCaseに代入する
const slidesCarouselDomCase = document.querySelector(".js_success-swiper");

  //  もしslidesCarouselDomCaseが存在したら、〜〜する
if (slidesCarouselDomCase) {
  const swiper = new Swiper(slidesCarouselDomCase, {
    // ループさせる設定
    loop: true,
    // スライド間の余白(20px)
    spaceBetween: 20,

    pagination: {
      el: ".js_success-pagination", // ページネーションの要素
    },
    navigation: {
      nextEl: ".js_success-next", // 次へボタンの要素
      prevEl: ".js_success-prev", // 前へボタンの要素
    },
    breakpoints: {
      768: {
        // 2枚表示する設定
        slidesPerView: 2,
      },
      1088: {
        // 3枚表示する設定
        slidesPerView: 3,
      },
    },
  });
}


/*---------- アコーディオンメニュー ----------*/
// ================================
// 【穴埋め問題】空欄を埋めてコードを完成させよう
// ================================
// 【ルール】
// 1. ①②③... と番号がついている部分を正しい値に書き換えよう
// 2. /* A / B / C */ と書かれている部分は、正しいものを一つ選んで書き換えよう
// ================================
// 【穴埋め一覧】
// ① FAQの親要素のクラス名
// ② 回答エリアのクラス名
// ③ 開いている状態のクラス名
// ④ アイコン(+/-)が開いている状態のクラス名
// ================================

const faq = document.querySelectorAll(".js_faq"); 
faq.forEach(function(element) {
  const faqA = element.querySelector(".js_faq-a");
  element.addEventListener("click", function() {
    if (element.classList.contains("is-active")) {
      // アコーディオンを閉じるときの処理
      // クリックするたびにクラスをつけたり外したりしたい → toggle / add / remove のどれ？
      element.classList.toggle("is-active");

      // 同上
      element.querySelector(".js_faq_mark").classList.toggle("is-open");

      // 閉じるときに呼ぶ関数はどっち？ → closingAnim / openingAnim
      closingAnim(faqA);

    } else {
      // アコーディオンを開くときの処理

      // クリックするたびにクラスをつけたり外したりしたい → toggle / add / remove のどれ？
      element.classList.toggle("is-active");

      // 同上
      element.querySelector(".js_faq_mark").classList.toggle("is-open");

      // 開くときに呼ぶ関数はどっち？ → closingAnim / openingAnim
      openingAnim(faqA);
    }
  });
});

const closingAnim = function(content) {
  // 終了状態だけ指定したい → from / to / fromTo のどれ？
  gsap./* from / to / fromTo */(content, {
    height: ⑤,  // 閉じたときの高さ → 完全に閉じると高さは？
    autoAlpha: ⑥, // 閉じたときの透明度 → 完全に透明にすると？
    duration: 0.4,
    ease: "Power4.inOut",
  });
};

const openingAnim = function(content) {
  // 終了状態だけ指定したい → from / to / fromTo のどれ？
  gsap./* from / to / fromTo */(content, {
      height: "⑦", // 高さを内容に合わせるキーワードは？
      autoAlpha: ⑧,  // 完全に不透明にすると？
      duration: 0.4,
      ease: "Power4.inOut",
    }
  );
};
