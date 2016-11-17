import React from 'react';
import ReactDOM from 'react-dom';
import MapPage from './components/MapPage';

const MOUNT_NODE = document.getElementById('root');
const __DEV__ = true;

let render = () => {
  ReactDOM.render(
    <MapPage />,
    MOUNT_NODE
  );
};

if (__DEV__) {
  if (module.hot) {
    const renderApp = render;
    const renderError = (error) => {
      const RedBox = require('redbox-react').default; // eslint-disable-line
      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
    };

    render = () => {
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    };
  }
}

render();
