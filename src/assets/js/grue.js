(function() {
"use strict";

var stage;
var grueData;
var grueSpriteSheet;
var thonSprite;
var grueSprite;
var inGulp=false;
var xCo=0;
var yCo=0;
var facing="";
var idle=true;
var boundaries = [];

function init(board) {
    stage = board;

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
            "assets/img/Grue-towards-love.png",
            "assets/img/Grue-towards-aftereating.png",
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
            [0, 0, 128, 128, 12],
            [0, 0, 128, 128, 13],
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
            eatUp: { frames: [11] },
            eatDownAfter: { frames: [13] },

            love: { frames: [12] }
        },
        framerate: 5
    }

    grueSpriteSheet = new createjs.SpriteSheet(grueData);
    grueSprite = new createjs.Sprite(grueSpriteSheet, "idleDown");
    board.addChild(grueSprite);
}

function move_world(ov_x, ov_y, slow) {
    var wp = World.position(),
        dx = wp.x + (ov_x || grueSprite.x),
        dy = wp.y + (ov_y || grueSprite.y),
        nx = wp.x,
        ny = wp.y;
    nx = wp.x - dx;
    ny = wp.y - dy;
    if (nx > 0) { nx = 0; }
    if (ny > 0) { ny = 0; }
    if (nx < -900) { nx = wp.x }
    if (ny < -900) { ny = wp.y }
    World.set_position(nx, ny, false, slow);
}

function check_out_of_bounds(x, y, xCo, yCo) {
    for (let i = 0; i < boundaries.length; i++) {
        let bnd = boundaries[i];
        if (bnd[0] < x && x < bnd[1]) {
            if (bnd[2] < y && y < bnd[3]) {
                if (xCo === bnd[4] || yCo === bnd[5]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function tick () {
    if (inGulp===true) {
        return;
    }

    if (Keyboard.state[Keyboard.SPACE]){
        xCo=0;
        yCo=0;
        gulp();
        idle=true;
        return;
    }
    else if (Keyboard.state[Keyboard.LEFT]){
        xCo=-1;
        yCo=0;
        if (facing!="Left" || idle){
            facing="Left";
            grueSprite.gotoAndPlay("walkLeft");
            idle=false;
        }
    }
    else if (Keyboard.state[Keyboard.RIGHT]){
        xCo=1;
        yCo=0;
        if (facing!="Right"|| idle){
            grueSprite.gotoAndPlay("walkRight");
            facing="Right";
            idle=false;
        }
    }
    else if (Keyboard.state[Keyboard.UP]){
        yCo=-1;
        xCo=0;
        if (facing!="Up"|| idle){
            facing="Up";
            grueSprite.gotoAndPlay("walkUp");
            idle=false;
        }
    }else if (Keyboard.state[Keyboard.DOWN]){
        yCo=1;
        xCo=0;
        if (facing!="Down" || idle){
            facing="Down";
            grueSprite.gotoAndPlay("walkDown");
            idle=false;
        }
    }
    else {
        yCo=0;
        xCo=0;
        grueSprite.gotoAndPlay("idle"+facing);
        idle=true;
    }

    if (xCo !== 0 || yCo !== 0) {
        if (check_out_of_bounds(grueSprite.x + 7 * xCo, grueSprite.y + 7 * yCo, xCo, yCo)) {
            return;
        }

        createjs.Tween.get(grueSprite).to({ x: grueSprite.x + (7 * xCo), y: grueSprite.y+(7 * yCo)  }, 3, createjs.Ease.linear).call(function() {xCo=0; yCo=0});
        move_world();
    }
}

function gulp(){
    inGulp=true;
    var num=30;
    var rotation=0;
    var deltaX;
    var deltaY;
    var xc, yc;
    if (facing==="Right"){
        xc = 1;
        deltaX=[4*num, 0];
        deltaY=[-4*num, 4*num];
        rotation=90;
    }
    else if (facing==="Left"){
        xc = -1;
        deltaX=[-4*num, 0];
        deltaY=[-num, num];
        rotation=-90;
    }
    else if (facing==="Up"){
        yc = -1;
        deltaX=[0, 0];
        deltaY=[-2*num, -2*num];
        grueSprite.gotoAndPlay("eat"+facing);
    }
    else if (facing==="Down"){
        yc = 1;
        deltaX=[0, 0];
        deltaY=[2*num, 2*num];
        grueSprite.gotoAndPlay("eat"+facing);
    }
    else{
        inGulp=false;
        return;
    }

    deltaX[0]=deltaX[0]+grueSprite.x;
    deltaX[1]=deltaX[1]+deltaX[0];
    deltaY[0]=deltaY[0]+grueSprite.y;
    deltaY[1]=deltaY[1]+deltaY[0];

    if (check_out_of_bounds(deltaX[1], deltaY[1], xc, yc)) {
        inGulp=false;
        return;
    }

    grueSprite.rotation=-rotation/3;
    move_world(deltaX[1], deltaY[1], 100);
    var twn = createjs.Tween.get(grueSprite)
        .to({ x: deltaX[0], y: deltaY[0], rotation: rotation  }, 250, createjs.Ease.getPowInOut(2))
        .call(function() {grueSprite.gotoAndPlay("eat"+facing)})
        .to( { x: deltaX[1], y: deltaY[1]  }, 150, createjs.Ease.getPowInOut(2))
        .call(function() {
            xCo=0;
            yCo=0;
            grueSprite.gotoAndPlay("idle"+facing);
            createjs.Tween.get(grueSprite).to( {rotation: 0}, 20, createjs.Ease.getPowInOut(2));
            inGulp=false
        });
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
    },
    add_boundary: function(boundary) {
        boundaries.push(boundary);
    },
    end_game: function(container) {
        thonSprite = new createjs.Sprite(grueSpriteSheet, "idleDown");
        thonSprite.x = 500;
        thonSprite.y = 10;
        container.addChild(thonSprite);
        grueSprite.gotoAndPlay("love");
        createjs.Tween.get(grueSprite).to({x: 500, y: 90}, 2000).call(function() {
            thonSprite.gotoAndPlay("eatDown");
            createjs.Tween.get(thonSprite).to({y: 100}, 1000).call(function() {
                thonSprite.gotoAndPlay("eatDownAfter");
            }).call(function() {
                stage.removeChild(grueSprite);
                setTimeout(function() {
                    thonSprite.y += 30;
                    thonSprite.x += 30;
                    thonSprite.gotoAndPlay("idleDown");
                    setTimeout(function() {
                        thonSprite.gotoAndPlay("walkUp");
                        createjs.Tween.get(thonSprite).to({y: -100}, 1000).call(function() {
                            container.removeChild(thonSprite);
                        });
                    }, 1000);

                }, 1000);
            });
        });
    }
}

})();

