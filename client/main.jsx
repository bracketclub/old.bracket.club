let React = require('react');
let Router = require('react-router');
let {HistoryLocation, Redirect, Route, NotFoundRoute} = Router;
let _isNaN = require('lodash/lang/isNaN');
let {pageview} = require('./helpers/analytics');


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
let fullWidthRoutes = ['user', 'userCurrent', 'landing', 'entry'];
let routes = (
    <Route name='app' path='/' handler={App}>
        <Route name='subscribe' path='subscribe' handler={Pages.Subscribe} />

        <Route name='resultsCurrent' path='results' handler={Pages.Results} />
        <Route name='results' path='results/:year?' handler={Pages.Results} />
        <Redirect from='users' to='results' />

        <Route name='userCurrent' path='users/:id' handler={Pages.User} />
        <Route name='userProfile' path='users/:id/profile' handler={Pages.UserProfile} />
        <Route name='user' path='users/:id/:year?' handler={Pages.User} />

        <Route name='entry' path=':year/:bracket' handler={Pages.CreatedEntry} />
        <Route name='landing' path=':path?' handler={Pages.Landing} ignoreScrollBehavior={true} />

        <NotFoundRoute handler={Pages.FourOhFour} />
    </Route>
);


let routerContainer = require('./routerContainer');
let bracketHelpers = require('./helpers/bracket');
let globalDataActions = require('./actions/globalDataActions');
let bracketEntryActions = require('./actions/bracketEntryActions');
routerContainer.set(Router.create({
    routes,
    location: HistoryLocation
}));

routerContainer.get().run(function (Handler, router) {
    let possibleYear = router.params.year || router.params.path;
    let masterIndex = parseInt(router.query.game, 10);
    let routeName = router.routes[1].name;

    let props = {
        sport,
        game: _isNaN(masterIndex) ? null : masterIndex,
        year: rYear.test(possibleYear) ? possibleYear : year,
        fluid: fullWidthRoutes.indexOf(routeName) > -1
    };

    // Set the year from the url before rendering the page handler so all pages have it
    // TODO: is this the Right Way to update some globally relied upon store
    // before each page is rendered
    globalDataActions.updateYear(props.year);

    // Add the bracket from the url to the bracket entry store
    // only on the initial load (since the router action is null)
    // TODO: yada yada yada, is this the Right Way?
    let {regex} = bracketHelpers({sport, year: props.year});
    if (routeName === 'landing' && router.action === null && regex.test(router.params.path)) {
        bracketEntryActions.updateBracket(router.params.path);
    }

    // Call analytics on page change
    pageview(router.path);

    React.render(<Handler {...props} />, document.body);
});
