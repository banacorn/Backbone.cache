var express = require('express');
var http = require('http');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

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

var tower = new EventEmitter;

var genData = function () {
    return {
        id: Math.floor(Math.random() * 10000),
        name: 'S' + Math.floor(Math.random() * 100000000)
    };
};
var data = [1, 1, 1, 1, 1, 1].map(genData);

//
//  HTTP
//

app.get('/data', function (req, res) {
    setTimeout(function () {
        res.json(data);
    }, 500);
});

app.post('/data', function (req, res) {
    var model = genData();
    model.name = req.body.name;
    data.push(model);
    tower.emit('*', 'add', model);
    res.json(model);
});

app.delete('/data/:id', function (req, res) {
    var id = req.params.id;
    data = data.filter(function (model) {
        return model.id != id;
    });
    tower.emit('*', 'remove', id);
    res.send();
});

//
//  SOCKET
//

// console.log(EventEmitter);
// console.log(EventEmitter.prototype);

io.on('connection', function (socket) {

    var towerListener = function (event, data) {
        console.log(event, data);
        socket.emit(event, data);
    };

    tower.on('*', towerListener);

    socket.on('get all', function () {
        socket.emit('get all', data);
    });

    socket.on('remove', function (id) {
        data = data.filter(function (model) {
            return model.id != id;
        });
        socket.emit('remove', id);
        socket.broadcast.emit('remove', id);
    });

    socket.on('add', function () {
        var model = genData();
        data.push(model);
        socket.emit('add', model);
        socket.broadcast.emit('add', model);
    });

    socket.on('modify', function (id) {
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].id == id) {
                data[i].name = data[i].name + '+';
                break;
            }
        }
    });

    socket.on('disconnect', function () {
        tower.removeListener('*', towerListener);
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
