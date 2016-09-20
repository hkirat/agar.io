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

function compare(a,b) {
  if (a.r > b.r)
    return -1;
  if (a.r < b.r)
    return 1;
  return 0;
}

function renderLeaderboard() {
  var leaderboard = players.sort(compare);
  textStyle(BOLD);
  textSize(30 * blob.r/64);
  fill('white');
  var s = "LEADERBOARD";
  textStyle(NORMAL);
  textSize(16 * blob.r/64);
  textAlign(LEFT);
  text(s, blob.pos.x + (blob.r/64) * width/3, blob.pos.y - height/3 * (blob.r/64) - 20 * (blob.r/64));
  for(var i =0 ; i<min(leaderboard.length, 5); i++) {
    if(leaderboard[i].name) {
      var s = (i+1) + ". " +leaderboard[i].name;
      textSize(16 * blob.r/64);
      textAlign(LEFT);
      text(s, blob.pos.x + (blob.r/64) * width/3, blob.pos.y - height/3 * (blob.r/64) + i * 20 * (blob.r/64));
    }  
  }
}

function draw() {
  background(0);
  translate(width/2, height/2);
  if(!blob) {
    for(var i = 0 ; i<players.length; i++) {
      players[i].show();
    }
    for (var i = blobs.length-1; i >=0; i--) {
      blobs[i].show();
    }
    return;
  }
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
  textSize(blob.r/2);
  text(name, blob.pos.x - blob.r, blob.pos.y - 1 * blob.r);
  fill(0, 102, 153, 51);
  renderLeaderboard();
}