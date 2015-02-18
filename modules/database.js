var Datastore = require('nedb');

function Database() {

    this._tables = [];

}

var proto = Database.prototype;

proto.getTable = function (name, callback, autoload) {
    if (name in this._tables && this._tables[name] != undefined) {
        callback(this._tables[name]);
    }

    callback(this.createTable(name, autoload));
};

proto.createTable = function (name, autoload) {
    var table = new Datastore({
        filename: './data/' + name,
        autoload: autoload || true
    });

    this._tables.push(table);

    return table;
};

module.exports = Database;
