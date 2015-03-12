let {State} = require('react-router');

let extend = require('lodash/object/extend');
let partial = require('lodash/function/partial');


// This is a bit of a pain, but there exist links in the app to change the
// current page to a different year. We need to know how to convert any pathname
// to a different year. This needs to be kept consistent with the ./routes.jsx file.
// TODO: find a way to automatically determine from routes
let yearRoutes = ['user', 'entry', 'results'];
let defaultTo = 'landing';
let yearParamNames = {landing: 'path'};

module.exports = extend({
    getYearPathname () {
        let route = this.getRoutes()[1];
        let params = this.getParams();
        let query = this.getQuery();

        let sendTo = yearRoutes.indexOf(route.name) > -1 ? route.name : defaultTo;
        let yearParamName = yearParamNames[sendTo] || 'year';

        let addYear = function (obj, year) {
            let toAdd = {[yearParamName]: year};
            return extend({}, obj, toAdd);
        };

        return {
            to: sendTo,
            query: query, // TODO: maybe need to only send certain query params to landing page
            params: partial(addYear, sendTo === defaultTo ? {} : params)
        };
    }
}, State);