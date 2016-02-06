import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

export default ({middleware = []} = {}) => {
  const storeEnhancers = [];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(require('redux-logger')());
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
