const express = require('express');
const router = express.Router();
const W3WService = require('../services/What3Words');

router.post('/ua/generate', (req, res) => {
  const { lat, long } = req.body;

  W3WService.get3WordsFromCords(lat, long).then((words) => {
    res.send({
      address: words,
    });
  });
});

module.exports = router;
