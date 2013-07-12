define([
    'backbone',
    'underscore'
], function (Backbone, _) {
    
    var DEBUG = true;

    var storage = {
        set: function (url, data) {
            localStorage[url] = JSON.stringify(data);
            if (DEBUG) Backbone.trigger('cache:set', data);
        },
        get: function (url) {
            var data = localStorage[url];
            return data ? JSON.parse(localStorage[url]) : undefined;
        },
        del: function (url) {
            delete localStorage[url];
        },
        getCollection: function (url) {

        },
        getItem: function (url) {

        },
        setItem: function (url, data) {
            var anchor = url.lastIndexOf('/');
            var root = url.substr(0, anchor);
            var id = parseInt(url.substr(anchor + 1), 10);
            storage.set(url, data);
            stored = localStorage[root] && JSON.parse(localStorage[root]) || [];
            if (!_.contains(stored, id)) {
                stored.push(id);
                localStorage[root] = JSON.stringify(stored);
            }
        },
        delItem: function (url) {

        }
    };

    // original Backbone.Sync
    Backbone.remoteSync = Backbone.sync;

    // // modified Backbone.Sync
    Backbone.sync = function (method, object, options) {

        var url = (typeof object.url === 'function') ? object.url() : object.url;
        if (object instanceof Backbone.Collection) {
            var type = 'collection';
            var collection = object;
        } else {
            var type = 'model';
            var model = object;
        }
        console.log(method, type);

        // localStorage support
        if (!localStorage) {
            Backbone.remoteSync.apply(this, arguments);
            return;
        }

        switch (method) {
            case 'read':
                if (type == 'model') {

                } else {
                    collection.on('add', function (model) {
                        storage.setItem(model.url(), model.attributes);
                        // console.log(model.url(), model.attributes)
                        // collection.off('sync')
                    });
                    collection.on('sync', function (model) {
                        collection.off('add');
                        collection.off('sync');
                    });
                    // storage.set
                }
                break;
            case 'create':
                break;
            case 'update':
                break;
            case 'delete':
                break;
        }

        Backbone.remoteSync.apply(this, arguments);
        
    }
});