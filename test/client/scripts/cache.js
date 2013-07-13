define([
    'backbone',
    'underscore'
], function (Backbone, _) {
    
    var DEBUG = true;

    var split = function (url) {
        var anchor = url.lastIndexOf('/');
        var indiceKey = ':' + url.substr(0, anchor);
        var id = parseInt(url.substr(anchor + 1), 10);

        return {
            indiceKey: indiceKey,
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
            var indiceKey = ':' + url;
            var indice = localStorage[indiceKey] && JSON.parse(localStorage[indiceKey]) || [];
            return indice.map(function (id) {
                return JSON.parse(localStorage[url + '/' + id]);
            });
        },
        setItem: function (url, data) {
            var splited = split(url);
            var id = splited.id;
            var indiceKey = splited.indiceKey;
            storage.set(url, data);
            indice = localStorage[indiceKey] && JSON.parse(localStorage[indiceKey]) || [];
            if (!_.contains(indice, id)) {
                indice.push(id);
                localStorage[indiceKey] = JSON.stringify(indice);
            }
        },
        deleteItem: function (url) {
            var splited = split(url);
            var id = splited.id;
            var indiceKey = splited.indiceKey;
            if (localStorage[indiceKey] !== undefined)
                localStorage[indiceKey] = JSON.stringify(_.without(JSON.parse(localStorage[indiceKey]), id))            
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
                collection.add(storage.getCollection(url));

                var onAdd = function (model) {
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
                break;
            case 'create':
                // storage.setItem()
                this.listenToOnce(model, 'sync', function () {
                    storage.setItem(model.url(), model.attributes)
                })
                break;
            case 'update':
                break;
            case 'delete':
                storage.deleteItem(url);  
                break;
        }

        Backbone.remoteSync.apply(this, arguments);
        
    }
});