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
    var deferred = Q.defer(),
        config;

    if (token) {
        deferred.resolve(token);
    } else {
        config = JSON.parse(process.env.GHCONFIG);
        console.log('----');
        console.log('----');
        console.log('----');
        console.log('----');
        console.log('----');
        console.log('----');
        console.log(config.username);
        app.ghCore
            .auth('Basic', { username: config.username, password: config.password })
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
