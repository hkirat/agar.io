// Daniel Shiffman
// http://codingrainbow.com
// http://patreon.com/codingrainbow
// Code for: https://youtu.be/JXuxYMGe4KI
var f = 0;
function Blob(x, y, r, id, name) {
  this.pos = createVector(x, y);
  this.r = r;
  this.vel = createVector(0,0);
  this.id  = id;
  this.name = name;
  this.color = color(random()*255, random()*255, random()*255);
  this.update = function() {
    var transL = this.setTranslation();
    var xTrans = transL[0]
    var yTrans = transL[1];
    var newvel = createVector(xTrans, yTrans);
    if(newvel.x!=0 || newvel.y !=0) {
      if(keyIsDown(SHIFT)) {
          newvel.setMag(6 * 64/this.r);
      } else {
        newvel.setMag(3 * 64/this.r);
      }
    }
    this.vel.lerp(newvel, 0.2);
    if(f==0) 
      socket.emit("position", [this.pos.x + this.vel.x, this.pos.y + this.vel.y, this.r]);
    f++;
    f%=3;
  }

  this.setTranslation = function() {
    if((this.pos.x + this.r >= WIDTH && xTrans>0) || (this.pos.x - this.r <= -1 * WIDTH && xTrans<0)) {
      xTrans = 0;
    } else {
      xTrans = mouseX - width/2;
    }
    if((this.pos.y + this.r >= HEIGHT && yTrans>0) || (this.pos.y - this.r <= -1 * HEIGHT && yTrans<0)) {
      yTrans = 0;
    } else {
      yTrans = mouseY - height/2;
    }
    return [xTrans, yTrans];
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
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    if(this.name) {
      textSize(this.r/2);
      text(this.name, this.pos.x - this.r, this.pos.y - 1 * this.r);
      fill(0, 102, 153, 51);
    }
  }
}
