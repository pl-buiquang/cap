import {search} from './services/requests.js';

const queries = {};
export const updateActors = actors => ({ type: 'UPDATE_ACTORS', payload: actors });
export const updateBounds = ({_southWest, _northEast}) => {
  return ({ type: 'UPDATE_BOUNDS', payload: {_southWest, _northEast} });
}
export const selectZone = zoneId => ({ type: 'FILTER_ZONE', payload: zoneId});
export const selectDistrict = districtId => ({ type: 'FILTER_DISTRICT', payload: districtId});
export const selectTypos = typoList => ({ type: 'FILTER_TYPOS', payload: typoList});
export const focusActor = actorId => ({ type: 'FOCUS_ACTOR', payload: actorId});
export const openActor = actorId => ({ type: 'OPEN_ACTOR', payload: actorId});
export const setMapRef = mapRef => ({ type: 'SET_MAP_REF', payload: mapRef});
export const setDefaultLocation = location => ({ type: 'SET_DEFAULT_LOCATION', payload: location});
export const searchActors = query => dispatch => {
  query = query.trim();
  if (queries[query]) {
    dispatch(updateActors(queries[query]));
    return;
  }
  search(query)
    .then(data => {
      if (!data.hits) {
        data.hits = data;
      }
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
  filters: {
    typos: [],
    district: "0",
    zone: "0",
  },
  actorView: null,
  actorMapFocus: null,
  mapRef: null,
  defaultLocation: null,
};

const Handlers = {
  UPDATE_BOUNDS: (state, bounds) => ({ ...state, bounds }),
  UPDATE_ACTORS: (state, actors) =>
    ({
      ...state,
      actors: actors.map((a) => {
        const {
          adresse_initiative,
          long_initiative,
          lat_initiative,
          nom_initiative,
          id_typologie,
          id,
          objectID,
          id_quartier,
          arrond_initiative,
          
        } = a;
        return ({
          ...a,
          id: id || objectID,
          typo: id_typologie,
          adress: adresse_initiative,
          lng: long_initiative,
          lat: lat_initiative,
          name: nom_initiative,
          zone: arrond_initiative,
          district: id_quartier,
        });
      }),
    }),
  FILTER_TYPOS: (state, typoList) => ({...state, filters: {...state.filters, typos: typoList,}}),
  FILTER_DISTRICT: (state, districtId) => ({...state, filters: {...state.filters, district: districtId,}}),
  FILTER_ZONE: (state, zoneId) => ({...state, filters: {...state.filters, zone: zoneId, district: '0'}}),
  OPEN_ACTOR: (state, actorId) => ({...state, actorView: actorId}),
  FOCUS_ACTOR: (state, actorId) => ({...state, actorMapFocus: actorId}),
  SET_MAP_REF: (state, mapRef) => ({...state, mapRef}),
  SET_DEFAULT_LOCATION: (state, location) => ({...state, defaultLocation: location}),
};

export default function(state = initialState, action) {
  const handler = Handlers[action && action.type];
  return handler ?  handler(state, action.payload) : state;
}
