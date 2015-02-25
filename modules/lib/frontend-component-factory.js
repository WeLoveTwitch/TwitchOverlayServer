var EventEmitter = require('events').EventEmitter;

// components
var FollowerAlert = require('../components/follower-alert');
var NewestFollower = require('../components/newest-follower');
var Followers = require('../components/followers');
var Chat = require('../components/chat');
var Image = require('../components/image');
var Text = require('../components/text');

function FrontendComponentFactory(db, deps) {
    console.debug('FrontentComponentFactory', db, deps);
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
        image: {
            constructor: Image,
            deps: [],
            name: 'image'
        },
        text: {
            constructor: Text,
            deps: [],
            name: 'text'
        }
    };

    for (var type in this._componentClasses) {
        this._listOfAvailableComponents.push(type)
    }

    this.restore();
}

var proto = FrontendComponentFactory.prototype;

proto.createComponent = function (type) {
    console.debug('FrontentComponentFactory::createComponent', type);
    var component = this._createComponent(type);

    if (!component) {
        return;
    }

    var opts = this._componentClasses[type];
    component.setup(opts.name);

    this.emitToAllSockets('newComponent', component.getSaveData());

    return component;
};

proto._createComponent = function (type) {
    console.debug('FrontentComponentFactory::_createComponent', type);
    var opts = this._componentClasses[type];
    var args = [];
    var that = this;

    if (!opts) {
        return;
    }

    opts.deps.forEach(function (dep) {
        args.push(this._deps[dep])
    }.bind(this));

    var Constructor = opts.constructor.bind.apply(opts.constructor, [null].concat(args));
    var component = new Constructor();

    component._eventEmitter = new EventEmitter();

    component._eventEmitter.on('event', function (eventName, data) {
        console.debug('FrontendComponentFactory::_createComponent - on(\'event\')', eventName, data);
        that.emitToComponentUpdate(eventName, data);
    });

    component._eventEmitter.on('triggerFrontendEvent', function (eventName, data) {
        console.debug('FrontendComponentFactory::_createComponent - on(\'triggerFrontendEvent\')', eventName, data);
        that.emitToAllSockets('triggerFrontendEvent', eventName, data);
    });

    this._components.push(component);

    return component;
};

proto.removeComponent = function () {
    console.debug('FrontentComponentFactory::removeComponent');
    // @TODO: remove component and tell the client
};

proto.setEditMode = function (onOff) {
    console.debug('FrontentComponentFactory::setEditMode', onOff);
    this.getActiveComponents().forEach(function (component) {
        component.setEditMode(onOff);
    });
};

proto.getActiveComponents = function () {
    console.debug('FrontentComponentFactory::getActiveComponents', this._components);
    return this._components;
};

proto.getAvailableComponents = function () {
    console.debug('FrontentComponentFactory::getAvailableComponents', this._listOfAvailableComponents);
    return this._listOfAvailableComponents;
};

proto.registerClient = function (socket) {
    console.debug('FrontentComponentFactory::registerClient', socket);
    socket.emit('components', this.getSaveData());
};

proto.unregisterClient = function () {
    console.debug('FrontentComponentFactory::unregisterClient');
    // @TODO implement
};

proto.getSaveData = function () {
    console.debug('FrontentComponentFactory::getSaveData');
    var saveData = [];

    this.getActiveComponents().forEach(function (component) {
        var data = component.getSaveData();
        saveData.push(data);
    });

    return saveData;
};

proto.save = function () {
    console.debug('FrontentComponentFactory::save');

    var snapshot = {
        created: new Date().getTime(),
        data: this.getSaveData()
    };

    // save a snapshot of the current state
    this._db.insert(snapshot);
};

proto.restore = function (cb) {
    console.debug('FrontentComponentFactory::restore', cb || function () {});
    var that = this;

    cb = cb || function () {};

    this._db.findOne({}).sort({ created: -1 }).exec(function (err, snapshot) {
        if (err || !snapshot) {
            return cb(err, !!snapshot);
        }

        snapshot.data.forEach(function (componentData) {
            var component = that._createComponent(componentData.name);
            component.setSaveData(componentData);
        });
    });
};

proto.emitToComponentUpdate = function (eventName, data) {
    console.debug('FrontentComponentFactory::emitToComponentUpdate', eventName, data);
    this._sockets.forEach(function (socket) {
        socket.emit('componentUpdate', eventName, data);
    });
};

proto.emitToAllSockets = function (eventName, data) {
    console.debug('FrontentComponentFactory::emitToAllSockets', eventName, data);
    this._sockets.forEach(function (socket) {
        socket.emit(eventName, data);
    });
};

proto.addSocket = function (socket) {
    console.debug('FrontentComponentFactory::addSocket', socket);
    var that = this;

    this._sockets.push(socket);
    this.registerClient(socket);

    socket.on('disconnect', function () {
        that._sockets = that._sockets.filter(function (s) {
            that.unregisterClient(socket);
            return s.id === socket;
        });
    });
};

module.exports = FrontendComponentFactory;
