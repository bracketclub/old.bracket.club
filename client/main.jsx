require('babelify/polyfill');

let React = require('react');
let Router = require('react-router');
let {HistoryLocation} = Router;
let _isNaN = require('lodash/lang/isNaN');
let {pageview} = require('./helpers/analytics');


// Require the alt singleton and then require each store so that
// they can be instantiated before we bootstrap the window data.
let alt = require('./alt');
require('./stores/bracketEntryStore');
require('./stores/entryStore');
require('./stores/globalDataStore');
require('./stores/masterStore');
require('./stores/meStore');


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


let routes = require('./routes');
let routerContainer = require('./routerContainer');
let globalDataActions = require('./actions/globalDataActions');
let fullWidthRoutes = ['user', 'userCurrent', 'landing', 'entry'];

routerContainer.set(Router.create({routes, location: HistoryLocation}));

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

    // Call analytics on page change
    pageview(router.path);

    React.render(<Handler {...props} />, document.body);
});
