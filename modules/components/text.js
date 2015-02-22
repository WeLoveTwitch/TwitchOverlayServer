var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function Text() {
    FrontendComponent.apply(this);

    this.text = 'your text';
}

inherits(Text, FrontendComponent);

var proto = Text.prototype;

proto.bindEvents = function(socket) {
    this.bindGenericEvents(socket);
};

proto.textChanged = function() {
    this._eventEmitter.emit('event', this._getEventName('text'), {
        text: this.text
    });
};

module.exports = Text;