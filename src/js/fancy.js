(function ($) {
  App.Widgets.FancyTabs = App.Widgets.FancyTabs || {};
  App.Widgets.FancyTabs = can.Control.extend({
    pluginName: 'appWidgetFancyTabs'
  }, {
    init: function () {
      this.element.fancybox({
        autoResize: true,
        wrapCSS: 'fancybox-tabs-modal',
        maxWidth: 966,
        padding:0,
        width: 966,
        height:'100%',
        helpers: {
          overlay: {
            css: {
              'background': 'rgba(27, 71, 105, 0.7)'
            }
          }
        }
      });
    }
  });
}(jQuery));
