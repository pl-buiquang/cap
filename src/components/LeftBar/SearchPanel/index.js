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
  flexDirection: 'column',
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

const STYLE_TYPO_CONTAINER = {
  margin: '10px 0',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  borderLeft: '1px solid #fff'
};

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
    bounds: React.PropTypes.object,
    selectedTypos: React.PropTypes.array,
    mapRef: React.PropTypes.object,
  }

  state = {
    shownLocation: null,
    showInfo: false,
    infoData: null,
    query: '',
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
    const typology = configData["typology"];
    return (
      <div style={STYLE_TYPO_CONTAINER}>
        {configData["typology"].map(typo => {
          const index = selectedTypos.indexOf(typo['id']);
          const opacity = selectedTypos.length && index === -1 ? '0.25' : '1';
          const typoInfo = typology.find(t => t.id == typo['id']);
          const typoImg = typoInfo && typoInfo["img"]["big"];
          return (
            <div 
              key={typo['id']}
              onClick={() => this.selectTypo(typo['id'])}
              className="cap-carto-typo-select"
              style={{
                ...(style_typo(typo["color"], opacity)), 
                ...(opacity === '0.25' ? {boxShadow: '0px 6px 10px rgba(0,0,0,0.2)'} : {}),
                ...({fontSize: `${(typo['label'].length > 30 ? '14' : '16')}px`})
              }}
            >
              <div style={{...STYLE_TYPO_IMAGE, backgroundImage: `url(${typoImg})`}} />
              <div style={STYLE_TYPO_LABEL}>{typo["label"]}</div>
            </div>
          );
        })}
      </div>
    );
  }

  showInfo = () => {
    const {infoData, showInfo} = this.state;
    if (showInfo) {
      this.setState({
        showInfo: false,
      });
      return;
    }
    if (!infoData) {
      altInfo().then(data => {
        this.setState({
          infoData: data,
          showInfo: true,
        });
      }).catch(e => {
        console.log(e);
        this.setState({
          infoData: null,
          showInfo: false,
        });
      });
    }else{
      this.setState({
        showInfo: true,
      });      
    }
  }

  renderInfo = () => {
    const {infoData, showInfo} = this.state;
    if (showInfo && infoData) {
      return (
          <div style={STYLE_INFO_POPUP} key="popup-info">
            <div onClick={this.showInfo} style={STYLE_INFO_POPUP_CLOSE}>Fermer</div>
            <div dangerouslySetInnerHTML={{__html: infoData}} />
            <div onClick={this.showInfo} style={STYLE_INFO_POPUP_CLOSE}>Fermer</div>
          </div>
      );      
    }
  }

  searchActors = () => {
    const {query} = this.state;
    this.props.searchActors(query);
  }

  updateQuery = (input) => {
    const {query} = this.state;
    if (input.trim() !== query) {
      this.setState({
        query: input.trim()
      }, function(){
        this.searchActors();
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
      this.props.openActor(filteredActors[actorId].id);
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
    const {selectedZone, selectedDistrict} = this.props;
    return (
      <div style={STYLE_SEARCH_CONTAINER}>
        <input 
          name="search actor"
          type="text"
          style={STYLE_SEARCH}
          placeholder="mot clé, nom d'initiative, ..."
          onKeyPress={this.handleKeyPress}
          onChange={e => this.updateQuery(e.target.value)}
        />
        <div style={STYLE_HINT} className="cap-carto-alt-info-hint" onClick={this.showInfo}>Qu'est ce qu'une alternative citoyenne ?</div>
        <ReactCSSTransitionGroup
          transitionName="slider"
          transitionAppear={true}
          transitionAppearTimeout={500}
          transitionAppear={true}
          transitionEnter={true}
          transitionEnterTimeout={500}
          transitionLeave={true}
          transitionLeaveTimeout={500}>
          {this.renderInfo()}
        </ReactCSSTransitionGroup>
        <div style={STYLE_OPTIONS}>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className="cap-carto-typo-select" style={{...STYLE_BUTTON}} onClick={this.localizeMe}>
              <i className="fa fa-location-arrow" aria-hidden="true" style={{fontSize: '30px'}}></i>
              <div style={{marginLeft: '10px', fontSize: '15px'}}>Autour de moi</div>
            </div>
            <div className="cap-carto-typo-select" style={{...STYLE_BUTTON}} onClick={this.showRandom}>
              <div style={{backgroundImage: `url(${rollingDices})`, width: '30px', height: '30px'}} />
              <div style={{marginLeft: '10px'}}>Au hasard</div>
            </div>
          </div>
          {this.renderTypoSelector()}
        </div>
      </div>
    );
  }
}



export default SearchPanel;