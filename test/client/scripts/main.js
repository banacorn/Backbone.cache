require.config({
    shim: {
        io: []
    },
    paths: {
        jquery      : 'jam/jquery/dist/jquery',
        underscore  : 'jam/underscore/underscore',
        backbone    : 'jam/backbone/backbone',
        io          : '/socket.io/socket.io',
        hogan       : 'jam/hogan/hogan',
        cache       : 'cache'
    }
}); 

require([
    'jquery',
    'backbone',
    'hogan',
    'io',
    'cache',
    'view/nav',
    'view/client',
    'view/cache',
    'view/server'
], function (
    $, Backbone, Hogan, io, Cache,
    NavView,
    ClientView,
    CacheView,
    ServerView
) {

    var socket = io.connect();
    

    var App = Backbone.View.extend({
        initialize: function () {
            var navView = new NavView;
            var clientView = new ClientView;
            var cacheView = new CacheView;
            var serverView = new ServerView({
                socket: socket
            });
            $('article').before(navView.el);
            $('article').append(clientView.el);
            $('article').append(cacheView.el);
            $('article').append(serverView.el);
        },

        // enables history api pushstate
        // acient IE fallback to hashbang #!
        enablePushState: function () {
            Backbone.history.start({
                pushState: true
            });
        },
        
        // disables anchors
        // let the Router handle this
        disableAnchor: function () {
            $(document).on('click', 'a', function () {
                urn = $(this).attr('href');
                ROUTER.navigate(urn, true);
                return false;
            });
        },


        // disables form submits
        disableFormSubmit: function () {
            $(document).on('submit', 'form', function () {
                return false;
            });
        },
    });

    $(function () {
        var app = new App;
        app.enablePushState();
        app.disableAnchor();
        app.disableFormSubmit();
    });
})
