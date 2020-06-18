var ShowContent = {
  el: '.js-show-content',
  name: 'ShowContent',

  initialize: function () {
    this.btn = this.$('.js-show-content__btn');
    //this.hiddenContent = this.$('.js-show-content__content');
    var self = this;
  },

  events: {
    'click .js-show-content__btn': 'showContent'
  },


  showContent: function (e) {
    e.preventDefault();

    $(e.currentTarget).next('.js-show-content__content').slideToggle();
    this.btn.toggleClass('open');

    // Если скрытую информацию и кнопку-триггер невозможно разместить в общем контейнере
    // Или скрытая информация расположена не после кнопки-триггера
    if (this.$el.filter('[data-attribute]')) {
      this.dataTarget = $(e.currentTarget).attr('data-attribute');
      this.$el.find($('[data-target=' + this.dataTarget + ']')).slideToggle();
    }

  }
};

App.Control.install(ShowContent);
