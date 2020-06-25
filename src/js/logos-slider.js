var LogosSlider = {
  el: '.js-logos-slider',
  name: 'LogosSlider',

  initialize: function () {
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
};

App.Control.install(LogosSlider);