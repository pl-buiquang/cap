import React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

const position = [48.8566, 2.3522];
const marker = ({ lat, lon, name, adress }) => (
  <Marker key={`${lat}${lat}${lon}`} position={[parseFloat(lat), parseFloat(lon)]}>
    <Popup>
      <span>{name}<br/>{adress}</span>
    </Popup>
  </Marker>
);

const map = ({ actors = [] }) => (
  <Map center={position} zoom={13}>
    <TileLayer
      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    />
    {actors && actors.map(marker)}
  </Map>
);

export default map;
