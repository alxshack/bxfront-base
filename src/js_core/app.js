var App = _.create(Object.prototype, {
    Views: _.create(Object.prototype, {}),
    Plugins: _.create(Object.prototype, {}),
    Control: {
        instance: function (options) {
            Backbone.View.call(this, options);
        },
        Delayed: {},
        install: function (options) {
            Backbone.$(function () {
                var pluginName = options.name;
                if (!_.isEmpty(App.Plugins[pluginName])) {
                    console.error('Application error: "' + pluginName + '" plugin is already define.');
                }
                App.Plugins[pluginName] = options;
                if (!_.isEmpty(App.Control.Delayed[pluginName])) {
                    _.each(App.Control.Delayed[pluginName], function (options, index) {
                        App.Control.extend(pluginName, options);
                        App.Control.Delayed[pluginName].splice(index, 1);
                    });
                }
                if (!Backbone.$(options.el).length) {
                    return false;
                }
                App.Views[pluginName] = [];
                var objArr = [];
                Backbone.$(options.el).each(function () {
                    objArr.push(App.Control.construct(Backbone.$(this), options));
                });
                App.Views[pluginName] = objArr;
                return App.Views[pluginName];
            });
        },
        construct: function ($el, options) {
            var vOpts = _.extend(_.clone(options), {el: $el});
            var CAppViewInstance = this.instance.extend(vOpts);
            var CAppView = new CAppViewInstance;
            CAppView.initializeEx.apply(CAppView, arguments);
            $el.attr('cid', CAppView.cid);
            $el.addClass(options.name + 'Control');
            return CAppView;
        },
        extend: function (pluginName, options) {
            Backbone.$(function () {
                if (_.isEmpty(App.Plugins[pluginName])) {
                    App.Control.Delayed[pluginName] = App.Control.Delayed[pluginName] || [];
                    App.Control.Delayed[pluginName].push(options);
                    setTimeout(function () {
                        if (!_.isEmpty(App.Control.Delayed[pluginName])) {
                            _.each(App.Control.Delayed[pluginName], function (options) {
                                console.error('Application error: can not install "' + options.name + '" plugin. Extendable "' + pluginName + '" plugin is not define.');
                            });
                        }
                    }, 3300);
                    return;
                }
                App.Control.install(_.extend(_.clone(App.Plugins[pluginName]), options));
            });
        }
    }
});

var Fx = _.create(Object.prototype);

_.extend(App.Control.instance.prototype, Backbone.View.prototype, {
    initialize: function () { },
    initializeEx: function () { }
});

App.Control.instance.extend = Backbone.View.extend;

Backbone.$(function () {
    Backbone.$(document).ajaxComplete(function (event, request, settings) {
        _.each(App.Plugins, function (options) {
            Backbone.$(options.el).not('.' + options.name + 'Control').each(function () {
                App.Views[options.name] = App.Views[options.name] || [];
                App.Views[options.name].push(App.Control.construct(Backbone.$(this), options));
            });
        });
    });
});

