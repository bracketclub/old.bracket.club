let React = require('react');
let Router = require('react-router');
let {HistoryLocation} = Router;

let app = require('./app');
let routes = require('./routes');


Router.run(routes, HistoryLocation, function (Handler) {
    React.render(<Handler user='lukekarrys' lastUpdated={app.lastUpdated} />, document.body);
});
