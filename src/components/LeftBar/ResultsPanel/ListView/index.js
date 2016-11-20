import React from 'react';
import ResultView from '../../../Alternative/ResultView';
import PerfectScrollbar from 'react-perfect-scrollbar';

class ListView extends React.Component {

  componentDid

  render() {
    const {actors} = this.props;
    return (
      <div style={{height: '300px'}}>
        <div className="tmp-hightlight">Sorting / Show only starred / ...</div>
        <PerfectScrollbar>
          {actors.map((a) => <ResultView key={a.id} actor={a} focus={this.props.focus} open={this.props.open}/>)}
        </PerfectScrollbar>
      </div>
    );
  }
}

export default ListView;
