(function ($) {
  App.Widgets.TabList = App.Widgets.TabList || {};
  App.Widgets.TabList = can.Control.extend({
    pluginName: 'appWidgetTabList'
  }, {
    init: function () {
      this.tab = this.element.find('.js-tabs__tab');
      this.tabsList = this.element.find('.js-tabs__list');
      this.tabContent = this.element.find('.js-tabs__content');
      var self = this;

      this.tab.on('click', function (evt) {
        self.tab.removeClass('is-active');
        var target = evt.currentTarget;
        $(evt.currentTarget).addClass('is-active');
        self.targetId = $(evt.currentTarget).data('id');
        self.tabContent.removeClass('is-active');
        $('#' + self.targetId).addClass('is-active');
      });
    }
  });
}(jQuery));