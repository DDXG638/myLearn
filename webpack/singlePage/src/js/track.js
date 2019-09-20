/*import isIOS from 'hy-libs/isIOS';
import Cookies from 'js-cookie';
import sa from 'sa-sdk-javascript';

const qid = Cookies.get('qid') || '',
    platform = isIOS() ? 'iOS' : 'Android';

sa.init({
    name: 'sa',
    show_log: false,
    server_url: 'https://bi.dreame.com:9106/sa?project=d_project'
});*/

export function trackPageView(obj = {}) {
    console.log('trackPageView', obj);
}

export function trackLogin() {
    console.log('trackLogin');
}