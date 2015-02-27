var FrontendComponent = require('../lib/frontend-component');
var inherits = require('util').inherits;
var fs = require('fs');

function Image() {
  FrontendComponent.apply(this);
}

inherits(Image, FrontendComponent);

var proto = Image.prototype;

proto.bindEvents = function(socket) {
  this.bindGenericEvents(socket);
};

proto.handleImageUrl = function(fileUrl, cb) {
  var imageCachePath = global.PATH_IMAGE_CACHE;

  if (!fs.existsSync(imageCachePath)){
    fs.mkdirSync(imageCachePath);
  }

  var fileUrlParts = fileUrl.split('.');
  var ext = fileUrlParts[fileUrlParts.length - 1];
  var newFileName = this._id + '.' + ext;
  var newPath = imageCachePath + newFileName;


  this._copyFile(fileUrl, newPath, function(err) {
    this.settings.fileName = newFileName;
    this.settings.fileChanges = (this.settings.fileChanges || 0) + 1;
    cb();
    this._eventEmitter.emit('event', this._getEventName('fileUrl'), {
      fileName: this.settings.fileName,
      fileChanges: this.settings.fileChanges
    });
  }.bind(this));
};

proto._copyFile = function(from, to, cb) {
  var source = fs.createReadStream(from);
  var dest = fs.createWriteStream(to);

  source.pipe(dest);

  var error = null;
  source.on('end', function() {
    cb(error);
  });

  source.on('error', function(err) {
    error = err;
  });
};

module.exports = Image;