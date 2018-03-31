import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import config from 'utils/config.js';


 const getIcon = () => {

  return L.divIcon({
          className: 'eltd-map-marker-holder',
          iconSize: [24, 24],
          iconAnchor:   [7, 28],  
          popupAnchor:  [0, -40], 
          html: `<div id="cap-marker"><div class='pin'></div><div class='base'></div></div>`,
        });

}

class LightMap extends Component {
  static propTypes = {
    position: React.PropTypes.array,
  }



  render() {
    const {position} = this.props;
    const configData = config();
    return (
      <Map 
        center={position}
        zoom={16}
        zoomControl={false}
        style={{height: '100%', width: '100%'}} 
        maxZoom={17}
        minZoom={12}
        scrollWheelZoom={false}
      >
        <ZoomControl position="topleft" />
        <TileLayer
            url={configData['tileLayerURL']}
            attribution='<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>'/>
        <Marker
          position={position}
          icon = {getIcon()}
        />
      </Map>
    );
  }
}



export default LightMap;
