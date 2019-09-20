
function hourglass(){
    const _TYPE = {
        0 : function (time) {
            
        },
        1 : function (time) {
            
        },
        2 : function (time) {
            
        },
    };

    function main(time,type){
        let ori_time = _TYPE[type](time);

    }

    return {

        /*
         * @param time 时间值，可为剩余时间，可为到期时间（本地时），支持世界时传入
         * @param type 1为剩余时间，2为到期时间（本地时），0为到期时间（世界时）
         * @param fn callBcak function;
         */
        init: function (time,type,fn) {
            time = time || new Date;
            type = type || 2;
            main(time,type,fn);
        }
    }
}