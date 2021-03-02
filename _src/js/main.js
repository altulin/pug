import { getElementData, getElementName } from './modules/newElements.js';

$(function () {

  // faq tabs
  $('#tabs').responsiveTabs({
    startCollapsed: 'accordion'
  });

  //mmenu

  const menu = new MmenuLight(
    document.querySelector("#main-nav"),
    "(max-width: 600px)"
  );

  const navigator = menu.navigation({
    title: ""
  });

  const drawer = menu.offcanvas();

  $(`.header__open`).on(`click`, (e) => {
    e.preventDefault();
    drawer.open();
    $(`.header__open`).addClass(`hidden`);
    $(`.header__close`).removeClass(`hidden`);
  })

  $(`.header__close`).on(`click`, (e) => {
    e.preventDefault();
    drawer.close();
    $(`.header__close`).addClass(`hidden`);
    $(`.header__open`).removeClass(`hidden`);
  })

  $(`.nav__link`).each((i, item) => {
    $(item).on(`click`, () => {
      drawer.close();
      $(`.header__close`).addClass(`hidden`);
      $(`.header__open`).removeClass(`hidden`);
    })
  })


  // form

  //tabs
  $(`.fill-tabs__btn`).on(`click`, (e) => {
    const index = $(`.fill-tabs__btn`).index(e.target);

    $(`.fill-tabs__btn`).each((i, item) => {
      $(item).removeClass(`fill-tabs__btn--active`)
    })
    $(e.target).addClass(`fill-tabs__btn--active`)

    $(`.slider__item`).each((i, item) => {
      $(item).removeClass(`slider__item--visually`)
    })
    $($(`.slider__item`)[index]).addClass(`slider__item--visually`)

  })

  //select childrens
  $(`#childrens`).on(`change`, (e) => {
    let n = 0;
    const index = $(e.target).val();
    $(`.field-children`).remove();

    while (n < index) {
      n++
      $(`.fill-form__btn--submit`).before(getElementData(n))
      $(`.fill-form__btn--submit`).before(getElementName(n))
    }

    $(`.fill-form__field--children`).remove();

    $('select').styler('destroy');
    setTimeout(function () {
      $(`select`).styler();
      delErrorForm();
    }, 1)

  })

  $(`select`).styler();


  // проверка заполнения
  $(`.fill-form__btn`).on(`click`, (e) => {
    let hasError = false
    $(e.target).parent().find(`input, select`).each((i, item) => {
      $(item).removeClass(`fill-form__input--not-valid`);
      $(item).parent().removeClass(`fill-form__input--not-valid`);
      console.log($(`#my-number-home`).val())

      if ($(item).val().length === undefined || $(item).val() === null) {
        e.preventDefault()
        hasError = true

        if ($(item).has(`fill-form__select`)) {
          $(item).parent().addClass(`fill-form__input--not-valid`)
        }

        $(item).addClass(`fill-form__input--not-valid`)
      } else {
        hasError = false
      }
    });

    if (!hasError) {
      // console.log($(e.target).parent().next())
      $(e.target).parent().removeClass(`slider__item--visually`)
    }

  });

  // убрать ошибку

  const delErrorForm = () => {
    $(`input, .jq-selectbox__select`).on(`click`, (e) => {
      $(e.target).removeClass(`fill-form__input--not-valid`);
      $(e.target).parent().parent().removeClass(`fill-form__input--not-valid`);
    })
  };

  delErrorForm();


});
