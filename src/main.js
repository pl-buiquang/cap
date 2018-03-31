import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'createStore.js';
import App from './components/App';
import MapLight from './components/Map/Light';

const MOUNT_NODE = document.getElementById('cap-custom-result');
const __DEV__ = false;

const render = (nodeId = MOUNT_NODE) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    nodeId
  );
};


if (MOUNT_NODE) {
  render();
}

export const renderLight = (nodeId, position) => {
  ReactDOM.render(
    <MapLight position={position} />,
    document.getElementById(nodeId)
  );
};

export default render;


