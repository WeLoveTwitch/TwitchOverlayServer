var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var uuid = require('uuid');

function FrontendComponent() {
    console.debug('FrontendComponent');
    EventEmitter.apply(this);
    this._cachedEvents = {};
}

inherits(FrontendComponent, EventEmitter);

FrontendComponent.DELIMITER = ':';

var proto = FrontendComponent.prototype;

proto.setup = function (name) {
    console.debug('FrontendComponent::setup', name);
    this._id = uuid();
    this.name = name;
    this.settings = {};
};

proto.bindGenericEvents = function (socket) {
    console.debug('FrontendComponent::bindGenericEvents', socket);
    //
};

proto.bindEvent = function (module, event, socketId, cb) {
    console.debug('FrontendComponent::bindEvent', module, event, socketId, cb);
    if (!this._cachedEvents[socketId]) {
        this._cachedEvents[socketId] = [];
    }

    if (!module) {
        this._cachedEvents[socketId].push({
            event: event,
            cb: cb
        });
        this.on(event, cb);
        return;
    }

    if (!this[module]) return false;

    this._cachedEvents[socketId].push({
        event: event,
        module: module,
        cb: cb
    });

    this[module].on(event, cb);
};

proto.unbindEvents = function (socketId) {
    console.debug('FrontendComponent::unbindEvents', socketId);
    if (!this._cachedEvents[socketId]) return false;

    this._cachedEvents[socketId].forEach(function (event) {
        if (!event.module) {
            this.removeListener(event.event, event.cb);
            return;
        }

        this[event.module].removeListener(event.event, event.cb);
    }.bind(this));

    this._cachedEvents[socketId] = undefined;
};

proto._getEventName = function (eventName) {
    console.debug('FrontendComponent::_getEventName', eventName);
    return this.name + FrontendComponent.DELIMITER + eventName + FrontendComponent.DELIMITER + this._id;
};

proto.getSaveData = function () {
    console.debug('FrontendComponent::getSaveData');

    return {
        _id: this._id,
        name: this.name,
        settings: this.settings
    }
};

proto.setSaveData = function (data) {
    console.debug('FrontendComponent::setSaveData', data);
    for (var key in data) {
        this[key] = data[key];
    }
};

proto.setEditMode = function (onOff) {
    console.debug('FrontendComponent::setEditMode', onOff);
    this._eventEmitter.emit('triggerFrontendEvent', this._getEventName('setEditMode'), {
        value: onOff
    });
};

proto.styleChanged = function(property, value) {
    console.debug('FrontendComponent::styleChanged', property, value, this.settings[property]);
    var payload = {};
    payload[property] = value || this.settings[property];

    this._eventEmitter.emit(
        'event', this._getEventName(property), payload
    );
};

module.exports = FrontendComponent;
