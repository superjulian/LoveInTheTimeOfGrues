(function() {
"use strict";

function init(board) {
    Grue.init(board);
}

function fill(item, board, tileset) {
    let x_range = item.max_x - item.min_x,
        y_range = item.max_y - item.min_y;
    for (let i = 0; i < item.density; i++) {
        var x = Math.floor(Math.random()*x_range) + item.min_x,
            y = Math.floor(Math.random()*y_range) + item.min_y,
            newitem = {"type" : item.fill, "x" : x, "y" : y};
        create(newitem, board, tileset);
    }
}

function create(item, board, tileset) {
    var tiles = tileset[item.type];
    var index = Math.floor(Math.random()*tiles.length);
    var sprite = new createjs.Sprite(tiles[index]);
    sprite.x = item.x;
    sprite.y = item.y;
    board.addChild(sprite);
    board.update();
}

function load(path, board, tileset) {
    var preload = new createjs.LoadQueue();
    preload.addEventListener("fileload", function(event) {
        console.log(event);
        event.result.scenery.forEach(function(item) {
            if (item.type === "fill") {
                fill(item, board, tileset);
            } else {
                create(item, board, tileset);
            }
        });
    });
    preload.loadFile(path);
}

};

window.World = {
    init: init,
    load: load
};

})();
