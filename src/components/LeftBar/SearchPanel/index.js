import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import config from 'config.json'; 

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
          onChange={({value}) => this.props.selectZone(value)}/>
        {selectedZone !== "0" ? 
          <Select
            searchable={false}
            value={selectedDistrict}
            options={this.getDistrictOpts(selectedZone)}
            onChange={({value}) => this.props.selectDistrict(value)}/> : null
        }
        {this.renderTypoSelector()}
      </div>
    );
  }
}



export default SearchPanel;