var qs = require('qs');
var _ = require('lodash');

// Convert query strings values of 'true' or 'false' to booleans
// before passing data to models
module.exports = function (str) {
    var obj = qs.parse(str || '');
    _.each(obj, function (value, key, list) {
        if (value === 'true' || value === 'false') {
            list[key] = value === 'true';
        }
    });
    return obj || {};
};