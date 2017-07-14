import config from 'config.json';



export default () => ({
  ...config,
  ...(window.CARTO_APP_CONFIG)
});