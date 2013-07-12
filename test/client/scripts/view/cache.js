define([
    'jquery',
    'backbone',
    'hogan',
    '../model/data',
    '../collection/data',
    '../view/data',
    // '../view/simulationItem',
    'text!../../template/slot.html',
], function ($, Backbone, Hogan, DataModel, DataCollection, DataView, $$slot) {

    var ServerView = Backbone.View.extend({
        template: Hogan.compile($$slot),
        events: {
            'click #add-server-data': 'add'
        },
        tagName: 'section',
        id: 'cache',
        initialize: function () {

            var $el = this.$el;
            var collection = this.collection = new DataCollection;

            this.render();
            collection.on('add', function (model) {
                var view = new DataView({
                    model: model,
                    type: 'cache'    
                });
                $('ul', $el).append(view.el);
            });
            collection.on('remove', function (model) {
                model.trigger('destroy', model, collection);
            });

            for (key in localStorage) {
                if (/\/data\/\d/.test(key)) {
                    var data = JSON.parse(localStorage[key]);
                    collection.add(data);
                }
            }

            Backbone.on('trash', function () {
                localStorage.clear();
                collection.forEach(function (model) {
                    model.trigger('destroy', model, collection);
                });
                collection.reset();
            });

            Backbone.on('cache:set', function (data) {
                collection.add(data, {merge: true});
            });

            Backbone.on('cache:delete', function (id) {
                var model = collection.get(id);
                collection.remove(model);
            });
        },

        render: function () {
            this.$el.html(this.template.render({
                name: 'cache'
            }));
            return this;    
        },

        add: function () {
        }
    });

    return ServerView;
});