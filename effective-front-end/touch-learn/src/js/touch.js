(function () {
    var touch = {};

    function swipeDirection (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    document.addEventListener('touchstart', function (evt) {
        var firstTouch = evt.changedTouches[0];
        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;

    });

    document.addEventListener('touchend', function (evt) {
        var thisTouch = evt.changedTouches[0];
        touch.x2 = thisTouch.pageX;
        touch.y2 = thisTouch.pageY;

        var myEvent = new Event('myTouch' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
        evt.target.dispatchEvent(myEvent);

        touch = {};
    });
})();