import React from 'react';

const STYLE_CONTAINER = {
  marginTop: '50px',
  marginBottom: '50px',
  alignItems: 'center',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};

export default () => (
  <div style={STYLE_CONTAINER}>
    <div className={'cap-carto-loader'}></div>
  </div>
);