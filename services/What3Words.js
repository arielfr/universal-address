const logger = require('winston-this')('w3w-service');
const axios = require('axios');
const config = require('config');
const querystring = require('querystring');

class W3W {
  constructor() {
    this.w3wKey = config.get('w3w.key');

    this.restclient = axios.create({
      baseURL: 'https://api.what3words.com/v3',
      timeout: 5000,
    });
  }

  get3WordsFromCords(lat, long){
    logger.info(`Creating UA for lat ${lat} - long: ${long}`);

    return this.restclient.get(`/convert-to-3wa?${querystring.stringify({
      key: this.w3wKey,
      coordinates: `${lat},${long}`
    })}`).then(response => {
      return Promise.resolve(response.data.words);
    });
  }
}

module.exports = new W3W();
