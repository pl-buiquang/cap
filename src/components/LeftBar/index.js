import React from 'react';
import ResultsPanel from './ResultsPanel';

const STYLE_RESULT_HEADER = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: '#c02026',
  padding: '20px',
  color: '#ffffff',
};

const STYLE_SORTER = {
  cursor: 'pointer',
};

export default (props) => {
  const {count, sorting, filteredActors} = props;
  return (
    <div>
      <div style={STYLE_RESULT_HEADER}>
        <div onClick={props.sortByDate} style={STYLE_SORTER}>
          <span>Trier par date</span>
          {sorting.date !== null ? <i style={{marginLeft: '5px'}} className={`fa fa-chevron-${sorting.date ? 'up' : 'down'}`}/> : null}
        </div>
        <div onClick={props.sortByComment} style={STYLE_SORTER}>
          <span>Trier par nombre de commentaires</span>
          {sorting.comments !== null ? <i style={{marginLeft: '5px'}} className={`fa fa-chevron-${sorting.comments ? 'up' : 'down'}`}/> : null}
        </div>
        <div>{`Total : ${count}, Affichées : ${filteredActors.length}`}</div>
      </div>
      <ResultsPanel {...props}/>
    </div>
  );
}
