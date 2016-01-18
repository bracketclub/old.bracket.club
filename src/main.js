'use strict';

import '../styles/index.less';
import 'file?name=favicon.ico!../public/favicon.ico';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from 'react-router';
import {createHistory} from 'history';
import {Provider} from 'react-redux';
import {syncHistory} from 'redux-simple-router';

import firebase from './lib/firebase';
import configureStore from './store/configureStore';
import routes from './routes';
import * as meActions from './actions/me';

const history = createHistory();
const reduxRouterMiddleware = syncHistory(history);
const store = configureStore({
  middleware: [reduxRouterMiddleware]
});

// Firebase will trigger the action if the user is logged in from a previous
// session when first loading the page
firebase.onAuth((auth) => store.dispatch(meActions.syncLogin(auth)));

reduxRouterMiddleware.listenForReplays(store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
