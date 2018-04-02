import React, { Component } from 'react';
import Select from 'react-select';
import config from 'utils/config.js';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import searchImage from '../../../../static/img/search.png'
import rollingDices from '../../../../static/img/rolling-dices.png'
import {altInfo} from '../../../services/requests';

const STYLE_SEARCH_CONTAINER = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 105,
  background: '#fff',
  flexWrap: 'wrap',
}

const STYLE_ELT = {
  margin: '5px',
}

const STYLE_SEARCH = {
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right',
  paddingRight: '35px',
  backgroundImage: `url(${searchImage})`,
  margin: '0',
  paddingLeft: '4px',
  height: '35px',
  marginBottom: '4px',
  border: 0,
  borderBottom: '1px solid #646464',
}

const STYLE_HINT = {
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
}

const STYLE_INFO_POPUP = {
  position: 'absolute',
  zIndex: '9999',
  backgroundColor: '#fff',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
}

const STYLE_INFO_POPUP_CLOSE = {
  height: '20px',
  width: '100%',
  backgroundColor: 'grey',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#fff',
}


const STYLE_TYPO_IMAGE = {
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  backgroundSize: 'cover',
  height: '64px',
  width: '64px',
}

const STYLE_TYPO_LABEL = {
  width: '100px',
  marginLeft: '10px',
}

const STYLE_OPTIONS = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const STYLE_SELECT = {
  border: 0,
  padding: '10px',
  fontFamily: 'inherit',
}

const STYLE_BUTTON = {
  width: '182px',
  height: '64px',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '10px',
  cursor: 'pointer',  
};

const style_typo = (color, opacity='1') => ({
  width: '182px',
  height: '64px',
  backgroundColor: '#fff',
//  opacity: opacity,
  filter: opacity === '1' ? 'none' : 'grayscale(.95) contrast(1) brightness(1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flexStart',
//  padding: '4px',
  margin: '10px',
  fontFamily: 'Open Sans',
  cursor: 'pointer',
  borderRadius: '32px 0 0 32px',
});

class SearchPanel extends Component {
  static propTypes = {
    searchActors: React.PropTypes.func,
    filteredActors: React.PropTypes.array,
    selectTypos: React.PropTypes.func,
    selectZone: React.PropTypes.func,
    selectedZone: React.PropTypes.string,
    selectedTypos: React.PropTypes.string,
    selectedKeyword: React.PropTypes.string,
    bounds: React.PropTypes.object,
    mapRef: React.PropTypes.object,
  }

  state = {
    shownLocation: null,
    showInfo: false,
    infoData: null,
  }

  mapShowLocation = (e, locationType, locationId) => {
    e.stopPropagation();
    if (!this.props.mapRef) {
      return;
    }
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
    const configData = config();
    const typology = [{id: "default", label: "toutes les thématiques"}].concat(configData["typology"] || []);
    return (
      <div style={STYLE_ELT}>
        <Select 
          className={"cap-carto-search-select"} 
          value={selectedTypos}
          options={
            typology.map(typo => ({
              value: typo['id'],
              label: typo["label"]
            }))
          }
          style={{width: '200px'}}
          onChange={(e) => this.props.selectTypos(e ? e.value : "default")}>
        </Select>
      </div>
    );
  }

  renderLocationSelector = () => {
    const {selectedZone} = this.props;
    const configData = config();
    const locations = [{id: "default", label: "partout", clearable: false}].concat(configData["location"] || []);
    return (
      <div style={STYLE_ELT}>
        <Select 
          value={selectedZone}
          options={
            locations.map(location => ({
              value: location['id'],
              label: location["label"]
            }))
          }
          className={"cap-carto-search-select"}
          style={{width: '100px'}}
          onChange={(e) => {this.props.selectZone(e ? e.value : "default");}}
          >
        </Select>
      </div>
    );
  }

  renderTagsSelector = () => {
    const {selectedKeyword = ""} = this.props;
    console.log(selectedKeyword, "q")
    const configData = config();
    const tags = configData["tags"] || [];
    const selectedKeywords = selectedKeyword.split(",");
    const selectedTags = selectedKeywords.map(k => tags.find(t => t.label === k)).filter(o => o).map(t => t.id);
    return (
      <div style={STYLE_ELT}>
        <Select 
          value={selectedTags}
          options={
            tags.map(tag => ({
              value: tag['id'],
              label: tag["label"]
            }))
          }
          placeholder = {"Type"}
          multi
          style={{width: '200px'}}
          className={"cap-carto-search-select"}
          onChange={(e) => {
            console.log(e, "d");
            if (e.length > 1) {
              this.updateQuery(e.slice(1).reduce((query, term) => query + "," + term.label, e[0].label));
            } else if (e.length == 1) {
              this.updateQuery(e[0].label);  
            } else {
              this.updateQuery("");  
            }
          }}
          >
        </Select>
      </div>
    );
  }


  updateQuery = (input) => {
    this.props.searchKeywords(input);
  }

  showRandom = () => {
    const {filteredActors} = this.props;
    if (filteredActors) {
      const actorId = Math.floor(Math.random() * filteredActors.length);
    }
  }

  localizeMe = () => {
    const {userLocation} = this.state;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.props.setDefaultLocation(null);
        this.props.setDefaultLocation([position.coords.latitude,position.coords.longitude]);
      });    
    } else {
        alert("La géolocalisation n'est pas disponible sur votre navigateur.");
    }

  }

  render() {
    const {selectedZone, selectedDistrict, selectedKeyword} = this.props;
    return (
      <div style={STYLE_SEARCH_CONTAINER} className={"cap-search-bar"}>
        <div style={{...STYLE_ELT, fontSize: '24px'}}>Je souhaite</div>
        {this.renderTypoSelector()}
        <div style={{...STYLE_ELT, fontSize: '24px'}}>
        à
        </div>
        {this.renderLocationSelector()}
        <div style={{...STYLE_ELT, fontSize: '24px'}}>
        et plus particulièrement
        </div>
        {this.renderTagsSelector()}
      </div>
    );
  }
}



export default SearchPanel;