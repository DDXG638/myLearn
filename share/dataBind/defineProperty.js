var student = {};

var name;

Object.defineProperty(student, 'name', {
    set: function(val) {
        console.log('set');
        name = val;
    },
    get: function () {
        console.log('get');
        return name;
    },
    enumerable : true,
    configurable : true
});