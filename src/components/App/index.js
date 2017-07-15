import React, { Component } from 'react';
import { connect } from 'react-redux';
import Map from 'components/Map';
import LeftBar from 'components/LeftBar';
import SearchPanel from 'components/LeftBar/SearchPanel';
import * as actionCreators from 'rootReducer';
import {filterActors, filterActorsByViewport} from 'utils/utils';
import config from 'utils/config.js';
import '../../../static/style/style.css';

const extractBounds = bounds => {
  const ne = bounds._northEast;
  const sw = bounds._southWest;
  return { sw, ne };
};

class App extends Component {
  componentDidMount() {
    this.props.searchActors('');
  }
  render() {
    // filter actors here OR actors are filtered already via search ?
    // add filterActorsByViewport(this.props.bounds,a) to filter callback
    const actors = this.props.actors.filter(a => filterActors(a, this.props)).filter(a => filterActorsByViewport(this.props.bounds, a));
    const configData = config();
    return (
      <div style={{ width: '100%'}}>
        <SearchPanel {...this.props} filteredActors={actors}/>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{ flex: '0 0 40%'}}>
            <LeftBar {...this.props} filteredActors={actors} />
          </div>
          <div style={{ flex: '0 0 58%' }}>
            <Map
              actors={actors}
              updateBounds={this.props.updateBounds}
              actorView={this.props.actorView}
              actorMapFocus={this.props.actorMapFocus}
              closeActor={() => this.props.openActor(null)}
              setMapRef={this.props.setMapRef}
              openActor={this.props.openActor}
              defaultLocation={this.props.defaultLocation}
              filters={{zone: this.props.selectedZone, district: this.props.selectedDistrict}}/>
          </div>
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
  defaultLocation: state.defaultLocation,
});

export default connect(mapStateToProps, actionCreators)(App);
