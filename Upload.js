const cos = require('./cos')

let Duplex = require('stream').Duplex;
function bufferToStream(buffer) {
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

// 大于4M上传
const sliceSize = 4 * 1024 * 1024

function Upload(cosParams) {
    this.cosParams = cosParams;
    this.partNumber = 1;
    this.uploadedSize = 0;
    this.Parts = []
    this.tempSize = 0;
    this.tempBuffer = new Buffer('')
}

Upload.prototype.init = function (next) {
    const _this = this;
    cos.multipartInit(this.cosParams, function (err, data) {
        _this.UploadId = data.UploadId
        next()
    });
}
Upload.prototype.upload = function(partNumber, buffer) {
    const _this = this;
    const params = Object.assign({
        Body: bufferToStream(buffer),
        PartNumber: partNumber,
        UploadId: this.UploadId,
        ContentLength: buffer.length
    }, this.cosParams);
    cos.multipartUpload(params, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            _this.afterUpload(data.ETag, buffer, partNumber)
        }
    });
}


Upload.prototype.sendData = function (buffer) {
    
    this.tempSize += buffer.length;
    if (this.tempSize >= sliceSize) {
        this.upload(this.partNumber, Buffer.concat([this.tempBuffer, buffer]))
        this.partNumber++;
        this.tempSize = 0;
        this.tempBuffer = new Buffer('')
    } else {
        this.tempBuffer = Buffer.concat([this.tempBuffer, buffer]);
    }
}

Upload.prototype.afterUpload = function (etag, buffer, partNumber) {
    this.uploadedSize += buffer.length
    this.Parts.push({ ETag: etag, PartNumber: partNumber })
    if (this.uploadedSize == this.total) {
        this.complete();
    }
}

Upload.prototype.complete = function () {
    this.Parts.sort((part1, part2) => {
        return part1.PartNumber - part2.PartNumber
    });
    const params = Object.assign({
        UploadId: this.UploadId,
        Parts: this.Parts,
    }, this.cosParams);
    cos.multipartComplete(params, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log('Success!')
        }
    });
}

Upload.prototype.sendDataFinish = function (total) {
    this.total = total;
    this.upload(this.partNumber, this.tempBuffer);
}

module.exports = Upload;
