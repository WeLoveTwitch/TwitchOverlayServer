var EventEmitter = require('events').EventEmitter;

// components
var FollowerAlert = require('../components/follower-alert');
var NewestFollower = require('../components/newest-follower');
var Followers = require('../components/followers');
var Chat = require('../components/chat');
var Logo = require('../components/logo');
var Text = require('../components/text');

function FrontendComponentFactory(db, deps) {
    this._sockets = [];
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
        },
        text: {
            constructor: Text,
            deps: [],
            name: 'text'
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

    this.emitToAllSockets('newComponent', component.getSaveData());

    return component;
};

proto._createComponent = function(type) {
    var opts = this._componentClasses[type];
    if (!opts) {
        return;
    }
    var args = [];
    var that = this;
    opts.deps.forEach(function(dep) {
        args.push(this._deps[dep])
    }.bind(this));

    var Constructor = opts.constructor.bind.apply(opts.constructor, [null].concat(args));
    var component = new Constructor();

    component._eventEmitter = new EventEmitter();
    component._eventEmitter.on('event', function(eventName, data) {
        that.emitToComponentUpdate(eventName, data);
    });
    component._eventEmitter.on('triggerFrontendEvent', function(eventName, data) {
        that.emitToAllSockets('triggerFrontendEvent', eventName, data);
    });

    this._components.push(component);

    return component;
};

proto.removeComponent = function() {
    // @TODO: remove component and tell the client
};

proto.setEditMode = function(onOff) {
    this.getActiveComponents().forEach(function(component) {
        component.setEditMode(onOff);
    });
};

proto.getActiveComponents = function() {
    return this._components;
};

proto.getAvailableComponents = function() {
    return this._listOfAvailableComponents;
};

proto.registerClient = function(socket) {
    console.log('client connected');
    socket.emit('components', this.getSaveData());
};

proto.unregisterClient = function() {
    // @TODO implement
};

proto.getSaveData = function() {
    var saveData = [];
    this.getActiveComponents().forEach(function(component) {
        var data = component.getSaveData();
        saveData.push(data);
    });
    return saveData;
};

proto.save = function() {
    var snapshot = {
        created: new Date().getTime(),
        data: this.getSaveData()
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

proto.emitToComponentUpdate = function(eventName, data) {
    this._sockets.forEach(function(socket) {
        socket.emit('componentUpdate', eventName, data);
    });
};

proto.emitToAllSockets = function(eventName, data) {
    this._sockets.forEach(function(socket) {
        socket.emit(eventName, data);
    });
};

proto.addSocket = function(socket) {
    var that = this;
    this._sockets.push(socket);
    this.registerClient(socket);
    socket.on('disconnect', function() {
        that._sockets = that._sockets.filter(function(s) {
            that.unregisterClient(socket);
            return s.id === socket;
        });
    });
};

module.exports = FrontendComponentFactory;