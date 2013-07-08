define([
    'jquery',
    'backbone',
    'hogan',
    '../model/data',
    '../view/data',
    // '../collection/simulation',
    // '../view/simulationItem',
    'text!../../template/slot.html',
], function ($, Backbone, Hogan, DataModel, DataView, $$slot) {

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
            this.render();
            socket.emit('get all');
            socket.on('get all', function (data) {
                data.forEach(function (model) {
                    var dataModel = new DataModel(model);
                    var dataView = new DataView({
                        model: dataModel,
                        socket: socket
                    });
                    $('ul', $el).append(dataView.el);
                });
            });
            socket.on('add', function (model) {
                var dataModel = new DataModel(model);
                var dataView = new DataView({
                    model: dataModel,
                    socket: socket
                });
                $('ul', $el).append(dataView.el);
            });
        },

        render: function () {
            console.log(this.el);
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