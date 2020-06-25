(function ($) {
  App.Widgets = App.Widgets || {};
  App.Widgets.LogosSlider = can.Control.extend({
    pluginName: 'appWidgetLogosSlider'
  }, {
    init: function () {
      this.$el.slick({
        dots: false,
        arrows:true,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 6,
              arrows: false,
              variableWidth:true,
            }
          }
        ]
      });
    }
  });
}(jQuery));

