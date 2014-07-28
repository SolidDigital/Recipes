/* jshint node:true */
'use strict';

var app = require('ral')('app'),
    token,
    Q = require('q');

/**
 * Initialize must first be called with ghCore.
 * Once the promise is resolved, get may be called to retrive the token.
 * @type {{get: get, initialize: initialize}}
 */
module.exports = {
    get : get,
    initialize : initialize
};

function initialize () {
    var deferred = Q.defer();

    if (token) {
        deferred.resolve(token);
    } else {
        app.ghCore
            .auth('Basic', { username: process.env.GHCONFIG.username, password: process.env.GHCONFIG.password })
            .then(function (theToken) {
                token = theToken;
                deferred.resolve(token);
            },
            deferred.reject)
            .done();
    }
    return deferred.promise;
}

function get () {
    return token;
}
