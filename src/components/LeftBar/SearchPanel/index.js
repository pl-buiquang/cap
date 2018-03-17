import React, { Component } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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
    query: '',
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
        <select 
          style={STYLE_SELECT} 
          defaultValue={selectedTypos}
          onChange={(e) => this.props.selectTypos(e.target.value)}>
          {typology.map(typo => {
            return (
              <option 
                key={typo['id']}
                value={typo["id"]}>
                {typo["label"]}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  renderLocationSelector = () => {
    const {selectedZone} = this.props;
    const configData = config();
    const locations = [{id: "default", label: "partout"}].concat(configData["location"] || []);
    return (
      <div style={STYLE_ELT}>
        <select 
          style={STYLE_SELECT}
          defaultValue={selectedZone}
          onChange={(e) => {this.props.selectZone(e.target.value);}}
          >
          {locations.map(location => {
            return (
              <option 
                key={location['id']}
                value={location["id"]}>
                {location["label"]}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  searchActors = () => {
    const {query} = this.state;
    this.props.searchKeywords(query);
  }

  updateQuery = (input) => {
    const {query} = this.state;
    if (input.trim() !== query) {
      this.setState({
        query: input.trim()
      }, function(){
        if (!input.trim()){
          this.searchActors();
        }
      })
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.searchActors();
    }
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
        <div style={STYLE_ELT}>
          <input 
            name="search actor"
            type="text"
            defaultValue={selectedKeyword}
            style={STYLE_SEARCH}
            placeholder="mot clé, nom d'initiative, ..."
            onKeyPress={this.handleKeyPress}
            onChange={e => this.updateQuery(e.target.value)}
          />
        </div>
      </div>
    );
  }
}



export default SearchPanel;