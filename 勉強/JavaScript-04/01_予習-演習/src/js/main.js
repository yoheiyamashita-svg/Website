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
      // ①アコーディオンを閉じるときの処理を記述してください
      // ②アイコン操作用クラスを切り替える(クラスを取り除く)処理を記述してください
      // ③GSAPで作成したアニメーションを実行する関数を記述してくだい
      // ①の処理
      //②の処理
      //③の処理
    } else {
      // ①アコーディオンを開くときの処理を記述してください
      // ②アイコン操作用クラスを切り替える(クラスを付与)処理を記述してください
      //③GSAPで作成したアニメーションを実行する関数を記述してください
      // ①の処理
      // ②の処理
      // ③の処理
    }
  });
});

//アコーディオンメニューの閉じるアニメーション

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

/**
 * Step3 | Swiper カルーセルパネル
 * ・「.swiper-slideshow」に対してSwiperを使ってスライドショーを実装し、次のオプションを加えてください
 * ・オプションとして、自動再生、無限再生を付け加えてください
 */
