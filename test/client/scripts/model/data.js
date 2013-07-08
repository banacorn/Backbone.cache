define([
    'backbone'
    // '../collection/simulation',
    // '../view/simulationItem',
    // 'text!../../templates/home.html',
], function (Backbone) {

    var Data = Backbone.Model.extend({
        default: {
            name: '_'
        }
    });

    return Data;
});