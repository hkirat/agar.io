var socket = io();
socket.on("initialiseBlobs", function(b) {
  for(var i =0 ; i<b.length; i++) {
    blobs.push(new Blob(b[i][0], b[i][1], 16));
  }
});

socket.on("initialiseEnemies", function(e) {
  for(var i = 0; i<e.length; i++) {
    players.push(new Blob(e[i].x, e[i].y, e[i].size, e[i].id, e[i].name));
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

socket.on("name", function(nm) {
  console.log("name is "+nm[0] + "  " + nm[1]);
  players[nm[0]].name = nm[1];
})
socket.on("position", function(value) {
  var in1 = players.map(function(e) { return e.id; }).indexOf(value[0]);
  if(in1 == -1)
    return;
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
  if(in1 == -1)
    return;
  var sum = PI * players[in1].r * players[in1].r + PI * players[in2].r * players[in2].r;
  players[in2].r = sqrt(sum / PI);
  if(id[1] == index) {
    socket.emit("disconnect");
    blob = false;
    var r = confirm("You were eaten. Restart Game?");
    if (r == true) {
      window.location = "./";
    }
  }
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
var name = prompt("Enter your name");
socket.emit("name", name);