var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;

function Image() {
    FrontendComponent.apply(this);
}

inherits(Image, FrontendComponent);

var proto = Image.prototype;

proto.bindEvents = function(socket) {
    this.bindGenericEvents(socket);
};

proto.handleImageUrl = function(fileUrl) {
  console.log(fileUrl);
};

module.exports = Image;