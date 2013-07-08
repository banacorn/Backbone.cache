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
            'click .data-remove': 'delete',
            'click': 'modify',
            'click .data-id': 'select',
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
        },

        select: function () {
            return false;
        },

        modify: function () {
            this.options.socket.emit('modify', this.model.id);
            var name = $('.data-name', this.$el).text();
            $('.data-name', this.$el).text(name + '+');
        }

    });

    return DataView;
});