define([
    'jquery',
    'backbone',
    'hogan',
    '../model/data',
    'text!../../template/data.html',
], function ($, Backbone, Hogan, DataModel, $$data) {

    var DataView = Backbone.View.extend({
        template: Hogan.compile($$data),
        tagName: 'li',
        className: 'data',

        events: {
            'click .data-remove': 'delete'
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.template.render(this.model.toJSON()));
            return this;    
        },

        delete: function () {
            this.options.socket.emit('remove', this.model.id);
            this.remove();
        }

    });

    return DataView;
});