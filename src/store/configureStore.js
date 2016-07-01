import config from 'config';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';
import {apiMiddleware} from 'redux-api-middleware';
import persistState from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';
import apiRelationsMiddleware from 'lib/reduxApiRelations';

export default (initialState = {}) => {
  const storeEnhancers = [
    persistState(
      compose(filter('me.twitterAuth'))(adapter(window.localStorage)),
      config.localStorage
    )
  ];

  const middleware = [
    thunk,
    routerMiddleware(browserHistory),
    apiMiddleware,
    apiRelationsMiddleware
  ];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(
      require('redux-logger')({
        collapsed: true,
        predicate: (getState, action) => action.type.indexOf('@@router') === -1
      })
    );
    storeEnhancers.push(
      window.devToolsExtension ? window.devToolsExtension() : (f) => f
    );
  }

  const store = createStore(
    rootReducer,
    initialState || {},
    compose(applyMiddleware(...middleware), ...storeEnhancers)
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
};
