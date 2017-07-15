import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'createStore.js';
import App from './components/App';

const MOUNT_NODE = document.getElementById('root');
const __DEV__ = false;

const render = (nodeId = MOUNT_NODE) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    nodeId
  );
};


// remove this for production lib bundle
render();

export default render;

