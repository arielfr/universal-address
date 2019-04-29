const express = require('express');
const router = express.Router();
const logger = require('winston-this')('ua-route');
const AddressService = require('../services/Addresses');

router.get('/ua/search', (req, res) => {
  const {
    address,
    w3w,
    geo_lat,
    geo_long,
  } = req.query;

  let PromiseToResolve;

  if (address) {
    logger.info(`Finding address for search address=${address}`);

    PromiseToResolve = AddressService.guessAddressFromText(address).then((add) => {
      const result = [];

      if (Object.keys(add).length > 0) {
        result.push(add);
      }

      return Promise.resolve(result);
    });
  } else if (w3w) {
    logger.info(`Finding address for search w3w=${w3w}`);

    PromiseToResolve = AddressService.findAddressesFromW3W(w3w);
  } else if (geo_lat && geo_long) {
    logger.info(`Finding address for lat=${geo_lat} and long=${geo_long}`);

    PromiseToResolve = AddressService.getNearLocations({ lat: geo_lat, long: geo_long });
  } else {
    res.status(400).send({
      message: 'Bad Request. You need to send and address or three_words',
    });
  }

  PromiseToResolve.then((add) => {
    if (Object.keys(add).length === 0) {
      res.status(404).send({
        message: 'Not Found',
      });
    }

    const results = [];

    for (let i = 0; i < add.length; i++) {
      const r = add[i];

      results.push({
        geo: {
          lat: r.loc.coordinates[1],
          long: r.loc.coordinates[0],
        },
        three_words: r.three_words,
        address: r.address,
      });
    }

    res.send(results);
  });
});

module.exports = router;
