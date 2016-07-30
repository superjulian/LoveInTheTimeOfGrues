(function() {
"use strict";	
var grueData;
var grueSpriteSheet;
var grueSprite; 
function init() {
    console.debug("init world");
    grueData= {
	images: ["assets/img/circ-brown.png", "assets/img/circ-blue.png","assets/img/circ-green.png","assets/img/circ-red.png"],
    	frames: {width:64, height:64 },
    	animations : {
	    redGreen: [2, 3, "blueBrown"],
	    blueBrown: [0, 1, "redGreen"]
        }
    }
    grueSpriteSheet = new createjs.SpriteSheet(grueData);
    grueSprite= new createjs.Sprite(grueSpriteSheet, "redGreen"); 
    var board = new createjs.Stage("world");
    board.addChild(grueSprite);
    createjs.Ticker.on("tick", handleTick);
    function handleTick(event) {
	    board.update(event);
    }
}
/* grueMove( int, int)
 *
 * takes 1, 0, -1
 */
function grueMove (xCo, yCo, grue){
	createjs.Tween.get(grueSprite).to({ x: grueSprite.x + (10 * xCo), y: grueSprite.y+(10 * yCo)  }, 50, createjs.Ease.linear);
}
window.Grue = {
	move: grueMove

};
window.World = {
    init: init
};

})();
