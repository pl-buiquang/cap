import React, { Component } from 'react';
import { connect } from 'react-redux';
import Map from 'components/Map';
import LeftBar from 'components/LeftBar';
import SearchPanel from 'components/LeftBar/SearchPanel';
import * as actionCreators from 'rootReducer';
import {filterActors, filterActorsByViewport} from 'utils/utils';
import config from 'utils/config.js';
import '../../../static/style/marker.css';

const extractBounds = bounds => {
  const ne = bounds._northEast;
  const sw = bounds._southWest;
  return { sw, ne };
};

class App extends Component {
  componentDidMount() {
    const {actors} = this.props;
    //this.props.searchActors('');
  }
  render() {
    // filter actors here OR actors are filtered already via search ?
    // add filterActorsByViewport(this.props.bounds,a) to filter callback
    const filteredActors = this.props.actors.filter(a => filterActors(a, this.props));
    const actors = filteredActors.filter(a => filterActorsByViewport(this.props.bounds, a));
    const configData = config();
    return (
      <div style={{ width: '100%', zIndex: 100}}>
        <SearchPanel {...this.props} filteredActors={actors}/>
        <div className="eltd-full-width-inner clearfix eltd-listing-items-with-map">
          <div className="eltd-map-holder">
            <div id="eltd-listing-multiple-map-holder" style={{position: 'relative', overflow: 'hidden'}}>
              <Map
                actors={actors}
                focusActor={this.props.focusActor}
                updateBounds={this.props.updateBounds}
                actorView={this.props.actorView}
                actorMapFocus={this.props.actorMapFocus}
                closeActor={() => this.props.openActor(null)}
                setMapRef={this.props.setMapRef}
                defaultLocation={this.props.defaultLocation}
                filters={{zone: this.props.selectedZone, district: this.props.selectedDistrict}}/>            
            </div>
          </div>
          <div className="eltd-listing-list eltd-advanced-search-holder" style={{marginTop:'50px'}}>
            <LeftBar {...this.props} filteredActors={actors} count={filteredActors.length}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actors: state.actors,
  bounds: extractBounds(state.bounds),
  sorting: state.sorting,
  selectedZone: state.filters.zone,
  selectedTypos: state.filters.typos,
  selectedKeywords: state.filters.keywords,
  selectedDistrict: state.filters.district,
  selectedKeyword: state.filters.query,
  actorView: state.actorView,
  actorMapFocus: state.actorMapFocus,
  mapRef: state.mapRef,
  defaultLocation: state.defaultLocation,
  searchLoading: state.searchLoading,
});

export default connect(mapStateToProps, actionCreators)(App);
