const express = require('express');
const router = express.Router();
const logger = require('winston-this')('ua-route');
const AddressService = require('../services/Addresses');

/**
 * Search by address
 */
router.get('/ua/address/search', (req, res) => {
  const {
    q,
  } = req.query;

  logger.info(`Finding address for search address=${q}`);

  AddressService.guessAddressFromText(q).then((add) => {
    if (Object.keys(add).length === 0) {
      res.status(404).send({
        status: 'Not Found',
        message: 'Address not found',
      });
    }

    res.send({
      geo: {
        lat: add.loc.coordinates[1],
        long: add.loc.coordinates[0],
      },
      w3w: add.three_words,
      address: add.address,
    });
  });
});

/**
 * Search by geo location
 */
router.get('/ua/geo/search', (req, res) => {
  const {
    lat,
    long,
  } = req.query;

  logger.info(`Finding address for lat=${lat} and long=${long}`);

  AddressService.getNearLocations({ lat: lat, long: long }).then((add) => {
    if (Object.keys(add).length === 0) {
      res.status(404).send({
        status: 'Not Found',
        message: 'Address not found',
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
        w3w: r.three_words,
        address: r.address,
      });
    }

    res.send(results);
  });
});

/**
 * Search by what3words
 */
router.get('/ua/w3w/search', (req, res) => {
  const {
    q,
  } = req.query;

  logger.info(`Finding address for search w3w=${q}`);

  AddressService.findAddressesFromW3W(q).then((add) => {
    if (Object.keys(add).length === 0) {
      res.status(404).send({
        status: 'Not Found',
        message: 'Address not found',
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
        w3w: r.three_words,
        address: r.address,
      });
    }

    res.send(results);
  });
});

module.exports = router;
