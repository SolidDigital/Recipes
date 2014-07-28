'use strict';

var _ = require('lodash');

module.exports = {
    initialize : initialize,

    bridgetown : null,
    express : null,
    expressApp : null,
    ghApi : null,
    ghCore : null,
    rootDir : '',
    router : null
};

function initialize(app) {
    _.extend(this, app);
}