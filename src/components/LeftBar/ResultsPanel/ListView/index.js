import React from 'react';
import ResultView from '../../../Alternative/ResultView';
import PerfectScrollbar from 'react-perfect-scrollbar';

class ListView extends React.Component {

  setPerfectScrollBar = (el) => {
    this.perfectScrollBarRef = el;
  }

  componentWillReceiveProps(newProps){
    if (this.perfectScrollBarRef && newProps.actors.length !== this.props.actors.length) {
      this.perfectScrollBarRef.setScrollTop(0);
    }
  }

  render() {
    const {actors} = this.props;
    return (
      <div>
        <div style={{height: '600px', overflow: 'hidden'}}>
          <PerfectScrollbar ref={this.setPerfectScrollBar}>
            {actors.map((a) => <ResultView key={a.id} actor={a} focus={this.props.focus} open={this.props.open}/>)}
          </PerfectScrollbar>
        </div>
        <div style={{color: '#fff'}}>{`Total : ${actors.length}`}</div>
      </div>
    );
  }
}

export default ListView;
