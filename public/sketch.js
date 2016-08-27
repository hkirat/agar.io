// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/JXuxYMGe4KI
var WIDTH = 2000;
var HEIGHT = 2000;
var players = [];
var blobs = [];
var enemies = [];
var zoom = 1;
var blob = false;
var index = -1;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
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