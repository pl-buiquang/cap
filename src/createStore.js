import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'rootReducer';

const store = createStore(rootReducer, applyMiddleware(thunk));

if (module.hot) {
  module.hot.accept('rootReducer', () => {
    const nextReducer = require('rootReducer').default; // eslint-disable-line

    store.replaceReducer(nextReducer);
  });
}

export default store;
