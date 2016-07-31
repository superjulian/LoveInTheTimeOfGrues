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
    var boundaries = [];

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
                "assets/img/Grue-away2.png"
            ],
            frames: { width:64, height:64, count: 8 },
            animations : {
                walkLeft: { frames: [0, 1] },
                walkRight: { frames: [2, 3] },
                walkDown: { frames: [4, 5] },
                walkUp: { frames: [6, 7] },

                idleLeft: { frames: [0] },
                idleRight: { frames: [2] },
                idleDown: { frames: [4] },
                idleUp: { frames: [6] }
            },
            framerate: 5
        }

        grueSpriteSheet = new createjs.SpriteSheet(grueData);
        grueSprite = new createjs.Sprite(grueSpriteSheet, "idleDown");
        board.addChild(grueSprite);
    }

    function move_world() {
        var wp = World.position(),
            dx = wp.x + grueSprite.x,
            dy = wp.y + grueSprite.y,
            nx = wp.x,
            ny = wp.y;
        nx = wp.x - dx;
        ny = wp.y - dy;
        if (nx > 0) { nx = 0; }
        if (ny > 0) { ny = 0; }
        if (nx < -900) { nx = wp.x }
        if (ny < -900) { ny = wp.y }
        World.set_position(nx, ny);
    }

    function check_out_of_bounds(x, y, xCo, yCo) {
        for (let i = 0; i < boundaries.length; i++) {
            let bnd = boundaries[i];
            if (bnd[0] < x && x < bnd[1]) {
                if (bnd[2] < y && y < bnd[3]) {
                    console.log(grueSprite.x, grueSprite.y, xCo, yCo, bnd);
                    if (xCo === bnd[4] || yCo === bnd[5]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function tick (){
        if (inGulp===true) {
            return;
        }

        if (Keyboard.state[Keyboard.SPACE]){
            gulp();
            grueSprite.gotoAndPlay("idle"+facing);
            idle=true;
        } else if (Keyboard.state[Keyboard.LEFT]){
            xCo=-1;
            yCo=0;
            if (facing!="Left" || idle){
                facing="Left";
                grueSprite.gotoAndPlay("walkLeft");
                idle=false;
            }
        } else if (Keyboard.state[Keyboard.RIGHT]){
            xCo=1;
            yCo=0;
            if (facing!="Right"|| idle){
                grueSprite.gotoAndPlay("walkRight");
                facing="Right";
                idle=false;
            }
        } else if (Keyboard.state[Keyboard.UP]){
            yCo=-1;
            xCo=0;
            if (facing!="Up"|| idle){
                facing="Up";
                grueSprite.gotoAndPlay("walkUp");
                idle=false;
            }
        } else if (Keyboard.state[Keyboard.DOWN]){
            yCo=1;
            xCo=0;
            if (facing!="Down" || idle){
                facing="Down";
                grueSprite.gotoAndPlay("walkDown");
                idle=false;
            }
        } else {
            xCo=0;
            yCo=0;
            grueSprite.gotoAndPlay("idle"+facing);
            idle=true;
        }

        if (xCo !== 0 || yCo !== 0) {
            console.log(grueSprite.x, grueSprite.y, xCo, yCo);
            if (check_out_of_bounds(grueSprite.x + 7 * xCo, grueSprite.y + 7 * yCo, xCo, yCo)) {
                return;
            }
        }

        createjs.Tween.get(grueSprite).to(
            { x: grueSprite.x + (7 * xCo), y: grueSprite.y+(7 * yCo)  }, 3, createjs.Ease.linear).call(function() {xCo=0; yCo=0});
        move_world();
    }

    function gulp(){
        inGulp=true;
        var num=20;
        var deltaX;
        var deltaY;
        if (facing==="Right"){
            deltaX=[2*num, 2*num];
            deltaY=[-num, num];
        }
        else if (facing==="Left"){
            deltaX=[-2*num, -2*num];
            deltaY=[-num, num];
        }
        else if (facing==="Up"){
            deltaX=[num, -num];
            deltaY=[-2*num, -2*num];
        }
        else if (facing==="Down"){
            deltaX=[num, -num];
            deltaY=[2*num, 2*num];
        }
        else{
            inGulp=false;
            return;
        }
        deltaX[0]=deltaX[0]+grueSprite.x;
        deltaX[1]=deltaX[1]+deltaX[0];
        deltaY[0]=deltaY[0]+grueSprite.y;
        deltaY[1]=deltaY[1]+deltaY[0];
        createjs.Tween.get(grueSprite)
            .to({ x: deltaX[0], y: deltaY[0]  }, 200, createjs.Ease.getPowInOut(2))
            .to( { x: deltaX[1], y: deltaY[1] }, 200, createjs.Ease.getPowInOut(2))
            .call(function() {xCo=0; yCo=0; inGulp=false});

        move_world();
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
        }
    }
})();
