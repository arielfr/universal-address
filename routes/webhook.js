const express = require('express');
const config = require('config');
const router = express.Router();
const logger = require('winston-this')('webhook-route');
const facebook = require('../services/facebook');
const W3WService = require('../services/What3Words');
const AddressesService = require('../services/Addresses');

const userAddresses = {};

router.post('/webhook', (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhook_event = entry.messaging[0];
      const senderId = webhook_event.sender.id;
      const fbMessage = webhook_event.message;

      if (fbMessage) {
        logger.info(`Receive a message from ${senderId}`);

        if (fbMessage.text) {
          logger.info(fbMessage.text);

          // Mark message as seen
          facebook.sendAction(senderId, facebook.available_actions.MARK_AS_READ);

          AddressesService.haveAddress(senderId).then(userAd => {
            if (userAd) {
              setTimeout(() => {
                facebook.sendMessage(senderId, `You already have and address and it is ${userAd}`);
              }, 250);
            } else {
              // Send the Quick Reply for location
              setTimeout(() => {
                facebook.quickReplyLocation(senderId, 'Generate My Location');
              }, 250);
            }
          });
        } else if (fbMessage.attachments) {
          const attachment = fbMessage.attachments[0];

          if (attachment.type === 'location') {
            const location = attachment.payload;
            const lat = location.coordinates.lat;
            const long = location.coordinates.long;

            W3WService.get3WordsFromCords(lat, long).then(word => {
              const firstWord = word.split('.')[0];

              AddressesService.haveAddress(senderId).then(userAd => {
                if (userAd) {
                  facebook.sendMessage(senderId, `You already have and address and it is ${userAd}`);
                  return;
                }

                return AddressesService.getAddressCount(firstWord);
              }).then((addressNumber) => {
                return facebook.getUserById(senderId).then(userData => {
                  const realAddress = `${firstWord} ${addressNumber}`;

                  // Adding an address
                  return AddressesService.addAddress(userData, lat, long, word, firstWord, realAddress);
                });
              }).then((userAddress) => {
                facebook.sendMessage(senderId, `This is your address: ${userAddress}`);
              }).catch(() => {
                facebook.sendMessage(senderId, 'An error ocurr, please try it again');
              });
            });
          }
        }
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

/**
 * Verification Token Endpoint
 * (This is only for Facebook)
 */
router.get('/webhook', (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = config.get('verification_token');

  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});


module.exports = router;
