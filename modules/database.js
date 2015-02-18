var Datastore = require('nedb');

function Database(name, autoload) {

    this._db = new Datastore({
        filename: './data/' + name,
        autoload: autoload || true
    });

}

var proto = Database.prototype;

proto.getHandle = function () {
    return this._db;
};

module.exports = Database;
