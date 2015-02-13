TwitchOverlay.service('ConfigStore', ['$rootScope', 'pouchdb', function($rootScope, pouchdb) {
    var db = pouchdb.create('configStore');

    //db.replicate.sync('http://localhost:5984/configstore', {live: true});

    var configStore = {};

    function fill() {
        db.allDocs({include_docs: true}, function(err, data) {
            data.rows.forEach(function(row) {
                configStore[row.doc.key] = row.doc.value;
            });
        });
    }

    fill();

    return {
        set: function(key, value) {
            db.put({
                key: key,
                value: value
            }, key);
            configStore[key] = value;
        },
        get: function(key) {
            return configStore[key] || null;
        }
    };
}]);