var Datastore = require('nedb');

function Database() {

    this._collections = [];

}

var proto = Database.prototype;

proto.getCollection = function (name, callback, autoload) {
    if (name in this._collections && this._collections[name] != undefined) {
        return this._collections[name];
    }

    return this.createCollection(name, autoload);
};

proto.createCollection = function (name, autoload) {
    var table = new Datastore({
        filename: './data/' + name,
        autoload: autoload || true
    });

    this._collections.push(table);

    return table;
};

module.exports = Database;
