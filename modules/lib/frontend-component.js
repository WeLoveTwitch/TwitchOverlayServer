var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var uuid = require('uuid');

function FrontendComponent() {
    EventEmitter.apply(this);
    this._cachedEvents = {};
}

inherits(FrontendComponent, EventEmitter);

FrontendComponent.DELIMITER = ':';

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
    return this.name + FrontendComponent.DELIMITER + eventName + FrontendComponent.DELIMITER + this._id;
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

proto.setEditMode = function(onOff) {
    this._eventEmitter.emit('triggerFrontendEvent', this._getEventName('setEditMode'), onOff);
};


proto.setPosition = function(pos) {
    this.position = pos;
    this._eventEmitter.emit('event', this._getEventName('position'), {
        position: this.position
    });
};

proto.positionChanged = function() {
    this._eventEmitter.emit('event', this._getEventName('position'), {
        position: this.position
    });
};

module.exports = FrontendComponent;