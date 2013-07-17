define([
    'jquery',
    'backbone',
    // 'hogan',
    '../model/data',
    '../collection/data',
    '../view/data',
    // '../view/simulationItem',
    'text!../../template/slot.html',
], function ($, Backbone, DataModel, DataCollection, DataView, $$slot) {

    var ClientView = Backbone.V.extend({
        template: $$slot,
        events: {
            'click #add-client-data': 'add'
        },
        tagName: 'section',
        id: 'client',
        initialize: function () {
            var collection = this.collection = new DataCollection;
            var self = this;
            this.render({
                name: 'client',
                add: true
            });

            Backbone.on('fetch', function () {
                collection.fetch();
            });

            Backbone.on('sync', function () {
                collection.forEach(function (model) {
                    if (model.isRaw())
                        model.save();
                });
            });

            collection.on('add', function (model) {
                var view = new DataView({
                    type: 'client',
                    model: model
                });
                $('ul', self.$el).append(view.el);
            });

            collection.on('remove', function (model) {
                model.trigger('destroy', model, collection);
            });

            Backbone.on('refresh', function () {
                collection.forEach(function (model) {
                    model.trigger('destroy-view');
                })
                collection.reset();
            });


            collection.on('all', function (event) {
                console.groupCollapsed(event);
                console.groupEnd(event);
            });
        },

        add: function () {
            var dataModel = new DataModel({
                name: 'B-' + Math.floor(Math.random() * 100000000)
            });
            var dataView = new DataView({
                model: dataModel
            });
            this.collection.add(dataModel);
        }
    });

    return ClientView;
});