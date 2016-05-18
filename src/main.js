// Makes promise debugging betterer
window.onunhandledrejection = (e) => {throw e.reason;};

import '../styles/index.js2less';

import '!!file?name=favicon.ico!../public/favicon.ico';
import '!!file?name=favicon.png!../public/favicon.png';
import '!!file?name=favicon-192x192.png!../public/favicon-192x192.png';

import 'babel-polyfill';

import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore} from 'react-router-redux';
import {attempt, isError} from 'lodash';

import {pageview} from 'lib/analytics';
import {auth} from 'lib/firebase';
import configureStore from './store/configureStore';
import routes from './routes';
import * as meActions from './actions/me';

const initialState = attempt(() => JSON.parse(window.localStorage.getItem(config.localStorage)));
const store = configureStore(isError(initialState) ? {} : initialState);
const history = syncHistoryWithStore(browserHistory, store);

// Google analytics for each history change
history.listen(pageview);

// Firebase will trigger the action if the user is logged in from a previous
// session when first loading the page. Note that this action is slightly different
// than the login action which contains the user and the twitter credentials
auth.onAuthStateChanged((user) => store.dispatch(meActions.loginUser(user)));

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
