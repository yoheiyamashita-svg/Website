/**
 * Step1 | アコーディオンメニューの穴埋め
 *
 *
 */
/*---------- アコーディオンメニュー ----------*/

const faq = document.querySelectorAll('.js_faq');

faq.forEach((element) => {
  const faqA = element.querySelector('.js_faq-a');

  element.addEventListener('click', () => {
    if (element.classList.contains('is-active')) {
      // アコーディオンを閉じるときの処理
      // アイコン操作用クラスを切り替える(クラスを取り除く)
      //要素の.何を、どうする
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

/**
 * Step2 | Swiper カルーセルパネル
 * ・swiperの実装に必要な読み込みを行ってください
 * ・「.swiper-slider」に対してSwiperを使ってカルーセルを実装し、次のオプションを加えてください
 * ・オプションとして、自動再生、無限再生、次へボタン、前へボタンを付け加えてください
 */
const slider = new Swiper('.swiper-slider', {
  autoplay: true,
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

/**
 * Step3 | Swiper カルーセルパネル
 * ・「.swiper-slideshow」に対してSwiperを使ってスライドショーを実装し、次のオプションを加えてください
 * ・オプションとして、自動再生、無限再生を付け加えてください
 */
const slideshow = new Swiper('.swiper-slideshow', {
  autoplay: true,
  loop: true,
  effect: 'fade',
});
