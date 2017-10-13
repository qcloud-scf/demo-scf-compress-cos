const COS = require('cos-nodejs-sdk-v5');

const cos = new COS({
    AppId: '1251762227',
    SecretId: 'AKIDutrojKl3CKQZNAr763UXks05898Lmciu',
    SecretKey: '96VJ5tnlllkoqsvvybGtU3a7l5To6Md2',
});
const getObject = (event, callback) => {
    const Bucket = event.Bucket;
    const Key = event.Key;
    const Region = event.Region
    const params = {
        Region,
        Bucket,
        Key
    };
    cos.getObject(params, function (err, data) {
        if (err) {
            const message = `Error getting object ${Key} from bucket ${Bucket}.`;
            callback(message);
        } else {
            callback(null, data);
        }
    });
};

const multipartUpload = (config, callback) => {
    cos.multipartUpload(config, function (err, data) {
        if (err) {
            console.log(err);
        }
        callback && callback(err, data);
    });
};

const multipartInit = (config, callback) => {
    cos.multipartInit(config, function (err, data) {
        if (err) {
            console.log(err);
        }
        callback && callback(err, data);
    });
};

const multipartComplete = (config, callback) => {
    cos.multipartComplete(config, function (err, data) {
        if (err) {
            console.log(err);
        }
        callback && callback(err, data);
    });
};

const getBucket = (config, callback) => {
    cos.getBucket(config, function (err, data) {
        if (err) {
            console.log(err);
        }
        callback && callback(err, data);
    });
};


module.exports = {
    getObject,
    multipartUpload,
    multipartInit,
    multipartComplete,
    getBucket
};



