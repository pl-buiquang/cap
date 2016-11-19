import algolia from 'algoliasearch';

const algoliaIndex = algolia("G2ONO6HNX2", 'bb08f70d51214d668d8c761ec243c677').initIndex('alternatives');
const search = (query) => algoliaIndex.search(query, { hitsPerPage: 3000 });

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
      actors: actors.map(({ adresse_initiative, long_initiative, lat_initiative, nom_initiative }) => ({
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
