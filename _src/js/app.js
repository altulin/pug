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
  })

  //header-menu
  // const menu = new MmenuLight(
  //   document.querySelector( "#header-menu" ),
  //   "(max-width: 600px)"
  // );

  // const navigator = menu.navigation({
  //   title: ""
  // });
  // const drawer = menu.offcanvas();

  // $('body').on('click', '.page-header__menu--open', (e) => {
  //   $(`.page-header__menu--open`).addClass(`hide`);
  //   $(`.page-header__menu--close`).removeClass(`hide`);
  //   e.preventDefault();
  //   drawer.open();

  // })

  // $('body').on('click', '.page-header__menu--close', (e) => {
  //   $(`.page-header__menu--close`).addClass(`hide`);
  //   $(`.page-header__menu--open`).removeClass(`hide`);
  //   console.log(`kffkfkfkfkk`)
  //   e.preventDefault();
  //   drawer.close();
  // })


});
