let extend = require('lodash/object/extend');
let partial = require('lodash/function/partial');


// This is a bit of a pain, but there exist links in the app to change the
// current page to a different year. We need to know how to convert any pathname
// to a different year. This needs to be kept consistent with the above routes.
// TODO: find a way to automatically determine from routes
module.exports = {
    getYearPathname () {
        let route = this.getRoutes()[1];
        let params = this.getParams();
        let query = this.getQuery();

        let addYear = function (obj, year) {
            return extend({}, obj, year || {});
        };

        if (route.name === 'user') {
            return {to: 'user', params: partial(addYear, params), query: query};
        }
        else if (route.name === 'entry') {
            return {to: 'entry', params: partial(addYear, params), query: query};
        }
        else {
            return {to: 'landing', params: partial(addYear, {}), query: query};
        }
    }
};