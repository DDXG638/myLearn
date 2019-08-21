console.log('script4');

// 动态加载脚本
function loadScript(url, cb) {
    let $script = document.createElement('script');
    $script.type = 'text/javascript';

    // 动态脚本的onload事件
    // IE与众不同
    if ($script.readyState) {
        $script.onreadystatechange = function() {
            let state = $script.readyState;
            if (state === 'loaded' || state === 'complete') {
                // 防止loaded 和 complete 都触发，导致代码执行两次
                $script.onreadystatechange = null;
                cb();
            }
        };
    } else {
        // 正常浏览器
        $script.onload = function() {
            cb();
        };
    }

    $script.src = url;
    document.head.appendChild($script);
}

// setTimeout(function () {
    loadScript('./js/defer/dynamic.js', function () {
        console.log('--- 动态加载后执行 ---');
    });
// }, 2000);
