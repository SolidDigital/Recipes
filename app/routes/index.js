'use strict';
var app = require('ral')('app');

module.exports = {
    load : load
};

function load() {
    var router = app.express.Router();
    router.use(pageNotFound);
    app.router = router;
}

function pageNotFound(req, res) {
    new app.bridgetown.Response(res).writeNotFound();
}