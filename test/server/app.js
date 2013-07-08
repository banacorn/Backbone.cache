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

var dataIndex = 1;
var data = [];
var dataName = function (index) {
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var name = "";
    var i = index;
    do {
        name = characters[(i - 1) % 26] + name;
        i = Math.floor((i - 1) / 26);
    } while (i != 0);
    return name;
};

for (var i = 0; i < 6; i++) {
    data.push({
        id: dataIndex,
        name: dataName(dataIndex)
    });
    dataIndex++;
}


app.get('/data', function (req, res) {
    setTimeout(function () {
        res.json(data);

    }, 500);
});



app.post('/data', function (req, res) {
    var model = {
        id: dataIndex,
        name: req.body.name
    };
    data.push(model);
    res.json(model);
    tower.emit('*', 'add', model);
    dataIndex++;
});




io.on('connection', function (socket) {

    tower.on('*', function (event, data) {
        console.log(event, data);
        socket.emit(event, data);
    });


    socket.on('get all', function () {
        socket.emit('get all', data);
    });

    socket.on('remove', function (id) {
        data = data.filter(function (model) {
            return model.id != id;
        });
    });

    socket.on('add', function () {
        var model = {
            id: dataIndex,
            name: dataName(dataIndex)
        };
        data.push(model);
        dataIndex++;
        socket.emit('add', model);
    });

    socket.on('modify', function (id) {
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].id == id) {
                data[i].name = data[i].name + '+';
                break;
            }
        }
    });

});








// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server.listen(app.get('port'));

// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
