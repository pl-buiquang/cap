import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import config from 'config.json';
import CapMarker from './Marker';
import FullView from '../Alternative/FullView';

class CapMap extends Component {
  static propTypes = {
    actors: React.PropTypes.array,
    filters: React.PropTypes.object,
    updateBounds: React.PropTypes.func,
    position: React.PropTypes.array,
    actorView: React.PropTypes.string,
    actorMapFocus: React.PropTypes.string,
    closeActor: React.PropTypes.func,
  }

  componentDidMount = () => {
    const lMap = this.refs.map.leafletElement;
    lMap.on('moveend', () => this.props.updateBounds(lMap.getBounds()));
    this.props.updateBounds(lMap.getBounds());
    this.props.setMapRef(lMap);
  }

  componentWillUnmount = () => {
    this.props.setMapRef(null);
  }

  renderActor = (actor) => {
    return (
      <FullView map={this.renderMap('200px', actor ? [parseFloat(actor.lat), parseFloat(actor.lng)] : null)} actor={actor} close={this.props.closeActor}/>
    );
  }

  renderMap = (height, overridePosition = null) => {
    const {actors = [], filters, position} = this.props;
    console.log(overridePosition);
    return (
      <Map center={overridePosition || position} zoom={13} style={{height: height}}  ref="map" >
        <TileLayer
            url={config['tileLayerURL']}
            attribution='<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>'
      />
      {actors && actors.map((actor) => (
        <CapMarker 
          key={actor.id} 
          actor={actor} 
          focused={actor.id === this.props.actorView || (!this.props.actorView && actor.id === this.props.actorMapFocus)}
            />))
      }
      </Map>
    );
  }

  render() {
    const {actorView = null, actors} = this.props;
    const actor = actors.find(a => a.id === actorView);
    // TODO move this elsewhere...
    if (actorView && !actor) {
      this.props.closeActor();
    }
    return actor ? this.renderActor(actor) : this.renderMap('600px');
  }
}



export default CapMap;
