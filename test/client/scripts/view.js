define([
    'jquery',
    'backbone',
    'hogan'
], function ($, Backbone, Hogan) {

    Backbone.V = Backbone.View.extend({
        render: function (data) {
            if (this.template) {
                var template = Hogan.compile(this.template);
                this.$el.html(template.render(data));
            }
            return this;    
        },

        renderModel: function () {
            this.render(this.model.toJSON());
        }
    });
});