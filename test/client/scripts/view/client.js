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

    var ClientView = Backbone.View.extend({
        template: Hogan.compile($$slot),
        events: {
            'click #add-client-data': 'add'
        },
        tagName: 'section',
        id: 'client',
        initialize: function () {
            var collection = this.collection = new DataCollection;
            var self = this;
            this.render();

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
            
            Backbone.on('refresh', function () {
                collection.forEach(function (model) {
                    model.trigger('destroy');
                })
                collection.reset();
            });


            collection.on('all', function (event) {
                console.groupCollapsed(event);
                console.groupEnd(event);
            })
        },

        render: function () {
            this.$el.html(this.template.render({
                name: 'client',
                add: 'true'
            }));
            return this;    
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