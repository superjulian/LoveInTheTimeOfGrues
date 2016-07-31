(function() {
"use strict";

var grueData;
var grueSpriteSheet;
var grueSprite;

function init(board) {
    grueData= {
	    images: ["assets/img/circ-brown.png"], //, "assets/img/circ-blue.png","assets/img/circ-green.png","assets/img/circ-red.png"],
    	frames: {width:64, height:64 },
    	animations : {
            redGreen: [0],
            blueBrown: [0]
        }
    }
    grueSpriteSheet = new createjs.SpriteSheet(grueData);
    grueSprite = new createjs.Sprite(grueSpriteSheet, "redGreen");
    board.addChild(grueSprite);
}

/* grueMove( int, int)
 *
 * takes 1, 0, -1
 */
function grueMove (xCo, yCo, grue){
	createjs.Tween.get(grueSprite).to({ x: grueSprite.x + (10 * xCo), y: grueSprite.y+(10 * yCo)  }, 50, createjs.Ease.linear);
}

window.Grue = {
    init: init,
	move: grueMove
}

})();
