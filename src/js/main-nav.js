(function ($) {
  App.Widgets = App.Widgets || {};
  App.Widgets.MainNav = can.Control.extend({
    pluginName: 'appWidgetMainNav'
  }, {
    init: function () {
      this.toggleBtn = this.element.find('.js-main-nav__toggle');
      this.innerMenu = this.element.find('.js-main-nav__inner-menu');
      var self = this;

      this.toggleBtn.on('click', function (evt) {
        evt.preventDefault();
        self.toggleBtn.toggleClass('main-nav__toggle--open');
        self.innerMenu.toggleClass('inner-menu--open')
        $('.page-overlay').toggleClass('is-open-menu');
        $('body').toggleClass('is-open-menu');
      });
    }
  });
}(jQuery));