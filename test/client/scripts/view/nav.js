define([
    'jquery',
    'backbone',
    '../model/data',
    '../collection/data',
    '../view/data',
    'text!../../template/nav.html',
], function ($, Backbone, DataModel, DataCollection, DataView, $$nav) {

    var NavView = Backbone.V.extend({
        template: $$nav,
        events: {
            'click #fetch': 'fetch',
            'click #sync': 'sync',
            'click #refresh': 'refresh'
        },
        tagName: 'nav',
        initialize: function () {
            this.render();
        },

        fetch: function () {
            Backbone.trigger('fetch');
        },

        sync: function () {
            Backbone.trigger('sync');
        },

        refresh: function () {
            Backbone.trigger('refresh');
        }

    });

    return NavView;
});