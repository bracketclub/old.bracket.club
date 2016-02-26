// Makes promise debugging betterer
window.onunhandledrejection = (e) => {throw e.reason;};

import '../styles/index.js2less';

import '!!file?name=favicon.ico!../public/favicon.ico';
import '!!file?name=favicon.png!../public/favicon.png';
import '!!file?name=favicon-192x192.png!../public/favicon-192x192.png';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';

import {pageview} from 'lib/analytics';
import firebase from 'lib/firebase';
import configureStore from './store/configureStore';
import routes from './routes';
import * as meActions from './actions/me';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// Google analytics for each history change
history.listen(pageview);

// Firebase will trigger the action if the user is logged in from a previous
// session when first loading the page
firebase.onAuth((auth) => store.dispatch(meActions.syncLogin(auth)));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
