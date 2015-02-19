var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function FrontendComponent() {
    EventEmitter.apply(this);
    this._cachedEvents = {};
}

inherits(FrontendComponent, EventEmitter);

var proto = FrontendComponent.prototype;

proto.bindEvents = function() {
    // just a stub
};

proto.bindEvent = function(module, event, socketId, cb) {
    if(!this[module]) return false;
    if(!this._cachedEvents[socketId]) {
        this._cachedEvents[socketId] = [];
    }
    this._cachedEvents[socketId].push({
        event: event,
        module: module,
        cb: cb
    });
    this[module].on(event, cb);
};

proto.unbindEvents = function(socketId) {
    if(!this._cachedEvents[socketId]) return false;
    this._cachedEvents[socketId].forEach(function(event) {
        this[event.module].removeListener(event.event, event.cb);
    }.bind(this));
    this._cachedEvents[socketId] = undefined;
};

proto._getEventName = function(eventName) {
    return this._name + ':' + eventName;
};

module.exports = FrontendComponent;