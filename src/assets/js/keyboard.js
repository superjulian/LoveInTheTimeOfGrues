(function() {
"use strict";

var keyBoardState= { };
window.document.onkeydown = function(event) {
    keyBoardState[event.keyCode]=true;
}
window.document.onkeyup = function(event) {
    keyBoardState[event.keyCode]=false;
}


window.Keyboard = {
    state: keyBoardState,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    SPACE: 32
}

})();
