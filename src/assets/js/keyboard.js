(function() {
"use strict";

var registered = false;

function register(handlers) {
    if (registered) {
        throw Error("Already registered keyboard handlers!");
    }
    registered = true;
    window.document.onkeydown = function(event) {
        var func = handlers[event.keyCode];
        if (func) {
            func(event);
        }
    }
}

window.Keyboard = {
    register: register,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    SPACE: 32
}

})();
