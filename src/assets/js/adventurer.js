(function() {
"use strict";
var imgPfx="assets/img/Adventurer-";
var advSpriteSheet;

function Adventurer (){
        this.sprite= new createjs.Sprite(advSpriteSheet, "idleDownOn");

}
Adventurer.prototype.show= function (x, y, targ){
        this.sprite.x = x;
        this.sprite.y = y;
        this.moving = false;
        this.facing = "Down";
        this.light="On";
        targ.addChild(this.sprite);
}
Adventurer.prototype.move=function (x, y){
        this.light();
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
        this.sprite.gotoAndPlay("walk"+this.facing+this.light);
        createjs.Tween.get(this.sprite)
                .to({x: x, y: y}, 10 * Math.abs( x - oldX ) + 10 * Math.abs( y - oldY ), createjs.Ease.linear)
        .call(this.idle, [], this);
}
Adventurer.prototype.lightSwitch = function (){
        if (this.light ==="On"){
                this.light="Off";
        }
        else{
                this.light="On";
        }
                
}
Adventurer.prototype.idle = function (){
        this.sprite.gotoAndPlay("idle"+this.facing+this.light);
        this.moving=false;
}
function init (board){
    var advData= {
    images: [
            imgPfx+"left1-lightON.png", 
            imgPfx+"left2-lightON.png", 
            imgPfx+"right1-lightON.png", 
            imgPfx+"right2-lightON.png", 
            imgPfx+"towards1-lightON.png", 
            imgPfx+"towards2-lightON.png",
            imgPfx+"away1-lightON.png",
            imgPfx+"away2-lightON.png",

            
            imgPfx+"left1-lightOFF.png",
            imgPfx+"left2-lightOFF.png",
            imgPfx+"right1-lightOFF.png",
            imgPfx+"right2-lightOFF.png",
            imgPfx+"towards1-lightOFF.png",
            imgPfx+"towards2-lightOFF.png",
            imgPfx+"away1-lightOFF.png",
            imgPfx+"away2-lightOFF.png",
    ],
    frames : { width: 128, height: 128, count: 8},
    animations: {
            walkLeftOn: { frames: [0, 1] },
            walkRightOn: { frames: [2, 3] },
            walkDownOn: { frames: [4, 5] },
            walkUpOn: { frames: [6, 7] },

            walkLeftOff: { frames: [8, 9] },
            walkRightOff: { frames: [10, 11] },
            walkDownOff: { frames: [12, 13] },
            walkUpOff: { frames: [14, 15] },

            idleLeftOn: { frames: [0] },
            idleRightOn: { frames: [2] },
            idleDownOn: { frames: [4] },
            idleUpOn: { frames: [6] },

            idleLeftOff: { frames: [8] },
            idleRightOff: { frames: [10] },
            idleDownOff: { frames: [12] },
            idleUpOff: { frames: [14] }
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
