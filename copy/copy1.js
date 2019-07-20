function r(e) {
    var t = e.target || e.srcElement
        , r = document.documentElement.scrollTop;
    if (t.className.indexOf(l) > -1) {
        e.preventDefault();
        var a = document.getElementById("hljs-copy-el");
        a || (a = document.createElement("textarea"),
            a.style.position = "absolute",
            a.style.left = "-9999px",
            a.style.top = r + "px",
            a.id = "hljs-copy-el",
            document.body.appendChild(a)),
            a.textContent = e.currentTarget.parentNode.innerText,
            n("#hljs-copy-el");
        try {
            var i = document.execCommand("copy");
            t.dataset.title = i ? p : u,
            i && setTimeout(function () {
                t.dataset.title = d
            }, 1e3)
        } catch (s) {
            t.dataset.title = u
        }
    }
}

function n(e) {
    if (e = "string" == typeof e ? document.querySelector(e) : e,
        navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        var t = e.contentEditable
            , r = e.readOnly;
        e.contentEditable = !0,
            e.readOnly = !0;
        var n = document.createRange();
        n.selectNodeContents(e);
        var a = window.getSelection();
        a.removeAllRanges(),
            a.addRange(n),
            e.setSelectionRange(0, 999999),
            e.contentEditable = t,
            e.readOnly = r
    } else
        e.select()
}