import React from 'react';
import { Map, Marker, Popup, TileLayer, MapComponent } from 'react-leaflet';
import config from 'config.json';

const position = [48.8566, 2.3522];

// const icon = L.icon({
//     iconUrl: '/static/img/typologEconomie-partagee-et-finance-solidaire_small.png',
//     iconSize: [38, 95],
//     iconAnchor: [22, 94],
//     popupAnchor: [-3, -76],
//     shadowSize: [68, 95],
//     shadowAnchor: [22, 94]
// });

const marker = ({ lat, lon, name, adress }) => (
  <Marker key={`${name}${lat}${lon}`} position={[parseFloat(lat), parseFloat(lon)]} >
    <Popup>
      <span>{name}<br/>{adress}</span>
    </Popup>
  </Marker>
);

class CapMap extends MapComponent {

  render(){
    const {actors = []} = this.props;
    return (
      <Map center={position} zoom={13} style={{height: '600px'}}>
        <TileLayer
          url={config['tileLayerURL']}
          attribution='<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>'
        />
        {actors && actors.map(marker)}
      </Map>
    );
  }
}



export default CapMap;
