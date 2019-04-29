const express = require('express');
const router = express.Router();
const logger = require('winston-this')('webhook-route');
const facebook = require('../services/facebook');
const W3WService = require('../services/What3Words');

const userAddresses = {};
const savedAddress = {};

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

          if (userAddresses[senderId] !== undefined) {
            setTimeout(() => {
              facebook.sendMessage(senderId, `You have and address already and it is: ${userAddresses[senderId].address}`)
            }, 250);
          } else {
            // Send the Quick Reply for location
            setTimeout(() => {
              facebook.quickReplyLocation(senderId, 'Generate My Location');
            }, 250);
          }
        } else if (fbMessage.attachments) {
          const attachment = fbMessage.attachments[0];

          if (attachment.type === 'location') {
            const location = attachment.payload;
            const lat = location.coordinates.lat;
            const long = location.coordinates.long;

            W3WService.get3WordsFromCords(lat, long).then(word => {
              if (savedAddress[word] === undefined) {
                savedAddress[word] = [];
              }

              savedAddress[word].push(senderId);

              userAddresses[senderId] = {
                geo: {
                  lat: lat,
                  long: long,
                },
                three_words: word,
                address: `${word.split('.')[0]} ${savedAddress[word].length}`,
              };

              facebook.sendMessage(senderId, `This is your address: ${userAddresses[senderId].address}`);
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
