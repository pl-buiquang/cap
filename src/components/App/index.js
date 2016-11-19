import React, { Component } from 'react';
import { connect } from 'react-redux';
import Map from 'components/Map';
import LeftBar from 'components/LeftBar';
import * as actionCreators from 'rootReducer';

class App extends Component {
  componentDidMount() {
    this.props.searchActors('*');
  }
  render() {
    return (
      <div style={{ width: '100%'}}>
        <div style={{ width: '50%', float: 'left'}}>
          <input name="search actor" type="text" placeholder="search" onInput={ e => e.target.value.length && this.props.searchActors(e.target.value)}/>
          <LeftBar {...this.props} />
        </div>
        <div style={{ width: '50%', float: 'right' }}>
          <Map actors={this.props.actors} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  actors: state.actors,
  bounds: state.bounds,
});

export default connect(mapStateToProps, actionCreators)(App);
