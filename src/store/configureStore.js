import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

export default ({middleware = []} = {}) => {
  const storeEnhancers = [];

  if (process.env.NODE_ENV !== 'production') {
    const {localStorage} = window;
    const key = 'tyblog';
    middleware.push(require('redux-logger')({
      predicate: () => localStorage.getItem(key) !== key
    }));
    window._toggleLogs = () => localStorage.getItem(key) === null
      ? localStorage.setItem(key, key)
      : localStorage.removeItem(key);
  }

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk, ...middleware),
      ...storeEnhancers
    )
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
};
