import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import config from 'config.json';
import * as Zones from '../../../utils/zones.js';
import * as Districts from '../../../utils/districts.js';


class SearchPanel extends Component {
  static propTypes = {
    searchActors: React.PropTypes.func,
    selectZone: React.PropTypes.func,
    selectDistrict: React.PropTypes.func,
    selectTypos: React.PropTypes.func,
    bounds: React.PropTypes.object,
    selectedTypos: React.PropTypes.array,
    selectedZone: React.PropTypes.string,
    selectedDistrict: React.PropTypes.string,
    mapRef: React.PropTypes.object,
  }

  state = {
    shownLocation: null,
  }

  getArrondOpts() {
    const zones = [];
    const zoneIds = Object.keys(config["zones"]);
    zoneIds.map(id => zones.push({...config["zones"][id], value: id}));
    return [{label: 'Tous', value: '0'}].concat(zones);
  }

  getDistrictOpts(zoneId) {
    return [{label: 'Tous', value: '0'}].concat(config["zones"][zoneId]["districts"].map(d => ({...d, value: d.id})));
  }


  selectTypo = (id) => {
    const {selectedTypos} = this.props;
    const index = selectedTypos.indexOf(id);
    if (index !== -1){
      this.props.selectTypos(selectedTypos.slice(0,index).concat(selectedTypos.slice(index + 1, selectedTypos.length)));
    } else {
      this.props.selectTypos(selectedTypos.concat([id]));
    }
  }

  mapShowLocation = (e, locationType, locationId) => {
    e.stopPropagation();
    if (!this.props.mapRef) {
      return;
    }
    console.log(this.props.mapRef);
    console.log(locationId);
    if (this.state.shownLocation) {
      this.props.mapRef.removeLayer(this.state.shownLocation);
    }
    if (locationId !== '0') {
      const locationLayer = L.polygon(locationType[`latlongs${locationId}`],{
          color:locationType['color']
        }).addTo(this.props.mapRef);
      this.setState({
        shownLocation: locationLayer,
      });
    } else {
      this.setState({
        shownLocation: null,
      });
    }
  }

  renderOption = type => option => {
    return (
      <div onMouseEnter={(e) => this.mapShowLocation(e, type, option.value)} onMouseLeave={(e) => this.mapShowLocation(e, type, '0')}>
        {option.label}
      </div>
    );
  }

  renderTypoSelector = () => {
    const {selectedTypos} = this.props;
    return (
      <div style={{display: 'flex'}}>
        {config["typology"].map(typo => (<div key={typo['id']} onClick={() => this.selectTypo(typo['id'])} style={{width: '128px', height: '64px', backgroundColor: typo["color"]}}>{typo["label"]}</div>))}
      </div>
    );
  }

  render() {
    const {selectedZone, selectedDistrict} = this.props;
    return (
      <div>
        <h1>{`${this.props.bounds.ne} ${this.props.bounds.sw}` }</h1>
        <input name="search actor" type="text" placeholder="search" onInput={ e => e.target.value.length && this.props.searchActors(e.target.value)}/>
        <Select
          searchable={false}
          value={selectedZone}
          options={this.getArrondOpts()}
          optionRenderer={this.renderOption(Zones)}
          onChange={({value}) => this.props.selectZone(value)}/>
        {selectedZone !== "0" ? 
          <Select
            searchable={false}
            value={selectedDistrict}
            options={this.getDistrictOpts(selectedZone)}
            optionRenderer={this.renderOption(Districts)}
            onChange={({value}) => this.props.selectDistrict(value)}/> : null
        }
        {this.renderTypoSelector()}
      </div>
    );
  }
}



export default SearchPanel;