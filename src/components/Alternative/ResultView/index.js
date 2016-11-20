import React from 'react';

class ResultView extends React.Component {
  static propTypes = {
    focus: React.PropTypes.func,
    open: React.PropTypes.func,
    actor: React.PropTypes.object,
    expanded: React.PropTypes.bool,
  }

  state = {
    expanded: this.props.expanded,
  }

  toggleExpand = () => {
    const expanded = this.state.expanded;
    this.setState({
      expanded: !expanded,
    });
    if (!expanded) {
      this.props.focus(this.props.actor.id);  
    }
  }

  renderExpanded = () => {
    const {name, adress} = this.props.actor;
    return (
      <div>
        <h3 className="tmp-hightlight" onClick={this.toggleExpand}>{name}</h3>
        <div>{adress}</div>
        <div className="tmp-hightlight" onClick={() => this.props.open(this.props.actor.id)}>more</div>
      </div>
    );
  }

  renderListItem = () => {
    const {name} = this.props.actor;
    return (
      <div className="tmp-hightlight" onClick={this.toggleExpand}>
        {name}
      </div>
    );
  }

  render() {
    return this.state.expanded ? this.renderExpanded() : this.renderListItem();
  }
}

export default ResultView;