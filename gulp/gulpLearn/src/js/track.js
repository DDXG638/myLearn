import Cookies from 'js-cookie';

const isIOS = function () {return /iPhone|iPod|iPad/i.test(navigator.userAgent);};
/*import sa from 'sa-sdk-javascript';

sa.init({
    name: 'sa',
    show_log: false,
    server_url: 'https://bi.dreame.com:9106/sa?project=d_project'
});*/

const qid = Cookies.get('qid') || '',
    platform = isIOS() ? 'iOS' : 'Android';

export function trackPageView(obj = {}) {
    console.log('trackPageView', {...obj, qid, platform});
}

export function trackLogin() {
    console.log('trackLogin', {platform, qid});
}

/* exports.trackPageView = function(obj = {}) {
    console.log('trackPageView', obj);
}

exports.trackLogin = function() {
    console.log('trackLogin');
} */