define([
    'backbone',
    'underscore'
    // '../collection/simulation',
    // '../view/simulationItem',
    // 'text!../../templates/home.html',
], function (Backbone, _) {

    var Data = Backbone.Model.extend({
        default: {
            name: '_'
        },

        isRaw: function () {
            var changedAttributes = this.changedAttributes() || {};
            delete changedAttributes.id;
            return this.isNew() || !_.isEmpty(changedAttributes);
        }
    });

    return Data;
});