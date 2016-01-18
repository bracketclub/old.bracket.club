import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

export default ({middleware = [], initialState = {}}) => {
  const middlewares = [thunk].concat(middleware);

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(require('redux-logger')());
  }

  const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
};
