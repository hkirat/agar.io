// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/JXuxYMGe4KI

var players = [];
var blobs = [];
var enemies = [];
var zoom = 1;
var blob = false;
socket.on("initialiseBlobs", function(b) {
  for(var i =0 ; i<b.length; i++) {
    blobs.push(new Blob(b[i][0], b[i][1], 16));
  }
});

socket.on("initialiseEnemies", function(e) {
  for(var i = 0; i<e.length; i++) {
    players.push(new Blob(e[i].x, e[i].y, e[i].size, e[i].id));
  }
  var in1 = players.map(function(e) { return e.id; }).indexOf(index);
  if(in1!=-1)
    blob = players[in1];
  else 
    throw "Error, Player not found";
});

socket.on("initialiseId", function(id) {
  index = id;
});

socket.on("position", function(value) {
  var in1 = players.map(function(e) { return e.id; }).indexOf(value[0]);
  players[in1].pos.x = value[1];
  players[in1].pos.y = value[2];
});

socket.on("playerAdded", function(id) {
  players.push((new Blob(0, 0, 64, id)));
});

socket.on("eat", function(index) {
  blobs.splice(index[1], 1);
  var in1 = players.map(function(e) { return e.id; }).indexOf(index[0]);
  var sum = PI * players[in1].r * players[in1].r + PI * 16 * 16;
  players[in1].r = sqrt(sum / PI);
});

socket.on("ateUser", function(id) {
  var in1 = players.map(function(e) { return e.id; }).indexOf(id[1]);
  var in2 = players.map(function(e) { return e.id; }).indexOf(id[0]);
  var sum = PI * players[in1].r * players[in1].r + PI * players[in2].r * players[in2].r;
  players[in2].r = sqrt(sum / PI);
  players.splice(in1, 1);
});

socket.on("deleteUser", function(id) {
  var in1 = players.map(function(e) { return e.id; }).indexOf(id);
  if(in1 != -1) {
      players.splice(in1, 1);
  }
})

socket.on("createBlob", function(b) {
   blobs.push(new Blob(b[0], b[1], 16));
});

function setup() {
  createCanvas(1000, 600);
}

function draw() {
  if(!blob) {
    return;
  }
  background(0);
  translate(width/2, height/2);
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  for (var i = blobs.length-1; i >=0; i--) {
    blobs[i].show();
    if (blob.eats(blobs[i])) {
      socket.emit("eat", i);
    }
  }
  for(var i = 0 ; i<players.length; i++) {
    var in1 = players.map(function(e) { return e.id; }).indexOf(index);
    if(i != in1) {
      if(blob.eats(players[i])) {
        socket.emit("ateUser", [index, players[i].id]);
      }
    }
  }
  blob.update();
  for(var i = 0 ; i<players.length; i++) {
    players[i].show();
  }
}