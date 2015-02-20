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
        FollowerAlert: {
            constructor: FollowerAlert,
            deps: ['twitch'],
            name: 'followerAlert'
        },
        NewestFollower: {
            constructor: NewestFollower,
            deps: ['twitch'],
            name: 'newestFollower'
        },
        Followers: {
            constructor: Followers,
            deps: ['twitch', 'serverData'],
            name: 'followers'
        },
        Chat: {
            constructor: Chat,
            deps: ['chat'],
            name: 'chat'
        },
        Logo: {
            constructor: Logo,
            deps: [],
            name: 'logo'
        }
    };

    for(var type in this._componentClasses) {
        this._listOfAvailableComponents.push(type)
    }
}

var proto = FrontendComponentFactory.prototype;

proto.createComponent = function(type) {
    var opts = this._componentClasses[type];
    if(!opts) {
        return false;
    }
    var args = [];
    opts.deps.forEach(function(dep) {
        args.push(this._deps[dep])
    }.bind(this));

    var Constructor = opts.constructor.bind.apply(opts.constructor, [null].concat(args));
    var component = new Constructor();
    component.setName(opts.name);
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

module.exports = FrontendComponentFactory;