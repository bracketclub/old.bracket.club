let xhr = require('xhr');
let {apiUrl} = require('../global');


module.exports = function (path, cb) {
    xhr({
        url: apiUrl + path,
        useXDR: true
    }, (err, resp, body) => {
        if (err) {
            cb(err);
        } else {
            cb(null, JSON.parse(body).response);
        }
    });
};
