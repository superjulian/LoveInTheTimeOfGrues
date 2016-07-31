(function() {
"use strict";

var grueData;
var grueSpriteSheet;
var grueSprite;
var inGulp=false;
var xCo=0;
var yCo=0;
var facing="";
var idle=true;
function init(board) {
    console.log("grue");
    grueData= {
    images: [
            "assets/img/Grue-left1.png",
            "assets/img/Grue-left2.png",
            "assets/img/Grue-right1.png",
            "assets/img/Grue-right2.png",
            "assets/img/Grue-towards1.png",
            "assets/img/Grue-towards2.png",
            "assets/img/Grue-away1.png",
            "assets/img/Grue-away2.png",
            "assets/img/Grue-left-eating.png",
            "assets/img/Grue-right-eating.png",
            "assets/img/Grue-towards-eating.png",
            "assets/img/Grue-away-eating.png",
        ],
    frames: [ 
            [0, 0, 64, 64, 0],
            [0, 0, 64, 64, 1],
            [0, 0, 64, 64, 2],
            [0, 0, 64, 64, 3],
            [0, 0, 64, 64, 4],
            [0, 0, 64, 64, 5],
            [0, 0, 64, 64, 6],
            [0, 0, 64, 64, 7],

            [0, 0, 128, 128, 8],
            [0, 0, 128, 128, 9],
            [0, 0, 128, 128, 10],
            [0, 0, 128, 128, 11],
            //width:64, height:64, count: 12 
    ],
    animations : {
            walkLeft: { frames: [0, 1] },
            walkRight: { frames: [2, 3] },
            walkDown: { frames: [4, 5] },
            walkUp: { frames: [6, 7] },

            idleLeft: { frames: [0] },
            idleRight: { frames: [2] },
            idleDown: { frames: [4] },
            idleUp: { frames: [6] },

            eatLeft: { frames: [8] },
            eatRight: { frames: [9] },
            eatDown: { frames: [10] },
            eatUp: { frames: [11] }
        },
        framerate: 5
    }

    grueSpriteSheet = new createjs.SpriteSheet(grueData);
    grueSprite = new createjs.Sprite(grueSpriteSheet, "idleDown");
    board.addChild(grueSprite);
}

function tick (){
	if (inGulp===false){
                if (Keyboard.state[Keyboard.SPACE]){
                        gulp();
                        idle=true;
                }
                else if (Keyboard.state[Keyboard.LEFT]){
                        xCo=-1;
                        if (facing!="Left" || idle){
			        facing="Left";
                                grueSprite.gotoAndPlay("walkLeft");
                                idle=false;
                        }
		}
		else if (Keyboard.state[Keyboard.RIGHT]){
                        xCo=1;
                        if (facing!="Right"|| idle){
			        grueSprite.gotoAndPlay("walkRight");
                                facing="Right";
                                idle=false;
                        }
		}
		else if (Keyboard.state[Keyboard.UP]){
                        yCo=-1;
                        if (facing!="Up"|| idle){
                                facing="Up";
			        grueSprite.gotoAndPlay("walkUp");
                                idle=false;
                        }
		}else if (Keyboard.state[Keyboard.DOWN]){
                        yCo=1;
                        if (facing!="Down" || idle){
                                facing="Down";
                                grueSprite.gotoAndPlay("walkDown");
                                idle=false;
                        }
		}
                else {
                   grueSprite.gotoAndPlay("idle"+facing);
                   idle=true;
                }
		createjs.Tween.get(grueSprite).to({ x: grueSprite.x + (7 * xCo), y: grueSprite.y+(7 * yCo)  }, 3, createjs.Ease.linear).call(function() {xCo=0; yCo=0});
	}

}


function gulp(){
	inGulp=true;
        var num=30;
        var rotation=0;
        var deltaX;
	var deltaY;
	if (facing==="Right"){
		deltaX=[4*num, 0];
                deltaY=[-4*num, 4*num];
                rotation=90;
	}
	else if (facing==="Left"){
		deltaX=[-4*num, 0];
		deltaY=[-num, num];
                rotation=-90;
	}
	else if (facing==="Up"){
		deltaX=[0, 0];
		deltaY=[-2*num, -2*num];
                grueSprite.gotoAndPlay("eat"+facing);
	}
	else if (facing==="Down"){
		deltaX=[0, 0];
		deltaY=[2*num, 2*num];
                grueSprite.gotoAndPlay("eat"+facing);
	}
	else{
		inGulp=false;
		return;
        }

        grueSprite.rotation=-rotation/3;
        deltaX[0]=deltaX[0]+grueSprite.x;
        deltaX[1]=deltaX[1]+deltaX[0];
	deltaY[0]=deltaY[0]+grueSprite.y;
        deltaY[1]=deltaY[1]+deltaY[0];
        createjs.Tween.get(grueSprite)
                .to({ x: deltaX[0], y: deltaY[0], rotation: rotation  }, 250, createjs.Ease.getPowInOut(2))
                .call(function() {grueSprite.gotoAndPlay("eat"+facing)})
		.to( { x: deltaX[1], y: deltaY[1]  }, 150, createjs.Ease.getPowInOut(2))
                .call(function() {
                        xCo=0; 
                        yCo=0; 
                        grueSprite.gotoAndPlay("idle"+facing);
                        createjs.Tween.get(grueSprite).to( {rotation: 0}, 20, createjs.Ease.getPowInOut(2));
                        inGulp=false});
                
}
window.Grue = {
    init: init,
    tick: tick,
    show: function(x, y, board) {
        grueSprite.x = x;
        grueSprite.y = y;
        board.addChild(grueSprite);
    },
    position: function() {
        return {x : grueSprite.x, y : grueSprite.y};
    }
}

})();
