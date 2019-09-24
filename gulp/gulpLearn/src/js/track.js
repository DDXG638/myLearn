import Cookies from 'js-cookie';

/*import isIOS from 'hy-libs/isIOS';
import sa from 'sa-sdk-javascript';

sa.init({
    name: 'sa',
    show_log: false,
    server_url: 'https://bi.dreame.com:9106/sa?project=d_project'
});*/

const qid = Cookies.get('qid') || '',
    platform = isIOS() ? 'iOS' : 'Android';

export function trackPageView(obj = {}) {
    console.log('trackPageView', obj);
}

export function trackLogin() {
    console.log('trackLogin');
}

/* exports.trackPageView = function(obj = {}) {
    console.log('trackPageView', obj);
}

exports.trackLogin = function() {
    console.log('trackLogin');
} */