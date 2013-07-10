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
        id: 'cache',
        initialize: function () {

            Backbone.on('trash', function () {
                localStorage.clear();
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