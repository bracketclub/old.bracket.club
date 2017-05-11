import config from 'config';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {apiMiddleware} from 'redux-api-middleware';
import persistState from 'redux-localstorage';
import adapter from 'redux-localstorage/lib/adapters/localStorage';
import filter from 'redux-localstorage-filter';
import apiRelationsMiddleware from 'lib/reduxApiRelations';
import rootReducer from '../reducers';

export default (initialState = {}) => {
  const storeEnhancers = [
    persistState(
      compose(
        filter(['twitterAuth', 'username', 'id'].map((i) => `me.${i}`))
      )(adapter(window.localStorage)),
      config.localStorage
    )
  ];

  const middleware = [
    thunk,
    apiMiddleware,
    apiRelationsMiddleware
  ];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(
      require('redux-logger').createLogger({
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
