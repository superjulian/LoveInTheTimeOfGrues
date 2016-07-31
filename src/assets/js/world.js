(function() {
"use strict";

var board = null;

const tileset = {
    tree: [
        new createjs.SpriteSheet({ images: ["/assets/img/Tree1.png"], frames: { width: 128, height: 192 }}),
        new createjs.SpriteSheet({ images: ["/assets/img/Tree2.png"], frames: { width: 128, height: 192 }}),
        new createjs.SpriteSheet({ images: ["/assets/img/Tree3.png"], frames: { width: 128, height: 192 }})
    ],
    grass: [
        new createjs.SpriteSheet({ images: ["/assets/img/grass1.png"], frames: { width: 64, height: 64 }}),
        new createjs.SpriteSheet({ images: ["/assets/img/grass2.png"], frames: { width: 64, height: 64 }}),
    ],
    ground: [
        new createjs.SpriteSheet({ images: ["/assets/img/grass-blank.png"], frames: { width: 64, height: 64 }}),
    ]
};

function sort_y(a, b) {
    if (a.y > b.y) return 1;
    if (a.y <= b.y) return -1;
    return 0;
};

function init(stage) {
    Grue.init(stage);
    board = stage;
}

function fill(item, tileset) {
    var newitems = [];
    var tiles = tileset[item.fill];

    if (item.density === 1) {
        var cx = 2048 / tiles[0]._frameWidth,
            cy = 1024 / tiles[0]._frameHeight;

        for (let i = 0; i < cx; i++) {
            for (let j = 0; j < cx; j++) {
                let index = Math.floor(Math.random()*tiles.length),
                    sprite = new createjs.Sprite(tiles[index]);
                sprite.x = i * tiles[0]._frameWidth;
                sprite.y = j * tiles[0]._frameHeight;
                window.foo = sprite;
                newitems.push(sprite);
            }
        }
    } else {
        for (let i = item.min_x; i < item.max_x; i += item.bound) {
            for (let j = item.min_y; j < item.max_y; j += item.bound) {
                let n = Math.abs(noise.simplex2(i / item.bound, j / item.bound));
                console.log(n);
                if (n < item.density) {
                    var index = Math.floor(Math.random()*tiles.length),
                        sprite = new createjs.Sprite(tiles[index]);
                    sprite.x = i;
                    sprite.y = j;
                    sprite.shadow = new createjs.Shadow("rgba(0,0,0,.9)", 10, 10, 100);
                    window.foo = sprite;
                    newitems.push(sprite);
                }
            }
        }
    }
    newitems.sort(sort_y);
    board.addChild.apply(board, newitems);
}

function create(item, tileset, at) {
    var tiles = tileset[item.type];
    var index = Math.floor(Math.random()*tiles.length);
    var sprite = new createjs.Sprite(tiles[index]);
    sprite.x = item.x;
    sprite.y = item.y;
    if (at) {
        board.addChildAt(sprite, at);
    } else {
        board.addChild(sprite);
    }
    board.update();
}

function load(path) {
    var preload = new createjs.LoadQueue();
    preload.addEventListener("fileload", function(event) {
        event.result.scenery.forEach(function(item) {
            if (item.type === "grue") {
                Grue.show(item.x, item.y, board);
            } else if (item.type === "fill") {
                fill(item, tileset);
            } else {
                create(item, tileset);
            }
        });
    });
    preload.loadFile(path);
}

window.World = {
    init: init,
    load: load
};

})();
