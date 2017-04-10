import '!!file?name=favicon.ico!../public/favicon.ico';
import '!!file?name=favicon.png!../public/favicon.png';
import '!!file?name=favicon-192x192.png!../public/favicon-192x192.png';

import '../styles/index.less';

import 'babel-polyfill';

import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';

import {pageview} from 'lib/analytics';
import {auth} from 'lib/firebase';
import configureStore from './store/configureStore';
import routes from './routes';
import * as meActions from './actions/me';
import * as mastersActions from './actions/masters';
import * as entriesActions from './actions/entries';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// Google analytics for each history change
// Use getCurrentLocation since first call has no location
// https://github.com/reactjs/react-router-redux/issues/475
history.listen((location) => pageview(location || history.getCurrentLocation()));

// Firebase will trigger the action if the user is logged in from a previous
// session when first loading the page. Note that this action is slightly different
// than the login action which contains the user and the twitter credentials
auth.onAuthStateChanged((user) => store.dispatch(meActions.loginUser(user)));

// Add debugging helperts to global
if (process.env.NODE_ENV !== 'production') window.bc = require('lib/debug')(store);

// Start SSE handlers for things that will be used across multiple pages
// These can be called for all events because the SSE handlers will bailout
// based on if the event is live or not
config.events.forEach((event) => {
  mastersActions.sse(event)(store.dispatch, store.getState);
  entriesActions.sse(event)(store.dispatch, store.getState);
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
