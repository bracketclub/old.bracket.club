require('babelify/polyfill');

let React = require('react');
let Router = require('react-router');
let {HistoryLocation, Redirect, Route, NotFoundRoute} = Router;


// Require the alt singleton and then require each store so that
// they can be instantiated before we bootstrap the window data.
let alt = require('./alt');
require('./stores');


// Some data is added to window via the build step
// Right now sport never changes, and year is used to set
// the active year of the contest
let {activeSport: sport, activeYear: year, rYear} = require('./global');
alt.bootstrap(JSON.stringify({
    GlobalDataStore: {sport, year},
    MasterStore: {}
}));


// Load the data that the app will always need
// It's pretty small right now (8.8kb gzip before 2015)
// but one day this will probably be moved to individual pages
// since the API can return data by year only
require('./actions/masterActions').fetchMasters();
require('./actions/entryActions').fetchEntries();


// Instantiate our firebase reference. This is only used to login
// with Twitter, so we setup an auth listener which will trigger a login action
let {firebase} = require('./global');
firebase.onAuth(require('./actions/meActions').login);


let Pages = require('./pages');
let App = require('./components/App');
let routes = (
    <Route name='app' path='/' handler={App}>
        <Route name='results' path='results/:year?' handler={Pages.Results} />
        <Redirect from='users' to='results' />

        <Route name='user' path='users/:id' handler={Pages.User} />
        <Route name='entry' path='users/:id/:year' handler={Pages.UserEntry} />
        <Route name='subscribe' handler={Pages.Subscribe} />

        <Route name='landing' path=':path?' handler={Pages.Landing} ignoreScrollBehavior={true} />

        <NotFoundRoute handler={Pages.FourOhFour} />
    </Route>
);

let globalDataActions = require('./actions/globalDataActions');
Router.run(routes, HistoryLocation, function (Handler, router) {
    let possibleYear = router.params.year || router.params.path;
    let props = {
        sport,
        year: rYear.test(possibleYear) ? possibleYear : year
    };
    console.log(props.year);
    globalDataActions.updateYear(props.year);
    React.render(<Handler {...props} />, document.body);
});
