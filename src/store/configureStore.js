import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

export default ({middleware = [], initialState = {}}) => {
  const middlewares = [thunk].concat(middleware);

  if (process.env.NODE_ENV !== 'production') {
    const {localStorage} = window;
    const key = 'tyblog';
    middlewares.push(require('redux-logger')({
      predicate: () => localStorage.getItem(key) !== key
    }));
    window._toggleLogs = () => localStorage.getItem(key) === null
      ? localStorage.setItem(key, key)
      : localStorage.removeItem(key);
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
