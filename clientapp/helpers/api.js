let xhr = require('xhr');
let apiUrl = 'http://localhost:3001';

module.exports = function (path, action) {
    xhr({
        url: apiUrl + path,
    }, (err, resp, body) => {
        if (err) {
            console.error(err);
        } else {
            action(JSON.parse(body).response);
        }
    });
};
