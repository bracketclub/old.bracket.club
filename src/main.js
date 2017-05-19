import '!!file-loader?name=favicon.ico!../public/favicon.ico';
import '!!file-loader?name=favicon.png!../public/favicon.png';
import '!!file-loader?name=favicon-192x192.png!../public/favicon-192x192.png';
import '../styles/index.less';

import 'babel-polyfill';
import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {pageview} from 'lib/analytics';
import {auth} from 'lib/firebase';
import history from 'lib/history';
import configureStore from './store/configureStore';
import * as meActions from './actions/me';
import * as mastersActions from './actions/masters';
import * as entriesActions from './actions/entries';
import * as eventActions from './actions/event';
import App from './App';

const store = configureStore();

// Analytics for each page and current page
history.listen(pageview);
pageview(history.location);

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
  eventActions.countdown(event)(store.dispatch, store.getState);
});

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
);
