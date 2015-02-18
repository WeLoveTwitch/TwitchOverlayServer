var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function ActivityStream(db) {

    EventEmitter.apply(this);

    var that = this;
    this._db = null;

    db.getTable('activities', function (instance) {
        that._db = instance;
    });

}

inherits(ActivityStream, EventEmitter);

var proto = ActivityStream.prototype;

proto.add = function (type, payload) {
    var data = {
        addedToDatabase: new Date().getTime(),
        type: type,
        payload: payload
    };
    this._db.insert(data, function () {
        this.emit('newActivity', data);
    }.bind(this));
};

// @TODO add method to retrieve last X activities

module.exports = ActivityStream;
