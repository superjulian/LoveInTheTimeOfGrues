(function() {
"use strict";

var grueData;
var grueSpriteSheet;
var grueSprite;
var inGulp=false;
var xCo=0;
var yCo=0;
var facing="";
function init(board) {
    console.log("grue");
    grueData= {
	images: ["assets/img/circ-brown.png", "assets/img/circ-blue.png","assets/img/circ-green.png","assets/img/circ-red.png"],
    	frames: {width:64, height:64 },
	animations : {
	    idle: 0,
            walkLeft: 1,
	    walkRight: 2,
	    walkUp: 3,
	    walkDown: 2,
        }
    }
    grueSpriteSheet = new createjs.SpriteSheet(grueData);
    grueSprite = new createjs.Sprite(grueSpriteSheet, "idle");
    board.addChild(grueSprite);
}

function tick (){
	if (inGulp===false){
		if (Keyboard.state[Keyboard.LEFT]){
			xCo=-1;
			facing="LEFT";
			grueSprite.gotoAndPlay("walkLeft");
		}
		else if (Keyboard.state[Keyboard.RIGHT]){
			facing="RIGHT";
			xCo=1;
			grueSprite.gotoAndPlay("walkRight");
		}
		if (Keyboard.state[Keyboard.UP]){
			facing="UP";
			yCo=-1;
			grueSprite.gotoAndPlay("walkUp");
		}if (Keyboard.state[Keyboard.DOWN]){
			facing="DOWN";
			yCo=1;
			grueSprite.gotoAndPlay("walkDown");
		}
		if (Keyboard.state[Keyboard.SPACE]){
			gulp();
		}
		createjs.Tween.get(grueSprite).to({ x: grueSprite.x + (5 * xCo), y: grueSprite.y+(5 * yCo)  }, 5, createjs.Ease.linear).call(function() {xCo=0; yCo=0});	
	}
}
function gulp(){
	inGulp=true;
	var num=40;
	var deltaX;
	var deltaY;
	if (facing==="RIGHT"){
		deltaX=[num, num];
		deltaY=[-20, 20];
	}
	else if (facing==="LEFT"){
		deltaX=[-num, -num];
		deltaY=[-1*(num/2), num/2];
	}
	else if (facing==="UP"){
		deltaX=[num/2, -num/2];
		deltaY=[-num, -num];
	}
	else if (facing==="DOWN"){
		deltaX=[num/2, -num/2];
		deltaY=[num, num];
	}
	else{
		inGulp=false;
		return;
	}
	console.log(grueSprite.y);
	createjs.Tween.get(grueSprite)
		.to({ x: grueSprite.x + deltaX[0], y: grueSprite.y + deltaY[0]  }, 200, createjs.Ease.getPowInOut(2))
		.to( { x: grueSprite.x + deltaX[1], y: grueSprite.y + deltaY[1] }, 200, createjs.Ease.getPowInOut(2))
		.call(function() {xCo=0; yCo=0; inGulp=false});

	console.log(grueSprite.y);
}
window.Grue = {
	init: init,
	tick: tick
}

})();
