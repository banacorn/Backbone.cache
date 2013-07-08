define([
    'jquery',
    'backbone',
    'hogan',
    '../model/data',
    '../collection/data',
    '../view/data',
    'text!../../template/nav.html',
], function ($, Backbone, Hogan, DataModel, DataCollection, DataView, $$nav) {

    var NavView = Backbone.View.extend({
        template: Hogan.compile($$nav),
        events: {
            'click #fetch': 'fetch',
            'click #sync': 'sync'
        },
        tagName: 'nav',
        initialize: function () {
            this.render();
        },

        render: function () {
            this.$el.html(this.template.render());
            return this;    
        },

        fetch: function () {
            Backbone.trigger('fetch');
        },

        sync: function () {
            Backbone.trigger('sync');
        }
    });

    return NavView;
});