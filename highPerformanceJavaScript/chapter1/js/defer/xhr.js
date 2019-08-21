let xhr = new XMLHttpRequest();
xhr.open('get', 'file.js', true);

xhr.onreadystatechange = function() {
    if (+xhr.readyState === 4) {
        let status = +xhr.status;
        if (status >= 200 && status < 300 || status === 304) {
            let $script = document.createElement('script');
            $script.type = 'text/javascript';
            $script.text = xhr.responseText;
            document.head.appendChild($script);
        }
    }
};

xhr.send(null);