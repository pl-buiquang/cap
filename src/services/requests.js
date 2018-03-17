import algolia from 'algoliasearch';
import config from 'utils/config.js';
import 'whatwg-fetch';

// todo make this dynamic (do not load algolia if not selected in config)
const algoliaIndex = algolia("G2ONO6HNX2", 'bb08f70d51214d668d8c761ec243c677').initIndex('alternatives');
const algoliaSearch = (query) => algoliaIndex.search(query, { hitsPerPage: 3000 });

const mockSearch = (query) => {
  return new Promise((resolve, reject) => {
    resolve({hits: [].map(obj => {return {...obj, id: obj.objectID};})});
  });
}

async function backendCall (path, query=null) {
  const configData = config();
  let callConfig = {};
  const headers = new Headers({
    'Content-Type': 'application/json'
  })
  var data = JSON.stringify( query );
  if (query) {
    callConfig = {
      method: 'POST',
      headers,
      body: data
    };
  }
  return await fetch(configData.baseURI+path, callConfig);
}

async function customSearch (query) {
  const data = await backendCall("/wp-json/capalts/alts", query ? query : {});
  return data.json();  
}

const searchProviders = {
  'mock' :  mockSearch,
  'algolia' : algoliaSearch,
  'custom': customSearch,
}

const getSearchProvider = () => {
  const configData = config();
  const provider = searchProviders[configData["dataProvider"]];
  return provider ? provider : mockSearch; 
}

export const search = (query) => {
  return getSearchProvider()();
}

export const searchKeyword = (keyword) => {
  return getSearchProvider()({keywords: keyword}); 
}

export async function altInfo () {
  const data = await backendCall("/ws/content/altInfo");
  return data.text();
}

export const analytics = (data) => {
  backendCall("/ws/analytics", data);
}

