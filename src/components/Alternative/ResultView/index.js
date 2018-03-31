import React from 'react';
import config from '../../../utils/config.js';


const STYLE_ALT_LIST_EXP_CONTAINER = {
  display: 'flex',
  padding: '20px',
  cursor: 'pointer',
  backgroundColor: '#fff',
  width: '100%',
  boxSizing: 'border-box',
  flex: '1 0 50%',
};

const STYLE_ALT_LIST_EXP_LEFT = {
  flex: '0 0 25%'
};


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
  textDecoration: 'none',
  color: 'inherit',
};

const STYLE_ADDRESS = {
  color: '#a7a7a7',
  marginTop: '10px',
};

const STYLE_TYPO = {
  fontStyle: 'italic',
  marginTop: '10px',
};

const STYLE_ALT_LIST_EXP_RIGHT = {
  flex: '0 1 75%',
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
    focused: React.PropTypes.bool,
  }

  goto = () => {
    window.location = this.props.actor.url;
  }

  select = (active) => () => {
    if (active) {
      this.props.focus(this.props.actor.id);
    } else {
      this.props.focus(null);
    }
  }

  render() {
    const {name, adress, typo, tag} = this.props.actor;
    const {focused} = this.props;
    const configData = config();
    const image = this.props.actor.presa_image ? {backgroundImage: `url(${this.props.actor.presa_image})`} : {};
    return (
      <div style={STYLE_ALT_LIST_EXP_CONTAINER} onMouseEnter={this.select(true)} onMouseLeave={this.select(false)}>
        <div style={STYLE_ALT_LIST_EXP_LEFT}>
          <div className="alt-list-view-image" style={{...STYLE_IMAGE, ...image}} />
        </div>
        <div style={STYLE_ALT_LIST_EXP_RIGHT}>
          <div style={STYLE_HEADER}>
            <a href={this.props.actor.url}  style={{...STYLE_NAME, ...(focused ? {color: '#C02026'} : {})}}>{name}</a>
          </div>
          <div style={STYLE_CONTENT}>
            <div>{tag && tag.map(t => (<span key={t.id}>{t.label}</span>))}</div>
            <div style={STYLE_ADDRESS}>{adress}</div>
            <div style={STYLE_TYPO}>{typo && typo.map(t => (<span key={t.id}>{t.label}</span>))}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResultView;