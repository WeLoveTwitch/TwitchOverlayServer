var Datastore = require('nedb');

function Database(name) {
    this._db = new Datastore({filename: './data/' + name});
    this._ready = false;
    var that = this;
    this._readyCallbacks = [];

    this._db.loadDatabase(function (err) {
        that._ready = true;
        that._readyCallbacks.forEach(function(cb) {
           cb.call(that, that._db);
        });
    });
}

var proto = Database.prototype;

proto.ready = function(cb) {
    if(this._ready) {
        setTimeout(cb.bind(this, this._db), 0);
        return this;
    }
    this._readyCallbacks.push(cb);
    return this;
};

module.exports = Database;