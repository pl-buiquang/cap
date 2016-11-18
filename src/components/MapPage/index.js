import React, { Component } from 'react';
import algolia from 'algoliasearch';
import Map from 'components/Map';
import LeftBar from 'components/LeftBar';

const algoliaIndex = algolia("G2ONO6HNX2", 'bb08f70d51214d668d8c761ec243c677').initIndex('alternatives');
const search = (query) => algoliaIndex.search(query, {});

export default class MapPage extends Component {
  componentDidMount() {
    this.mapSearch('louvre');
  }
  mapSearch(query) {
    search(query)
      .then((data) => this.setState(data))
      .catch((err) => console.log(err));
  }
  render() {
    const actors = this.state && this.state.hits.length &&
                   this.state.hits.map(({ adresse_initiative, long_initiative, lat_initiative, nom_initiative }) => ({
                     adress: adresse_initiative,
                     lon: long_initiative,
                     lat: lat_initiative,
                     name: nom_initiative,
                   }));
    return (
      <div style={{ width: '100%'}}>
        <div style={{ width: '50%', float: 'left'}}>
          <input name="search actor" type="text" placeholder="search" onChange={(e) => this.mapSearch(e.target.value)}/>
          <LeftBar actors={actors} />
        </div>
        <div style={{ width: '50%', float: 'right' }}>
          <Map actors={actors} />
        </div>
      </div>
    );
  }
}
