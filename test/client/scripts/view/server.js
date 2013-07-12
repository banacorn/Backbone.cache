define([
    'jquery',
    'backbone',
    'hogan',
    '../model/data',
    '../collection/data',
    '../view/data',
    // '../collection/simulation',
    // '../view/simulationItem',
    'text!../../template/slot.html',
], function ($, Backbone, Hogan, DataModel, DataCollection, DataView, $$slot) {

    var ServerView = Backbone.View.extend({
        template: Hogan.compile($$slot),
        events: {
            'click #add-server-data': 'add'
        },
        tagName: 'section',
        id: 'server',
        initialize: function () {
            var socket = this.options.socket;
            var $el = this.$el;
            var collection = this.collection = new DataCollection;
            this.render();
            socket.on('get all', function (data) {
                data.forEach(function (model) {
                    var dataModel = new DataModel(model);
                    collection.add(dataModel);
                    var dataView = new DataView({
                        model: dataModel,
                        socket: socket,
                        type: 'server'
                    });
                    $('ul', $el).append(dataView.el);
                });
            });
            socket.on('add', function (model) {
                var dataModel = new DataModel(model);
                collection.add(dataModel);
                var dataView = new DataView({
                    model: dataModel,
                    socket: socket,
                    type: 'server'
                });
                $('ul', $el).append(dataView.el);
            });
            socket.on('remove', function (id) {
                var model = collection.get(id);
                if (model) {
                    collection.remove(model);
                    model.trigger('destroy');
                }
            });
            socket.on('modify', function (data) {
                var model = collection.get(data.id);
                if (model) {
                    model.set(data);
                }
            });
            socket.emit('get all');
        },

        render: function () {
            this.$el.html(this.template.render({
                name: 'server'
            }));
            return this;    
        },

        add: function () {
            this.options.socket.emit('add');
        }
    });

    return ServerView;
});