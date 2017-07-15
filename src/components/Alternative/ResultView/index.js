import React from 'react';
import config from '../../../utils/config.js';


const STYLE_ALT_LIST_EXP_CONTAINER = {
  display: 'flex',
  padding: '10px',
  margin: '0px 15px 5px 0px',
  cursor: 'pointer',
  backgroundColor: '#fff',
};

const STYLE_ALT_LIST_EXP_LEFT = {
  flex: '0 0 25%'
};

const STYLE_TYPO = {
  flex: '0 0 26px',
  height: '26px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  backgroundSize: 'cover',
}

const STYLE_HEADER = {
  display: 'flex',
  justifyContent: 'space-between',
}

const STYLE_CONTENT = {
  paddingLeft: '15px',
}

const STYLE_NAME = {
  fontFamily: 'Bebas Neue',
  fontSize: '26px',
  marginLeft: '15px',
}

const STYLE_ALT_LIST_EXP_RIGHT = {
  flex: '0 0 75%',
};

const STYLE_IMAGE = {
  height: '120px',
  width: '120px',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '50% 50%',
  backgroundSize: 'cover',
};

class ResultView extends React.Component {
  static propTypes = {
    focus: React.PropTypes.func,
    open: React.PropTypes.func,
    actor: React.PropTypes.object,
    expanded: React.PropTypes.bool,
  }

  focus = () => {
    this.props.open(this.props.actor.id);
  }

  render() {
    const {name, adress} = this.props.actor;
    const configData = config();
    const typology = configData["typology"];
    const typoInfo = typology.find(t => t.id == this.props.actor.id_typologie);
    const typoImg = typoInfo && typoInfo["img"]["small"];
    return (
      <div style={STYLE_ALT_LIST_EXP_CONTAINER} className="alt-list-view" onClick={this.focus}>
        <div style={STYLE_ALT_LIST_EXP_LEFT}>
          <div className="alt-list-view-image" style={{...STYLE_IMAGE, backgroundImage: `url(${configData.baseURI+this.props.actor.presa_image}`}} />
        </div>
        <div style={STYLE_ALT_LIST_EXP_RIGHT}>
          <div style={STYLE_HEADER}>
            <div style={STYLE_NAME}>{name}</div>
            <div style={{...STYLE_TYPO, backgroundImage: `url(${typoImg})`}}/>
          </div>
          <div style={STYLE_CONTENT}>
            <div>{adress}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultView;