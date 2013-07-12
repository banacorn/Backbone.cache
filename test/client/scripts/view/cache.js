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

            var $el = this.$el;

            Backbone.on('trash', function () {
                localStorage.clear();
            });

            Backbone.on('cache:set', function (data) {
                var model = new DataModel(data);
                var view = new DataView({
                    model: model,
                    type: 'cache'    
                });
                $('ul', $el).append(view.el);
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