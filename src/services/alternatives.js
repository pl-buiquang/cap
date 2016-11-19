import algolia from 'algoliasearch';
import config from 'config.json';
import data from 'cap_data.json';

// todo make this dynamic (do not load algolia if not selected in config)
const algoliaIndex = algolia("G2ONO6HNX2", 'bb08f70d51214d668d8c761ec243c677').initIndex('alternatives');
const algoliaSearch = (query) => algoliaIndex.search(query, { hitsPerPage: 3000 });

const mockSearch = (query) => {
  return new Promise((resolve, reject) => {
    resolve({hits: data.map(obj => {return {...obj, id: obj.objectID};})});
  });
}

const searchProviders = {
  'mock' :  mockSearch,
  'algolia' : algoliaSearch,
}

const getSearchProvider = () => {
  const provider = searchProviders[config["dataProvider"]];
  return provider ? provider : mockSearch; 
}

export const search = (query) => {
  return getSearchProvider()(query);
}