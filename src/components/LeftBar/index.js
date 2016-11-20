import React from 'react';
import SearchPanel from './SearchPanel';
import ResultsPanel from './ResultsPanel';


export default (props) => (
  <div>
    <SearchPanel {...props}/>
    <ResultsPanel {...props}/>
  </div>
);
