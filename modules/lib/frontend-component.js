var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function FrontendComponent() {
    EventEmitter.apply(this);
    this._cachedEvents = {};
}

inherits(FrontendComponent, EventEmitter);

var proto = FrontendComponent.prototype;

proto.bindGenericEvents = function(socket) {
    this.bindEvent(null, 'enterEditMode', socket.id, function() {
        socket.emit(this._getEventName('enterEditMode'));
    });
};

proto.bindEvent = function(module, event, socketId, cb) {
    if(!this._cachedEvents[socketId]) {
        this._cachedEvents[socketId] = [];
    }
    if(!module) {
        this._cachedEvents[socketId].push({
            event: event,
            cb: cb
        });
        this.on(event, cb);
        return;
    }
    if(!this[module]) return;
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
        if(!event.module) {
            this.removeListener(event.event, event.cb);
            return;
        }
        this[event.module].removeListener(event.event, event.cb);
    }.bind(this));
    this._cachedEvents[socketId] = undefined;
};

proto._getEventName = function(eventName) {
    return this._name + ':' + eventName;
};

module.exports = FrontendComponent;