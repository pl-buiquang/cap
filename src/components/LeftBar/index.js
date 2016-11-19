import React from 'react';

const filterActorsByViewport = ({ ne, sw }, { lat, lng }) => {
  const top = (ne.lat < parseFloat(lat));
  const bottom = (parseFloat(lat) > sw.lat);
  const right = (parseFloat(lng) < ne.lng);
  const left = (parseFloat(lng) > sw.lng);

  const horizontal = (top && bottom);
  const vertical = (right && left);
  return (horizontal && vertical);
};

export default ({ actors, bounds }) => (
  actors &&
  <div>{actors.filter((a) => filterActorsByViewport(bounds, a)).map(({ name, adress }) => (
      <div key={`${name}${adress}`}>
        {console.log(actors.filter((a) => filterActorsByViewport(bounds, a)).length)}
        <h2>{name}</h2>
        <h3>{adress}</h3>
      </div>
    ))}
  </div>
) || <h1>No results</h1>;
