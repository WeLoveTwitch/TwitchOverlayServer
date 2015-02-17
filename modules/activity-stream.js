var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

function ActivityStream(db) {

    EventEmitter.apply(this);

    this._db = null;

    db.ready(function (_db) {
        this._db = _db;
        this.emit('_dbReady');
    }.bind(this));

}

inherits(ActivityStream, EventEmitter);

var proto = ActivityStream.prototype;

proto.add = function (type, payload) {
    if(!this._db) {
        return this.on('_dbReady', this.add.bind(this, type, payload));
    }
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