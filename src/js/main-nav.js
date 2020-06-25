var MainNav = {
  el: '.js-main-nav',
  name: 'MainNav',

  initialize: function () {
    this.toggleBtn = this.$('.js-main-nav__toggle');
    this.innerMenu = this.$('.js-main-nav__inner-menu');
  },

  events: {
    'click .js-main-nav__toggle': 'toggleMenu'
  },


  toggleMenu: function (e) {
    e.preventDefault();
    this.toggleBtn.toggleClass('main-nav__toggle--open');
    this.innerMenu.toggleClass('inner-menu--open')
    $('.page-overlay').toggleClass('is-open-menu');
    $('body').toggleClass('is-open-menu');
  }

};

App.Control.install(MainNav);