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

            collection.on('add', function (model) {
                var view = new DataView({
                    model: model,
                    type: 'cache'    
                });
                $('ul', $el).append(view.el);
            });

            Backbone.on('trash', function () {
                localStorage.clear();
            });

            Backbone.on('cache:set', function (data) {
                collection.add(data);
            });

            Backbone.on('cache:delete', function (id) {
                var model = collection.get(id);
                collection.remove(model);
                console.log(collection.length);
            });
            this.render();
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