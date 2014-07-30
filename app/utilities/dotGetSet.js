'use strict';

module.exports = {
    get : get,
    set : set
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
    str = str.split('.');
    while (str.length > 1) {
        obj = obj[str.shift()];
    }
    obj[str.shift()] = val;
}

