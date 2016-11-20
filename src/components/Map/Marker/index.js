import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import config from 'config.json';


class CapMarker extends Component {
  static propTypes = {
    actor: React.PropTypes.object,
  }

  componentDidUpdate() {
    if (this.props.focused) {
      this.refs.marker.leafletElement.openPopup();  
    }
  }

  getIcon = (typoId) => {
    const typology = config["typology"];
    const typoInfo = typology.find(t => t.id == typoId);
    // TODO check if not found ! + add default icon
    if (!typoInfo) {
      console.log(typoId);
      console.log(this.props.actor);
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

  renderPopup = () => {
    const {name, adress} = this.props.actor;
    return (
      <span>{name}<br/>{adress}</span>
    );
  }

  render() {
    const {typo, lng, lat, adress} = this.props.actor;
    return (
      <Marker position={[parseFloat(lat), parseFloat(lng)]} icon={this.getIcon(typo)} ref={"marker"}>
        <Popup>
          {this.renderPopup()}
        </Popup>
      </Marker>
    );
  }
}

export default CapMarker;