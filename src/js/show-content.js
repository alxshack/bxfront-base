(function ($) {
  App.Widgets = App.Widgets || {};
  App.Widgets.ShowContent = can.Control.extend({
    pluginName: 'appWidgetShowContent'
  }, {
    init: function () {
      this.btn = this.element.find('.js-show-content__btn');
      var self = this;

      this.btn.on('click', function (evt) {
        evt.preventDefault();

        $(evt.currentTarget).next('.js-show-content__content').slideToggle();
        self.btn.toggleClass('open');

        // Если скрытую информацию и кнопку-триггер невозможно разместить в общем контейнере
        // Или скрытая информация расположена не после кнопки-триггера
        if (self.element.filter('[data-attribute]')) {
          this.dataTarget = $(evt.currentTarget).attr('data-attribute');
          self.element.find($('[data-target=' + this.dataTarget + ']')).slideToggle();
        }
      });
    }
  });
}(jQuery));
