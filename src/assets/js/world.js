(function() {
"use strict";

var data = null;
var board = null;
var containers = {};
var advs=[];

var epsilon = 100;

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
function tick (){
        if (World.over) { return; }
        if (World.has_action && advs.length < 1){
                if (data) {
                    advs.push(Adventurer.make(data.poi[0], containers["adv"]));
                }
        }
        if (!World.over && World.score >= 3) {
            World.over = true;
            setTimeout(function() {
                World.end_game();
            }, 1000);
            return;
        }
        advs.forEach(function(adv) {
            var pos = Grue.position(),
                dx = Math.abs(2*pos.x - adv.sprite.x),
                dy = Math.abs(2*pos.y - adv.sprite.y);
            if (dx < epsilon && dy < epsilon) {
                if (adv.light === "On") {
                    Grue.die();
                } else if (Grue.gulp()) {
                    containers["adv"].removeChild(adv.sprite);
                    var index = advs.indexOf(adv);
                    if (index > -1) {
                        advs.splice(index, 1);
                    }
                    World.score += 1;
                } else {
                    Grue.die();
                }
            }
            if (adv.moving === false) {
                var wp = adv.gate.waypoints[adv.idx];
                if (wp) {
                    adv.move(wp.x, wp.y);
                    adv.idx += 1;
                } else {
                    containers["adv"].removeChild(adv.sprite);
                    var index = advs.indexOf(adv);
                    if (index > -1) {
                        advs.splice(index, 1);
                    }
                }
            }
        });
}

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
                if (item.cache) {
                    container.cache(0, 0, event.result.size.width, event.result.size.height);
                }
            } else if (item.type === "adv") {
                containers["adv"] = new createjs.Container();
                board.addChild(containers["adv"]);
            } else {
                create(item, tileset, container);
            }
        });

        var pos = Grue.position();
        World.set_position(-pos.x, -pos.y, true);
        data = event.result;
    });
    preload.loadFile(path);
}

window.World = {
    advs: advs,
    init: init,
    load: load,
    board: function() { return board },
    containers: containers,
    world: function (){return board},
    dim : function() { return data.size; },
    position: function() {
        return {
            x : containers["ground0"].x,
            y : containers["ground0"].y
        };
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
    },
    tick: tick,
    has_action: false,
    score: 0,
    over: false
};

})();

