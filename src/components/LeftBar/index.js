import React from 'react';

export default ({ actors }) => (
  actors &&
  <div>{actors.map(({ name, adress}) => (
      <div key={`${name}${adress}`}>
        <h2>{name}</h2>
        <h3>{adress}</h3>
      </div>
    ))}
  </div>) || <h1>No results</h1>;
