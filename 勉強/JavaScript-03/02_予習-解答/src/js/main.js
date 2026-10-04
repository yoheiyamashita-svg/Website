'use strict';
/**
 * Step1 | GSAP ScrollTrigger
 * ・GSAPの読み込みに加えて、ScrollTriggerの使用に必要な読み込みを行ってください
 * ・ScrollTriggerを使って、
 *  - 「.gsap_container」が画面の中央に到達した時に
 *  - 「.gsap_item」を左から順番に
 *  - 60px下から上へ動きながら
 *  - フェードイン表示させてください
 * （動き幅やアニメーション時間は問わない）
 */
gsap.from('.gsap_item', {
  y: 60,
  autoAlpha: 0,
  duration: 1,
  scrollTrigger: {
    trigger: '.gsap_container',
    start: 'top center',
  },
  stagger: {
    each: 0.6,
    from: 'start',
  },
});

//  * Step2 | forEachメソッド *

// ・forEachメソッドを使用して以下のアイテムの背景色を変更してください。
// ・条件： 1 個目のアイテムは青、 2 個目のアイテムは赤、3個目のアイテムは青にする。

const colorItem = document.querySelectorAll('.foreach_item');

colorItem.forEach((item, idx) => {
  item.style.backgroundColor = (idx + 1) % 2 == 0 ? 'red' : 'blue';
});
