var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));

var data = [{
    id: 0,
    name: 'A'
}, {
    id: 1,
    name: 'B'
}, {
    id: 2,
    name: 'C'
}, {
    id: 3,
    name: 'D'
}];

app.get('/data', function (req, res) {
    res.json(data);
});


io.on('connection', function (socket) {
    socket.on('get all', function () {
        socket.emit('get all', data);
    });

    socket.on('remove', function (id) {
        data = data.filter(function (model) {
            return model.id != id;
        });
    })
});








// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server.listen(app.get('port'));

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
