define([
    'backbone',
    'underscore'
], function (Backbone, _) {
    
    var DEBUG = true;

    var split = function (url) {
        var anchor = url.lastIndexOf('/');
        var root = url.substr(0, anchor);
        var id = parseInt(url.substr(anchor + 1), 10);

        return {
            root: root,
            id: id
        };
    }

    var storage = {
        set: function (url, data) {
            localStorage[url] = JSON.stringify(data);
            if (DEBUG) Backbone.trigger('cache:set', data);
        },
        get: function (url) {
            var data = localStorage[url];
            return data ? JSON.parse(localStorage[url]) : undefined;
        },
        delete: function (url) {
            delete localStorage[url];
            if (DEBUG) Backbone.trigger('cache:delete', split(url).id);
        },
        getCollection: function (url) {
            var ids = localStorage[url] && JSON.parse(localStorage[url]) || [];
            return ids.map(function (id) {
                return JSON.parse(localStorage[url + '/' + id]);
            });
        },
        setItem: function (url, data) {
            var splited = split(url);
            var id = splited.id;
            var root = splited.root;
            storage.set(url, data);
            stored = localStorage[root] && JSON.parse(localStorage[root]) || [];
            if (!_.contains(stored, id)) {
                stored.push(id);
                localStorage[root] = JSON.stringify(stored);
            }
        },
        deleteItem: function (url) {
            var splited = split(url);
            var id = splited.id;
            var root = splited.root;
            if (localStorage[root] !== undefined)
                localStorage[root] = JSON.stringify(_.without(JSON.parse(localStorage[root]), id))            
            storage.delete(url);
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
                    collection.add(storage.getCollection(url));

                    var onAdd = function (model) {
                        console.log('bind')
                        storage.setItem(model.url(), model.attributes);
                    };
                    var onChange = function (model) {
                        storage.setItem(model.url(), model.attributes);  
                    };
                    var onRemove = function (model, c, options) {
                        storage.deleteItem(url + '/' + model.id);  
                    };
                    this.listenTo(collection, 'add', onAdd);
                    this.listenTo(collection, 'change', onChange);
                    this.listenTo(collection, 'remove', onRemove);

                    var self = this;
                    this.listenTo(collection, 'sync', function () {
                        self.stopListening();
                    });
                }
                break;
            case 'create':
                break;
            case 'update':
                break;
            case 'delete':
                console.log('DELETE')
                break;
        }

        Backbone.remoteSync.apply(this, arguments);
        
    }
});