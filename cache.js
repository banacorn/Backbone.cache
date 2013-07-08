define([
    'backbone',
    'underscore'
], function (Backbone, _) {
    
    var storage = {
        set: function (url, data) {
            localStorage[url] = JSON.stringify(data);
        },
        get: function (url) {
            var data = localStorage[url];
            return data ? JSON.parse(localStorage[url]) : undefined;
        },
        sadd: function (url, data) {
            var stored = Storage.get(url) || [];
            stored.push(data);
            Storage.set(url, _.uniq(stored));
        },
        del: function (url) {
            delete localStorage[url];
        }
    };

    // original Backbone.Sync
    Backbone.remoteSync = Backbone.sync;

    // // modified Backbone.Sync
    Backbone.sync = function (method, model, options) {

        // console.log(method, model, options);

        // localStorage support
        if (!localStorage) {
            Backbone.remoteSync.apply(this, arguments);
            return;
        }

        Backbone.remoteSync.apply(this, arguments);
        
    }
});