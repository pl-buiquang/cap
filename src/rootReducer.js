import {search} from './services/alternatives.js';

const queries = {};
export const updateActors = actors => ({ type: 'UPDATE_ACTORS', payload: actors });
export const updateBounds = bounds => ({ type: 'UPDATE_BOUNDS', payload: bounds });
export const searchActors = query => dispatch => {
  if (queries[query]) {
    dispatch(updateActors(queries[query]));
    return;
  }
  search(query)
   .then(data => {
     if (!data.hits.length) {
       dispatch(updateActors(data.hits));
     }
     queries[query] = data && data.hits;
     dispatch(updateActors(queries[query]));
   })
   .catch((err) => console.log(err));
};

const initialState = {
  actors: [],
  bounds: {},
};

const Handlers = {
  UPDATE_BOUNDS: (state, bounds) => ({ ...state, bounds }),
  UPDATE_ACTORS: (state, actors) =>
    ({
      ...state,
      actors: actors.map(({ adresse_initiative, long_initiative, lat_initiative, nom_initiative, id_typologie, id, objectID }) => ({
        id: id || objectID,
        typo: id_typologie,
        adress: adresse_initiative,
        lng: long_initiative,
        lat: lat_initiative,
        name: nom_initiative,
      })),
    }),
};

export default function(state = initialState, action) {
  const handler = Handlers[action && action.type];
  return handler ?  handler(state, action.payload) : state;
}
