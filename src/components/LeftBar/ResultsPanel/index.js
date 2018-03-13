import React from 'react';
import ListView from './ListView';
import SearchLoader from './SearchLoader';

class ResultsPanel extends React.Component {

  render() {
    const {filteredActors, actorMapFocus} = this.props;
    if (this.props.searchLoading) {
      return (<SearchLoader />);
    }
    return (
      <div className="eltd-listing-list-inner">
        <div className="eltd-listing-list-items">
          <ListView
            actors={filteredActors}
            focus={this.props.focusActor}
            actorMapFocus={actorMapFocus}
            count={this.props.count}
            sortByDate={this.props.sortByDate} 
            sortByComment={this.props.sortByComment}
            sorting={this.props.sorting}
          />
        </div>
      </div>
    );
  }
}

export default ResultsPanel;
