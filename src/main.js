import '!!file?name=favicon.ico!../public/favicon.ico';
import '!!file?name=favicon.png!../public/favicon.png';
import '!!file?name=favicon-192x192.png!../public/favicon-192x192.png';

import '../styles/app/index.less';

import 'babel-polyfill';

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

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
