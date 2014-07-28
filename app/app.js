'use strict';

module.exports = {
    initialize : initialize,

    bridgetown : null,
    express : null,
    expressApp : null,
    ghApi : null,
    ghCore : null
};

function initialize(app) {
    this.bridgetown = app.bridgetown;
    this.express = app.express;
    this.expressApp = app.expressApp;
    this.ghApi = app.ghApi;
    this.ghCore = app.ghCore;
}