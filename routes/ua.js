const express = require('express');
const router = express.Router();
const AddressService = require('../services/Addresses');

router.get('/ua/search', (req, res) => {
  const {
    address,
    three_words,
  } = req.query;

  logger.info(`Finding address for search address=${address}`);

  let PromiseToResolve;

  if (address) {
    PromiseToResolve = AddressService.guessAddressFromText(address);
  } else if (three_words) {
    PromiseToResolve = AddressService.guessAddressFromW3W(address);
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

    res.send({
      geo: add.geo,
      three_words: add.three_words,
      address: add.address,
    });
  });
});

module.exports = router;
