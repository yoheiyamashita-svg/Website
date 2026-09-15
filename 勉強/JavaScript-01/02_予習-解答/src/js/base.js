/* ------------------------------ */
/*                                */
/*                                */
/*                                */
/*                                */
/* このファイルは編集しないでください。 */
/*                                */
/*                                */
/*                                */
/*                                */
/* ------------------------------ */

const accordionButtons = document.querySelectorAll('.js_accordion');

accordionButtons.forEach((accordionButton) => {
  accordionButton.addEventListener('click', () => {
    accordionButton.classList.toggle('is_open');
    accordionButton.nextElementSibling.classList.toggle('is_open');
  });
});
