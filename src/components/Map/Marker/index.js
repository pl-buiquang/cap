import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import config from 'utils/config.js';


const getIcon = (typoId) => {
  const configData = config();
  const typology = configData["typology"];
  const typoInfo = typology.find(t => t.id == typoId);
  // TODO check if not found ! + add default icon
  if (!typoInfo) {
    return new L.Icon.Default();
  }
  return L.icon({
    iconUrl: typoInfo["img"]["small"],
    iconSize:     [26, 26], 
    iconAnchor:   [13, 13], 
    popupAnchor:  [-13, -13], 
    className:`typo-${typoId}`,
  });
}


export const getActorMarker = (actor) => {
  const {typo, lng, lat, adress, name} = actor;
  return {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    options: {
      icon: getIcon(typo),
      id: actor.id,
    },
    popup: `<span>${name}<br/>${adress}</span>`,
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