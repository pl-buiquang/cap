import React, { Component } from 'react';
import Map from 'components/Map';
import LeftBar from 'components/LeftBar';

export default class MapPage extends Component {
  render() {
    return (
      <div style={{ width: '100%'}}>
        <div style={{ width: '50%', float: 'left'}}>
          <LeftBar />
        </div>
        <div style={{ width: '50%', float: 'right' }}>
          <Map />
        </div>
      </div>
    );
  }
}
