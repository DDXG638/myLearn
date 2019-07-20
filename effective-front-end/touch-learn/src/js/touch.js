(function () {
    var touch = {},now, delta, deltaX = 0, deltaY = 0;

    function swipeDirection (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    document.addEventListener('touchstart', function (evt) {
        var firstTouch = evt.changedTouches[0];

        now = Date.now()
        delta = now - (touch.last || now)

        touch.x1 = firstTouch.pageX;
        touch.y1 = firstTouch.pageY;

        // 如果两次点击的时间间隔小于250毫秒，就判定为双击
        if (delta > 0 && delta <= 250) {
            touch.isDoubleTap = true;
        }
        touch.last = now;

    });

    document.addEventListener('touchmove', function (evt) {
        var moveTouch = evt.changedTouches[0];
        touch.x2 = moveTouch.pageX;
        touch.y2 = moveTouch.pageY;

        // 记录两次滑动触摸点的水平和垂直位移
        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
    });

    document.addEventListener('touchend', function (evt) {
        var thisTouch = evt.changedTouches[0];

        // 判断是否是滑动，位移大于30认定为滑动
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
            var myEvent = new Event('myTouch' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
            evt.target.dispatchEvent(myEvent);

            touch = {};
        }
        else {
            evt.target.dispatchEvent(new Event('myTouchTap'));

            if (touch.isDoubleTap) {
                evt.target.dispatchEvent(new Event('myTouchDoubleTap'));
            }
            touch = {}
        }
    });
})();