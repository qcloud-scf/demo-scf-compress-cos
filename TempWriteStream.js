var Writable = require('stream').Writable;
var util = require('util');

module.exports = TempWriteStream;

let handlerBuffer;

function TempWriteStream(options) {
  if (!(this instanceof TempWriteStream))
    return new TempWriteStream(options);
  if (!options) options = {};
  options.objectMode = true;
  handlerBuffer = options.handlerBuffer;
  Writable.call(this, options);
}

util.inherits(TempWriteStream, Writable);


TempWriteStream.prototype._write = function write(doc, encoding, next) {
  handlerBuffer(doc);
  process.nextTick(next)
};