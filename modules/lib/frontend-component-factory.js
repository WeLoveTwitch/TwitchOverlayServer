// components
var FollowerAlert = require('../components/follower-alert');
var NewestFollower = require('../components/newest-follower');
var Followers = require('../components/followers');
var Chat = require('../components/chat');
var Logo = require('../components/logo');

function FrontendComponentFactory(db, deps) {
    this._components = [];
    this._listOfAvailableComponents = [];
    this._db = db;
    this._deps = deps;
    this._componentClasses = {
        followerAlert: {
            constructor: FollowerAlert,
            deps: ['twitch'],
            name: 'followerAlert'
        },
        newestFollower: {
            constructor: NewestFollower,
            deps: ['twitch'],
            name: 'newestFollower'
        },
        followers: {
            constructor: Followers,
            deps: ['twitch', 'serverData'],
            name: 'followers'
        },
        chat: {
            constructor: Chat,
            deps: ['chat'],
            name: 'chat'
        },
        logo: {
            constructor: Logo,
            deps: [],
            name: 'logo'
        }
    };

    for(var type in this._componentClasses) {
        this._listOfAvailableComponents.push(type)
    }

    this.restore();
}

var proto = FrontendComponentFactory.prototype;

proto.createComponent = function(type) {

    var component = this._createComponent(type);
    if (!component) {
        return;
    }

    var opts = this._componentClasses[type];
    component.setup(opts.name);
    return component;
};

proto._createComponent = function(type) {
    var opts = this._componentClasses[type];
    if (!opts) {
        return;
    }
    var args = [];
    opts.deps.forEach(function(dep) {
        args.push(this._deps[dep])
    }.bind(this));

    var Constructor = opts.constructor.bind.apply(opts.constructor, [null].concat(args));
    var component = new Constructor();

    this._components.push(component);

    return component;
};

proto.setEditMode = function(onOff) {
    // @TODO implement
};

proto.getActiveComponents = function() {
    return this._components;
};

proto.getAvailableComponents = function() {
    return this._listOfAvailableComponents;
};

proto.registerClient = function() {
    // @TODO implement
};

proto.unregisterClient = function() {
    // @TODO implement
};

proto.save = function() {
    var saveData = [];
    this.getActiveComponents().forEach(function(component) {
        var data = component.getSaveData();
        saveData.push(data);
    });

    var snapshot = {
        created: new Date().getTime(),
        data: saveData
    };

    // save a snapshot of the current state
    this._db.insert(snapshot);
};

proto.restore = function(cb) {
    cb = cb || function() {};
    var that = this;
    this._db.findOne({}).sort({created: -1}).exec(function(err, snapshot) {

        if(err || !snapshot) {
            return cb(err, !!snapshot);
        }

        snapshot.data.forEach(function(componentData) {
            var component = that._createComponent(componentData.name);
            component.setSaveData(componentData);
        });
    });
};

module.exports = FrontendComponentFactory;