import config from 'config.json';
import { Base64 } from 'js-base64';

const removeNonce = (data) => {
  return data.substr(5);
}


const dynamicConf = window.CARTO_APP_CONFIG ? JSON.parse(Base64.decode(removeNonce(window.CARTO_APP_CONFIG))) : {};


export default () => ({
  ...config,
  ...dynamicConf
});