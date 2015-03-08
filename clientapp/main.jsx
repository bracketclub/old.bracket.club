require('babelify/polyfill');

// Require the alt singleton and then require each store so that
// they can be instantiated before we bootstrap the window data.
let alt = require('./alt');
require('./stores');
let {__timestamp, __sport: sport, __year: year} = window;

alt.bootstrap(JSON.stringify({
    GlobalDataStore: {sport, year},
    MasterStore: {},
    BracketEntryStore: {}
}));

let React = require('react');
let Router = require('react-router');
let {HistoryLocation, Redirect, Route, NotFoundRoute} = Router;

let Pages = require('./pages');
let App = require('./components/App');

let routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="results" path='results' handler={Pages.Results} />
        <Redirect from="users" to='results' />

        <Route name="user" path="users/:id" handler={Pages.User} />
        <Route name="subscribe" handler={Pages.Subscribe} />

        <Route name='bracket' path=':bracket?' handler={Pages.Entry} ignoreScrollBehavior={true} />

        <NotFoundRoute handler={Pages.FourOhFour} />
    </Route>
);

Router.run(routes, HistoryLocation, function (Handler) {
    React.render(<Handler lastUpdated={__timestamp} />, document.body);
});
