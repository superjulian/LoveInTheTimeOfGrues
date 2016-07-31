(function() {
"use strict";

var grueData;
var grueSpriteSheet;
var grueSprite;

function init(board) {
    grueData= {
	    images: [
            "assets/img/Grue-left1.png",
            "assets/img/Grue-left2.png",
            "assets/img/Grue-right1.png",
            "assets/img/Grue-right2.png",
            "assets/img/Grue-towards1.png",
            "assets/img/Grue-towards2.png",
            "assets/img/Grue-away1.png",
            "assets/img/Grue-away2.png"
        ],
    	frames: { width:64, height:64, count: 8 },
    	animations : {
            walk_left: { frames: [0, 1] },
            walk_right: { frames: [2, 3] },
            walk_towards: { frames: [4, 5] },
            walk_away: { frames: [6, 7] }
        }
    }
    grueSpriteSheet = new createjs.SpriteSheet(grueData);
    grueSprite = new createjs.Sprite(grueSpriteSheet);
}

/* grueMove( int, int)
 *
 * takes 1, 0, -1
 */
function grueMove (xCo, yCo, grue){
    if (xCo == 1) {
        grueSprite.gotoAndPlay("walk_right");
    } else if (xCo == -1) {
        grueSprite.gotoAndPlay("walk_left");
    } else if (yCo == -1) {
        grueSprite.gotoAndPlay("walk_away");
    } else if (yCo == 1) {
        grueSprite.gotoAndPlay("walk_towards");
    }
	createjs.Tween.get(grueSprite).to({ x: grueSprite.x + (10 * xCo), y: grueSprite.y+(10 * yCo)  }, 50, createjs.Ease.linear);
}

window.Grue = {
    init: init,
	move: grueMove,
    show: function(x, y, board) {
        grueSprite.x = x;
        grueSprite.y = y;
        board.addChild(grueSprite);
    }
}

})();
