define([
    'jquery',
    'backbone',
    'hogan',
    '../model/data',
    '../view/data',
    // '../collection/simulation',
    // '../view/simulationItem',
    // 'text!../../templates/home.html',
], function ($, Backbone, Hogan, DataModel, DataView) {

    var ServerView = Backbone.View.extend({
        tagName: 'ul',
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
                    $el.append(dataView.el);
                });
            });

        },

        render: function () {
            console.log(this.el);
            this.$el.html();
            return this;    
        }

    });

    return ServerView;
});