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
                .listenTo(this.model, 'destroy-view', function () {
                    self.remove();
                })
                .listenTo(this.model, 'destroy', function () {
                    self.remove();
                })
                .listenTo(this.model, 'change', function () {
                    self.render();
                })
            if (this.options.type === 'client') {
                this.listenTo(this.model, 'all', function (event) {
                    console.groupCollapsed('[' + event + ']');
                    console.groupEnd('[' + event + ']');
                })
            }


        },

        render: function () {
            this.$el.html(this.template.render(this.model.toJSON()));
            return this;    
        },

        delete: function () {
            switch (this.options.type) {
                case 'client':
                    this.model.destroy();
                    break;
                case 'cache':
                    Backbone.trigger('cache:delete', this.model.attributes.id);
                    this.trigger('destroy');
                    // localStorage dirty hack here
                    localStorage[':/data'] = JSON.stringify(_.without(JSON.parse(localStorage[':/data']), this.model.attributes.id));
                    delete localStorage['/data/' + this.model.attributes.id];
                    break;
                case 'server':
                    this.options.socket.emit('remove', this.model.id);
                    break;
            }
            this.remove();
        },

        select: function () {
            return false;
        },

        modify: function () {
            if (this.options.type === 'server')
                this.options.socket.emit('modify', this.model.id);
            this.model.set('name', this.model.get('name') + '+');
        //     var name = $('.data-name', this.$el).text();
        //     $('.data-name', this.$el).text(name + '+');
        }

    });

    return DataView;
});