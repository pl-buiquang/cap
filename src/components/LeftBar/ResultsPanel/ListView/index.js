import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ResultView from '../../../Alternative/ResultView';
import Pagination from './Pagination';

const STYLE_RESULT_LIST = {
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
};

class ListView extends React.Component {
  static propTypes = {
    actors: React.PropTypes.array,
  }

  state = {
    displayedItems: [],
  }

  setPerfectScrollBar = (el) => {
    this.perfectScrollBarRef = el;
  }

  componentWillReceiveProps(newProps){
    if (this.perfectScrollBarRef && newProps.actors.length !== this.props.actors.length) {
      this.perfectScrollBarRef.setScrollTop(0);
    }
  }

  renderWithPerfectScrollbar = () =>{
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

  onChangePage = (items) => {
    this.setState({
      displayedItems: items
    });
  }

  renderWithPagination = () => {
    const {actors = [], actorMapFocus} = this.props;
    const {displayedItems} = this.state;
    return (
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div style={STYLE_RESULT_LIST}>
          {displayedItems.map((a) => <ResultView key={a.id} actor={a} focus={this.props.focus} open={this.props.open} focused={actorMapFocus == a.id}/>)}
        </div>
        <div style={{display: 'flex', width: '80%', justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
          <Pagination items={actors} onChangePage={this.onChangePage} />
        </div>
      </div>
    );
  }

  render() {
    return this.renderWithPagination();
  }
}

export default ListView;
