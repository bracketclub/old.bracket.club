let range = require('lodash/utility/range');


module.exports = {
    years: range(2012, parseInt(window.__year) + 1).map(String),
    apiUrl: 'http://localhost:3001'
};