import React from 'react';
import ListView from './ListView';

class ResultsPanel extends React.Component {

  render() {
    const {filteredActors} = this.props;
    return (
      <ListView actors={filteredActors} focus={this.props.focusActor} open={this.props.openActor}/>
    );
  }
}

export default ResultsPanel;
