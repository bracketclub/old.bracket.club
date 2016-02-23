import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import {routerMiddleware} from 'react-router-redux';
import {browserHistory} from 'react-router';

export default (initialState = {}) => {
  const storeEnhancers = [];
  const middleware = [thunk, routerMiddleware(browserHistory)];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(require('redux-logger')());
  }

  const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...storeEnhancers)
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
};
