/* global __STATIC__ */    // From webpack

let {apiUrl, staticUrl} = require('../global');
let loadData = require(__STATIC__ ? 'load-script' : 'xhr');


module.exports = function (path, cb) {
    if (__STATIC__) {
        loadData(staticUrl + path + '.js', (err) => {
            if (err) {
                cb(err);
            } else {
                // At the end of each year we export the latest data
                // as a js file, and then load it via rawgit here. The script
                // has the same name as the api route and assigns itself to a
                // global variable that is prefixed by __ and is named the same as the route
                cb(null, window['__' + path.slice(1)]);
            }
        });
    } else {
        loadData({
            url: apiUrl + path,
            useXDR: true
        }, (err, resp, body) => {
            if (err) {
                cb(err);
            } else {
                cb(null, JSON.parse(body).response);
            }
        });
    }
};
