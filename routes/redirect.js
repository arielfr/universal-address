const router = require('express').Router();
const logger = require('winston-this')('route-redirect');
const AddressService = require('../services/Addresses');

router.get('/r/:id', (req, res, next) => {
  const tinyUrlId = req.params.id;

  logger.info(`Redirect with Id ${tinyUrlId} [/r]`);

  AddressService.getGoogleMapLinkByPermaId(tinyUrlId).then(link => {
    if (link) {
      res.redirect(link);
    } else {
      res.status(404).send({
        status: 'Not Found',
      });
    }
  }).catch(e => {
    next(e);
  });
});

module.exports = router;
