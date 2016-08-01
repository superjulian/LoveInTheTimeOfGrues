(function() {
"use strict";
var imgPfx="assets/img/Adventurer-";
var advSpriteSheet;

function Adventurer (){
        this.sprite= new createjs.Sprite(advSpriteSheet, "idleDown");

}
Adventurer.prototype.show= function (x, y, targ){
        this.sprite.x = x;
        this.sprite.y = y;
        this.moving = false;
        this.facing = "Down";
        targ.addChild(this.sprite);
}
Adventurer.prototype.move=function (x, y){
        var oldX = this.sprite.x;
        var oldY = this.sprite.y;
        var that= this.sprite;
        this.moving = true;
        if (x > oldX) {
                this.facing="Right";
        }
        else if (x < oldX) {
                this.facing="Left";
        }
        else if (y < oldY) {
                this.facing="Up";
        }
        else if (y > oldY) {
                this.facing="Down";
        }
        else {
                return;
        }
        this.sprite.gotoAndPlay("walk"+this.facing);
        createjs.Tween.get(this.sprite)
                .to({x: x, y: y}, 10 * Math.abs( x - oldX ) + 10 * Math.abs( y - oldY ), createjs.Ease.linear)
        .call(this.idle, [], this);
}
Adventurer.prototype.idle = function (){
        this.sprite.gotoAndPlay("idle"+this.facing);
        this.moving=false;
}
function init (board){
    var advData= {
    images: [
            imgPfx+"left1-lightON.png",
            imgPfx+"left1-lightOFF.png",
            imgPfx+"left2-lightON.png",
            imgPfx+"left2-lightOFF.png",
            imgPfx+"right1-lightON.png",
            imgPfx+"right1-lightOFF.png",
            imgPfx+"right2-lightON.png",
            imgPfx+"right2-lightOFF.png",
            imgPfx+"towards1-lightON.png",
            imgPfx+"towards1-lightOFF.png",
            imgPfx+"towards2-lightON.png",
            imgPfx+"towards2-lightOFF.png",
            imgPfx+"away1-lightON.png",
            imgPfx+"away2-lightOFF.png"
    ],
    frames : { width: 128, height: 128, count: 8},
    animations: {
            walkLeft: { frames: [0, 1] },
            walkRight: { frames: [2, 3] },
            walkDown: { frames: [4, 5] },
            walkUp: { frames: [6, 7] },

            idleLeft: { frames: [0] },
            idleRight: { frames: [2] },
            idleDown: { frames: [4] },
            idleUp: { frames: [6] },
    },
    framerate: 5
    }

    advSpriteSheet = new createjs.SpriteSheet(advData);
    //advSpriteSheet = new createjs.Sprite(advData, "idleDown");
    //board.addChild(advSprite);
}
window.Adventurer = {
        init: init,
        make: function (gate, targ){
               var adv= new Adventurer ();
               adv.gate=gate;
               adv.show(gate.x, gate.y, targ);
               console.log(gate.x, gate.y, gate);
               return adv;
        }
}
})();
