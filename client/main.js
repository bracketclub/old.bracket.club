'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const {Router} = require('react-router');
const createBrowserHistory = require('history/lib/createBrowserHistory');
const _isNaN = require('lodash/lang/isNaN');
const {pageview} = require('./helpers/analytics');

// This builds our less file and all the loaders take care of the rest
require('../styles/index.less');

// This just moves our favicon (without renaming it based on hash) to our build dir
require('file?name=favicon.ico!../favicon.ico');

// Require the alt singleton
const alt = require('./alt');

// Some data is added to window via the build step
// Right now sport never changes, and year is used to set
// the active year of the contest
const {activeSport: sport, activeYear: year, rYear} = require('./global');
alt.bootstrap(JSON.stringify({
  GlobalDataStore: {sport, year},
  MasterStore: {}
}));

// Load the data that the app will always need
// It's pretty small right now (8.8kb gzip before 2015)
// but one day this will probably be moved to individual pages
// since the API can return data by year only
// Dont stream entries right now since we are deploying this after they are locked
// TODO: base this and master stream on locked
require('./actions/masterActions').fetchMasters({stream: false});
require('./actions/entryActions').fetchEntries({stream: false});

// Instantiate our firebase reference. This is only used to login
// with Twitter, so we setup an auth listener which will trigger a login action
const {firebase} = require('./global');
firebase.onAuth(require('./actions/meActions').login);

// Import routes and create our router and then set it on the router container
// so it can be imported by actions/stores
const routes = require('./routes');
const globalDataActions = require('./actions/globalDataActions');

const history = createBrowserHistory();

// const possibleYear = router.params.year || router.params.path;
// const masterIndex = parseInt(router.query.game, 10);
// const routeName = router.routes[1].name;

// const props = {
//   sport, // Sport is always the same for now
//   game: _isNaN(masterIndex) ? null : masterIndex,
//   year: rYear.test(possibleYear) ? possibleYear : year,
//   fluid: ['user', 'userCurrent', 'landing', 'entry'].indexOf(routeName) > -1
// };

// globalDataActions.updateYear(props.year);

// // pageview(router.path);

ReactDOM.render(<Router history={history}>{routes}</Router>, document.getElementById('root'));
