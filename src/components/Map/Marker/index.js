import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import config from 'utils/config.js';


const getIcon = (id) => {

  return L.divIcon({
          className: 'eltd-map-marker-holder',
          iconSize: [24, 24],
          iconAnchor:   [7, 28],  
          popupAnchor:  [0, -40], 
          html: `<div id="cap-marker-${id}"><div class='pin'></div><div class='base'></div></div>`,
        });

}


export const getActorMarker = (actor) => {
  const {typo, lng, lat, adress, name, url} = actor;
  return {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    options: {
      icon: getIcon(actor.id),
      id: actor.id,
      type: "capmarker",
    },
    riseOnHover: true,
    popup: `<div style="font-weight: bold; cursor: pointer;" onclick="window.location = '${url}'">${name}</div><div>${adress}</div>`,
  }
}

class CapMarker extends Component {
  static propTypes = {
    actor: React.PropTypes.object,
  }

  componentDidUpdate() {
    if (this.props.focused) {
      this.refs.marker.leafletElement.openPopup();  
    }
  }


  renderPopup = () => {
    const {name, adress} = this.props.actor;
    return (
      <span>{name}<br/>{adress}<div onClick={this.props.actor}>more</div></span>
    );
  }

  render() {
    const {typo, lng, lat, adress} = this.props.actor;
    return (
      <Marker position={[parseFloat(lat), parseFloat(lng)]} icon={getIcon(typo)} ref={"marker"}>
        <Popup>
          {this.renderPopup()}
        </Popup>
      </Marker>
    );
  }
}

export default CapMarker;