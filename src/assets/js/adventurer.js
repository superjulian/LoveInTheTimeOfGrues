(function() {
"use strict";
var imgPfx="assets/img/Adventurer-";
var advSpriteSheet;

function Adventurer (){
        this.sprite= new createjs.Sprite(advSpriteSheet, "idleDown");

}
Adventurer.prototype.show= function (x, y, board){
        this.sprite.x = x;
        this.sprite.y = y;
        this.moving = false;
        this.facing = "Down";
        board.addChild(this.sprite);
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
            imgPfx+"left1.png",
            imgPfx+"left2.png",
            imgPfx+"right1.png",
            imgPfx+"right2.png",
            imgPfx+"towards1.png",
            imgPfx+"towards2.png",
            imgPfx+"away1.png",
            imgPfx+"away2.png"
    ],
    frames : { width: 64, height: 64, count: 8},
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
        make: Adventurer 

}
})();
