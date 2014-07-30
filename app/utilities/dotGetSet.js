'use strict';

module.exports = {
    get : get,
    set : set,
    attach : attach
};

function get (obj, str) {
    str = str.split('.');
    for (var i = 0; i < str.length; i++) {
        obj = obj[str[i]];
        if (!obj) {
            return undefined;
        }
    }
    return obj;
}

function set (obj, str, val) {
    var next;
    str = str.split('.');
    while (str.length > 1) {
        next = str.shift();
        obj[next] = obj[next] || {};
        obj = obj[next];
    }
    obj[str.shift()] = val;
}

function attach(obj) {
    obj.get = get.bind(obj, obj);
    obj.set = set.bind(obj, obj);
}

