// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/JXuxYMGe4KI

function Blob(x, y, r, id) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0,0);
  this.id  = id;
  this.update = function() {
    var xTrans = mouseX - width/2;
    var yTrans = mouseY - height/2;
    if(this.pos.x + this.r >= width && xTrans>0) {
      xTrans = 0;
    } 
    if(this.pos.x - this.r <= -1 * width && xTrans<0) {
      xTrans = 0;
    }
    if(this.pos.y + this.r >= height && yTrans>0) {
      yTrans = 0;
    }
    if(this.pos.y - this.r <= -1 * height && yTrans<0) {
      yTrans = 0;
    }
    var newvel = createVector(xTrans, yTrans);
    newvel.setMag(3 * 64/this.r);
    this.vel.lerp(newvel, 0.2);
    socket.emit("position", [this.pos.x + this.vel.x, this.pos.y + this.vel.y, this.r]);
  }

  this.eats = function(other) {
    var d = p5.Vector.dist(this.pos, other.pos);
    if (d < max(this.r ,  other.r) && this.r > other.r * 1.1) {
      return true;
    } else {
      return false;
    }
  }

  this.show = function() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
  }
}
