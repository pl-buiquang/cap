import React from 'react';

const STYLE_HEADER = {
  display: 'flex',
}

class FullView extends React.Component {
  static propTypes = {
    actor: React.PropTypes.object,
    map: React.PropTypes.node,
    close: React.PropTypes.func
  }

  render() {
    const {actor, map} = this.props;
    return (
      <div>
        <div style={STYLE_HEADER}>
          <div style={{width: '50%'}}>{actor.name}</div>
          <div style={{width: '50%'}}>{map}</div>
        </div>
        <div>{actor.adress}</div>
        <div className="tmp-hightlight" onClick={this.props.close}>TODO ajouter un Control a la map pour la re expand</div>
      </div>
    );
  }
}

export default FullView;