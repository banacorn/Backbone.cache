define([
    'backbone',
    '../model/data'
], function (Backbone, DataModel) {

    var Data = Backbone.Collection.extend({
        url: '/data',
        model: DataModel
    });

    return Data;
});