'use strict';

const {apiUrl, staticUrl} = require('../global');
const loadData = require(__STATIC__ ? 'load-script' : 'xhr');

const api = (path, cb) => {
  if (__STATIC__) {
    loadData(`${staticUrl}${path}.js`, (err) => {
      if (err) {
        return cb(err);
      }
      // At the end of each year we export the latest data
      // as a js file, and then load it via rawgit here. The script
      // has the same name as the api route and assigns itself to a
      // global variable that is prefixed by __ and is named the same as the route
      cb(null, window[`__${path.slice(1)}`]);
    });
  }
  else {
    loadData({
      url: apiUrl + path,
      useXDR: true
    }, (err, resp, body) => {
      if (err) {
        return cb(err);
      }

      cb(null, JSON.parse(body).response);
    });
  }
};

module.exports = api;
