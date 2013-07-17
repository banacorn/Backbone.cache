define([
    'jquery',
    'backbone',
    '../model/data',
    '../collection/data',
    '../view/data',
    'text!../../template/slot.html',
], function ($, Backbone, DataModel, DataCollection, DataView, $$slot) {

    var ServerView = Backbone.V.extend({
        template: $$slot,
        events: {
            'click #add-server-data': 'add',
            'click #trash-cache': 'trash'
        },
        tagName: 'section',
        id: 'cache',
        initialize: function () {

            var $el = this.$el;
            var collection = this.collection = new DataCollection;

            this.render({
                name: 'cache',
                trash: true
            });
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

            Backbone.on('cache:set', function (data) {
                collection.add(data, {merge: true});
            });

            Backbone.on('cache:delete', function (id) {
                var model = collection.get(id);
                collection.remove(model);
            });
        },

        trash: function () {
            localStorage.clear();
            this.collection.forEach(function (model) {
                model.trigger('destroy-view');
            });
            this.collection.reset();
        }
    });

    return ServerView;
});