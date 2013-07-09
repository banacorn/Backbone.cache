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

            var self = this;
            this.render();
            this
                .listenTo(this.model, 'destroy', function () {
                    self.remove();
                })
                .listenTo(this.model, 'change', function () {
                    self.render();
                });
        },

        render: function () {
            this.$el.html(this.template.render(this.model.toJSON()));
            return this;    
        },

        delete: function () {
            if (this.options.onServer)
                this.options.socket.emit('remove', this.model.id);
            else
                this.model.destroy();
            this.remove();
        },

        select: function () {
            return false;
        },

        modify: function () {
            if (this.options.onServer)
                this.options.socket.emit('modify', this.model.id);
            this.model.set('name', this.model.get('name') + '+');
        //     var name = $('.data-name', this.$el).text();
        //     $('.data-name', this.$el).text(name + '+');
        }

    });

    return DataView;
});