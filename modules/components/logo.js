var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function Logo() {
    FrontendComponent.apply(this);

    this._name = 'logo';
}

inherits(Logo, FrontendComponent);

var proto = Logo.prototype;

proto.bindEvents = function(socket) {
    this.bindGenericEvents(socket);
};

module.exports = Logo;