var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var uuid = require('uuid');

function FrontendComponent() {
    EventEmitter.apply(this);
    this._cachedEvents = {};
}

inherits(FrontendComponent, EventEmitter);

var proto = FrontendComponent.prototype;

proto.setup = function(name) {

    this.name = name;

    this.position = {
        x: 0,
        y: 0
    };
    this._id = uuid();
};

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
    return this.name + ':' + eventName;
};

proto.getSaveData = function() {
    return {
        _id: this._id,
        name: this.name, 
        position: this.position
    }
};

proto.setSaveData = function(data) {
    for(var key in data) {
        this[key] = data[key];
    }
};

module.exports = FrontendComponent;