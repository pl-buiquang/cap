import {search, searchKeyword} from './services/requests.js';
import config from './utils/config';
import {animateMarker, sortByDate as sortByDateFunc, sortByCommentCount as sortByCommentCountFunc} from './utils/utils';

const queries = {};
const keywordsSearches = {};
export const updateActors = actors => ({ type: 'UPDATE_ACTORS', payload: actors });
export const updateBounds = ({_southWest, _northEast}) => {
  return ({ type: 'UPDATE_BOUNDS', payload: {_southWest, _northEast} });
}
export const selectZone = zoneId => ({ type: 'FILTER_ZONE', payload: zoneId});
export const selectDistrict = districtId => ({ type: 'FILTER_DISTRICT', payload: districtId});
export const selectTypos = typo => ({ type: 'FILTER_TYPOS', payload: typo});
export const updateKeywords = (query, keywords) => ({ type: 'FILTER_KEYWORDS', payload: {query, keywords}});
export const sortByDate = () => (dispatch, getState) => {
  const {actors, sorting} = getState();
  const activate = !sorting.date;
  const sortedActors = sortByDateFunc(actors, activate);
  dispatch({ type: 'SORT_COMMENT', payload: null });
  dispatch({ type: 'SORT_DATE', payload: activate });
  dispatch(updateActors(sortedActors));    
};
export const sortByComment = () => (dispatch, getState) => {
  const {actors, sorting} = getState();
  const activate = !sorting.comments;
  const sortedActors = sortByCommentCountFunc(actors, activate);
  dispatch({ type: 'SORT_DATE', payload: null });
  dispatch({ type: 'SORT_COMMENT', payload: activate });
  dispatch(updateActors(sortedActors));    
};
export const focusActor = actorId =>  (dispatch, getState) => {
  const state = getState();
  if (state.actorMapFocus) {
    animateMarker(state.actorMapFocus, false);
  }
  if (actorId) {
    animateMarker(actorId, true);
  }
  dispatch({ type: 'FOCUS_ACTOR', payload: actorId});
};
export const openActor = actorId => ({ type: 'OPEN_ACTOR', payload: actorId});
export const setMapRef = mapRef => ({ type: 'SET_MAP_REF', payload: mapRef});
export const setDefaultLocation = location => ({ type: 'SET_DEFAULT_LOCATION', payload: location});
export const searchLoader = active => ({ type: 'SEARCH_LOADER', payload: active });
export const searchActors = query => dispatch => {
  query = query.trim();
  if (queries[query]) {
    dispatch(updateActors(mapActors(queries[query])));
    return;
  }
  search(query)
    .then(data => {
      if (!data.hits) {
        data.hits = data;
      }
      if (!data.hits.length) {
        dispatch(updateActors(mapActors(data.hits)));
      }
      queries[query] = data && data.hits;
      dispatch(updateActors(mapActors(queries[query])));
    })
    .catch((err) => console.log(err));
};
export const searchKeywords = query => dispatch => {
  dispatch(searchLoader(true));
  query = query.trim();
  if (keywordsSearches[query]) {
    dispatch(searchLoader(false));
    dispatch(updateKeywords(query, keywordsSearches[query]));
    return;
  }
  searchKeyword(query)
    .then(data => {
      keywordsSearches[query] = data;
      dispatch(searchLoader(false));
      dispatch(updateKeywords(query, keywordsSearches[query]));
    })
    .catch((err) => {
      console.log(err);
      dispatch(searchLoader(false));
    });  
}

const configData = config();

const mapActors = (actors) => (actors.map((a) => {
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
    url,
    category,
    location,
    presa_image,
    comment_count,
    creation_date,
    tag,
  } = a;
  return ({
    ...a,
    id: id || objectID,
    typo: category || [],
    zone: location || [],
    tag: tag || [],
    adress: adresse_initiative,
    lng: long_initiative,
    lat: lat_initiative,
    name: nom_initiative,
    district: id_quartier,
    creation_date,
    comment_count,
    presa_image,
    url,
  });
}));

const initialState = {
  actors: configData["defaultActors"] ? mapActors(configData["defaultActors"]) : [],
  bounds: {},
  filters: {
    typos: configData["defaultTypo"] || "default",
    zone: configData["defaultZone"] || "default",
    keywords: configData["defaultKeywords"] || null,
    query: configData["defaultSearch"] || "",
  },
  sorting: {
    date: false,
    comments: null,
  },
  actorView: null,
  actorMapFocus: null,
  mapRef: null,
  defaultLocation: null,
  searchLoading: false,
};



const Handlers = {
  UPDATE_BOUNDS: (state, bounds) => ({ ...state, bounds }),
  UPDATE_ACTORS: (state, actors) =>
    ({
      ...state,
      actors: actors,
    }),
  FILTER_KEYWORDS: (state, payload) => ({...state, filters: {...state.filters, keywords: payload.keywords, query: payload.query}}),
  FILTER_TYPOS: (state, typoList) => ({...state, filters: {...state.filters, typos: typoList,}}),
  FILTER_DISTRICT: (state, districtId) => ({...state, filters: {...state.filters, district: districtId,}}),
  FILTER_ZONE: (state, zoneId) => ({...state, filters: {...state.filters, zone: zoneId, district: '0'}}),
  OPEN_ACTOR: (state, actorId) => ({...state, actorView: actorId}),
  FOCUS_ACTOR: (state, actorId) => ({...state, actorMapFocus: actorId}),
  SET_MAP_REF: (state, mapRef) => ({...state, mapRef}),
  SET_DEFAULT_LOCATION: (state, location) => ({...state, defaultLocation: location}),
  SEARCH_LOADER: (state, active) => ({...state, searchLoading: active}),
  SORT_COMMENT: (state, payload) => ({...state, sorting: {...state.sorting, comments: payload}}),
  SORT_DATE: (state, payload) => ({...state, sorting: {...state.sorting, date: payload}}),
};

export default function(state = initialState, action) {
  const handler = Handlers[action && action.type];
  return handler ?  handler(state, action.payload) : state;
}
