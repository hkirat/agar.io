var express = require('express');

var expressLayouts = require('express-ejs-layouts');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('port',(process.env.PORT||3001));
http.listen (app.get('port'),function(){
    console.log('listening to port number '+app.get('port'));
});
var ID = 0;
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.set('layout');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
function blob(x, y, size, id, name) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.id = id;
	this.name = name;
}
var blobs = [];
var players = [];
var width = 2000;
var height = 2000;
for (var i = 0; i < 200; i++) {
	var x = (Math.random()-.5) * width * 2;
	var y = (Math.random()-.5) * height * 2;
	blobs.push([x,y]);
}

io.on('connection', function(socket)
{
	socket.on("name", function(name) {
		ID++;
		var id = ID;
		players.push(new blob(0, 0, 64, id));
		console.log("connected to "+socket.id);
		socket.broadcast.emit("playerAdded", id);
		socket.emit("initialiseId",  id);
		socket.emit("initialiseEnemies", players);
		socket.emit("initialiseBlobs", blobs);
		var in1 = players.map(function(e) { return e.id; }).indexOf(id);
		if(in1 != -1) {
			players[in1].name = name;
			io.emit("name", [in1, name]);
		}
		socket.on("position", function(val) {
			var in1 = players.map(function(e) { return e.id; }).indexOf(id);
			if(in1==-1)
				return;
			players[in1].x = val[0];
			players[in1].y = val[1];
			players[in1].size = val[2];
			io.emit("position", [id, val[0], val[1]]);
		});
		socket.on("eat", function(i) {
			blobs.splice(i, 1);
			io.emit("eat", [id, i]);
		});
	    socket.on("disconnect", function() {
	    	
	    });
	    socket.on("ateUser", function(id) {
			var in1 = players.map(function(e) { return e.id; }).indexOf(id[1]);
			players.splice(in1, 1);
			io.emit("ateUser", id);
	    });
	});
});

setInterval(function() {
	if(blobs.length <= 500) {
		var x = (Math.random()-.5) * width * 2;
		var y = (Math.random()-.5) * height * 2;
		blobs.push([x, y]);
		io.emit("createBlob", blobs[blobs.length-1]);
	}
}, 500);