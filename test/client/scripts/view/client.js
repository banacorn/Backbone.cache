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
            'click #add-server-data': 'add'
        },
        tagName: 'section',
        id: 'client',
        initialize: function () {
            var collection = this.collection = new DataCollection;
            var self = this;
            this.render();

            Backbone.on('fetch', function () {
                console.log('fetch');
                collection.fetch();
            });
            collection.on('add', function (model) {
                Backbone.trigger('collection:add');
                model.view = new DataView({
                    model: model
                });
                $('ul', self.$el).append(model.view.el);
            });
            collection.on('remove', function (model) {
                Backbone.trigger('collection:remove');
                model.view.remove();
                console.log('remove', model.view);
            });
            collection.on('change', function (model) {
                Backbone.trigger('collection:change');
                model.view.render();
                console.log('change', model.view);
            });
        },

        render: function () {
            this.$el.html(this.template.render({
                name: 'client'
            }));
            return this;    
        },

        add: function () {
        }
    });

    return ClientView;
});