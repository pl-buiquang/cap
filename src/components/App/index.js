import React, { Component } from 'react';
import { connect } from 'react-redux';
import Map from 'components/Map';
import LeftBar from 'components/LeftBar';
import * as actionCreators from 'rootReducer';
import {filterActors, filterActorsByViewport} from 'utils/utils';
import config from 'config.json';
import '../../../static/style/style.css';

const extractBounds = bounds => {
  const ne = bounds.getNorthEast && bounds.getNorthEast();
  const sw = bounds.getNorthEast && bounds.getSouthWest();
  return { sw, ne };
};

class App extends Component {
  componentDidMount() {
    this.props.searchActors('*');
  }
  render() {
    // filter actors here OR actors are filtered already via search ?
    // add filterActorsByViewport(this.props.bounds,a) to filter callback
    const actors = this.props.actors.filter(a => filterActors(a, this.props));
    return (
      <div style={{ width: '100%'}}>
        <div style={{ width: '50%', float: 'left'}}>
          <LeftBar {...this.props} filteredActors={actors} />
        </div>
        <div style={{ width: '50%', float: 'right' }}>
          <Map
            position={config["defaultMapPosition"]}
            actors={actors}
            updateBounds={this.props.updateBounds}
            actorView={this.props.actorView}
            actorMapFocus={this.props.actorMapFocus}
            closeActor={() => this.props.openActor(null)}
            setMapRef={this.props.setMapRef}
            filters={{zone: this.props.selectedZone, district: this.props.selectedDistrict}}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actors: state.actors,
  bounds: extractBounds(state.bounds),
  selectedZone: state.filters.zone,
  selectedTypos: state.filters.typos,
  selectedDistrict: state.filters.district,
  actorView: state.actorView,
  actorMapFocus: state.actorMapFocus,
  mapRef: state.mapRef,
});

export default connect(mapStateToProps, actionCreators)(App);
