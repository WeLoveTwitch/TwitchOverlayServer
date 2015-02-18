var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function FrontendComponent() {
    EventEmitter.apply(this);
}

inherits(FrontendComponent, EventEmitter);

var proto = FrontendComponent.prototype;

proto.bindEvents = function() {
    // just a stub
};

module.exports = FrontendComponent;