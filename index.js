// require modules
const fs = require('fs');
const archiver = require('archiver');

const cos = require('./cos');

const Upload = require('./Upload')

const TempWriteStream = require('./TempWriteStream')

const start = new Date();

const getDirFileList = (region, bucket, dir, next) => {
    const cosParams = {
        Bucket: bucket,
        Region: region,
    }
    const params = Object.assign({ Prefix: dir }, cosParams);

    cos.getBucket(params, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            let fileList = [];
            data.Contents.forEach(function (item) {
                if (!item.Key.endsWith('/')) {
                    fileList.push(item.Key)
                }
            });
            next && next(fileList)
        }
    })
}

const handler = (region, bucket, source, target) => {

    const cosParams = {
        Bucket: bucket,
        Region: region,
    }
    const multipartUpload = new Upload(Object.assign({ Key: target}, cosParams));

    const output = TempWriteStream({ handlerBuffer: multipartUpload.sendData.bind(multipartUpload) })

    var archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    output.on('finish', function () {
        multipartUpload.sendDataFinish(archive.pointer());
    });

    output.on('error', function (error) {
        console.log(error);
    });

    archive.on('error', function (err) {
        console.log(err)
    });

    archive.pipe(output);

    multipartUpload.init(function () {
        getDirFileList(region, bucket, source, function(fileList) {
            let count = 0;
            const total = fileList.length;
            for (let fileName of fileList) {
                ((fileName) => {
                    let getParams = Object.assign({ Key: fileName }, cosParams)
                    cos.getObject(getParams, (err, data) => {
                        if (err) {
                            console.log(err)
                            return
                        }
                        var buffer = data.Body;
                        console.log("download file "+fileName);
                        archive.append(buffer, { name: fileName.split('/').pop() });
                        console.log("zip file "+fileName);
                        count++;
                        if (count == total) {
                            console.log("finish zip "+count+" files")
                            archive.finalize();
                        }
                    })
                })(fileName)
            }
        })
    })
}

exports.main_handler = (event, context, callback) => {
    var region = event["region"];
    var bucket = event["bucket"];
    var source = event["source"];
    var zipfile = event["zipfile"];
    //handler('ap-guangzhou', 'testpcode1', 'pic/', 'pic.zip');
    handler(region, bucket, source, zipfile)
}
