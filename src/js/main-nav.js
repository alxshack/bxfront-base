var MainNav = {
  el: '.js-main-nav',
  name: 'MainNav',

  initialize: function () {
    this.toggleBtn = this.$('.js-main-nav__toggle');
    this.menuList = this.$('.js-main-nav__list');
  },

  events: {
    'click .js-main-nav__toggle': 'toggleMenu'
  },


  toggleMenu: function (e) {
    e.preventDefault();
    this.toggleBtn.toggleClass('main-nav__toggle--open');
    this.menuList.toggleClass('main-nav__list--open');
    $('body').toggleClass('is-open-menu');
  }
};

App.Control.install(MainNav);