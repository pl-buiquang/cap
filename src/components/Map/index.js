import React, { Component } from 'react';
import { Map, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import config from 'utils/config.js';
import {CapMarker, getActorMarker} from './Marker';
import FullView from '../Alternative/FullView';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.css';

class CapMap extends Component {
  static propTypes = {
    actors: React.PropTypes.array,
    filters: React.PropTypes.object,
    updateBounds: React.PropTypes.func,
    position: React.PropTypes.array,
    actorView: React.PropTypes.string,
    actorMapFocus: React.PropTypes.string,
    closeActor: React.PropTypes.func,
    openActor: React.PropTypes.func,
    defaultLocation: React.PropTypes.array,
  }

  latestPosition = null;

  state = {
    zoomEnabled: false,
  }

  enableZoom = () => {
    const {zoomEnabled} = this.state;
    if (!zoomEnabled) {
      this.setState({
        zoomEnabled: true,
      }, () => {
        if(this.mapRef){
          this.mapRef.scrollWheelZoom.enable();
        }
      });      
    }
  }

  componentDidMount = () => {
  }

  componentWillReceiveProps(newProps){
    if(this.props.defaultLocation && !newProps.defaultLocation){
      this.latestPosition = null;
      this.latestZoom = null;
    }
    if (newProps.actorMapFocus !== this.props.actorMapFocus){
      
    }
  }

  componentWillUnmount = () => {
    this.props.setMapRef(null);
  }

  setMapRef = (mapRef) => {
    const {actorView = null} = this.props;
    if (!actorView && mapRef && mapRef.leafletElement != this.mapRef) {
      const lMap = mapRef.leafletElement;
      this.props.updateBounds(lMap.getBounds());
      this.props.setMapRef(lMap);
      this.mapRef = lMap;      
      lMap.on('moveend', () => {
        this.props.updateBounds(lMap.getBounds());
        this.enableZoom();
      });
    }
  }

  setLatestPosition = () => {
    if (this.mapRef) {
      const pos = this.mapRef.getCenter();
      this.latestPosition = [pos.lat, pos.lng];
      this.latestZoom = this.mapRef.getZoom();
    }
  }

  renderActor = (actor) => {
    return (
      <FullView map={this.renderMap('200px', actor ? [parseFloat(actor.lat), parseFloat(actor.lng)] : null)} actor={actor} close={this.props.closeActor}/>
    );
  }

  renderMarkers = () => {
    const {actorMapFocus, actors = [], filters, position} = this.props;
    if (!actors.length) {
      return null;
    }
    return (
      <MarkerClusterGroup
        options={{
          showCoverageOnHover: false,
        }}
        enableDefaultStyle={true}
        onMarkerEnter={(marker) => { this.props.focusActor(marker.options.id);}}
        onMarkerLeave={(marker) => { this.props.focusActor(null); }}
        //onMarkerClick={(m) => m.openPopup()}
        markers=
          {actors && actors.map((actor) => (
            getActorMarker(actor)
          ))}
      />);
  }

  renderMarkers0 = () => {
    const {actors = [], filters, position} = this.props;
    return (actors && actors.map((actor) => (
          <CapMarker 
            key={actor.id} 
            actor={actor} 
            focused={actor.id === this.props.actorView || (!this.props.actorView && actor.id === this.props.actorMapFocus)}
              />))
        );
  }

  renderMap = (height, overridePosition = null) => {
    const {actors = [], filters, position} = this.props;
    const {zoomEnabled} = this.state;
    const configData = config();
    if (overridePosition && overridePosition != this.latestPosition) {
      this.setLatestPosition();
    }
    let zoom = overridePosition ? 17 : (this.latestZoom || (this.props.defaultLocation ? 15 :  6));
    return (
      <Map 
        center={overridePosition || this.latestPosition || this.props.defaultLocation || configData["defaultMapPosition"]}
        zoom={zoom}
        onClick={this.enableZoom}
        zoomControl={false}
        style={{height: '100%', width: '100%', position: 'absolute'}} 
        ref={mapRef => this.setMapRef(mapRef)}
        maxZoom={17}
        minZoom={6}
        scrollWheelZoom={zoomEnabled}
        //maxBounds={[[48.288675734823855, 0.8404541015625001],[49.37343174238158, 3.8726806640625004]]}
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
            url={configData['tileLayerURL']}
            attribution='<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>'
      />
        {this.renderMarkers()}
      </Map>
    );
  }

  render() {
    const {actorView = null, actors = []} = this.props;
    const actor = actors.find(a => a.id === actorView);
    // TODO move this elsewhere...
    if (actorView && !actor) {
      this.props.closeActor();
    }
    return actor ? this.renderActor(actor) : this.renderMap('600px');
  }
}



export default CapMap;
