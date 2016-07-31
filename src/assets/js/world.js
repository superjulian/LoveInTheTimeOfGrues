(function() {
"use strict";

var data = null;
var board = null;
var containers = {};

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

function fill(item, tileset, container, size) {
    var newitems = [];
    var tiles = tileset[item.fill];

    if (item.density === 1) {
        var cx = tiles[0]._frameWidth,
            cy = tiles[0]._frameHeight;

        for (let i = 0; i < 2*size.height; i+=cy) {
            for (let j = 0; j < 2*size.width; j+=cx) {
                let index = Math.floor(Math.random()*tiles.length),
                    sprite = new createjs.Sprite(tiles[index]);
                sprite.x = j;
                sprite.y = i;
                newitems.push(sprite);
            }
        }
    } else {
        for (let i = item.min_x; i < item.max_x; i += item.bound) {
            for (let j = item.min_y; j < item.max_y; j += item.bound) {
                let n = Math.abs(noise.simplex2(i / item.bound, j / item.bound));
                if (n < item.density) {
                    var index = Math.floor(Math.random()*tiles.length),
                        sprite = new createjs.Sprite(tiles[index]);
                    sprite.x = i;
                    sprite.y = j;
                    sprite.shadow = new createjs.Shadow("rgba(0,0,0,.9)", 10, 10, 100);
                    newitems.push(sprite);
                }
            }
        }
        newitems.sort(sort_y);
    }
    container.addChild.apply(container, newitems);
}

function create(item, tileset, container) {
    var tiles = tileset[item.type];
    var index = Math.floor(Math.random()*tiles.length);
    var sprite = new createjs.Sprite(tiles[index]);
    sprite.x = item.x;
    sprite.y = item.y;
    container.addChild(sprite);
    container.update();
}

function load(path) {
    var preload = new createjs.LoadQueue();
    preload.addEventListener("fileload", function(event) {
        event.result.boundary.forEach(function(item) {
            Grue.add_boundary(item);
        });
        event.result.scenery.forEach(function(item) {
            var container = board;
            if (item.layer) {
                container = containers[item.layer];
                if (container === undefined) {
                    container = new createjs.Container();
                    containers[item.layer] = container;
                    board.addChild(container);
                }
            }
            if (item.type === "grue") {
                Grue.show(item.x, item.y, board);
            } else if (item.type === "fill") {
                fill(item, tileset, container, event.result.size);
                container.cache(0, 0, event.result.size.width, event.result.size.height);
            } else {
                create(item, tileset, container);
            }
        });

        data = event.result;
        var pos = Grue.position();
        World.set_position(-pos.x, -pos.y, true);
    });
    preload.loadFile(path);
}

window.World = {
    init: init,
    load: load,
    containers: containers,
    world: function (){return board},
    dim : function() { return data.size; },
    position: function() {
        return {x : containers["ground0"].x, y : containers["ground0"].y};
    },
    set_position: function(x, y, immediate, spd) {
        let keys = Object.keys(containers);
        for (let i = 0; i < keys.length; i++) {
            var c = containers[keys[i]];
            if (immediate) {
                c.x = x;
                c.y = y;
            } else {
                createjs.Tween.get(c).to({x : x, y : y}, spd || 10, createjs.Ease.linear);
            }
        }
    },
    end_game: function() {
        Grue.end_game(board);
    }
};

})();

