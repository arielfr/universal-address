const express = require('express');
const config = require('config');
const router = express.Router();
const logger = require('winston-this')('webhook-route');
const facebook = require('../services/facebook');
const W3WService = require('../services/What3Words');
const AddressesService = require('../services/Addresses');
const ActionsService = require('../services/Actions');
const MapQuestService = require('../services/MapQuest');
const LinkUtility = require('../utils/Link');

// Quick Reply Payloads
const QUICK_REPLY_PAYLOADS = {
  GENERATE: 'GENERATE',
  GET: 'GET',
};

const sendUniversalGoodbyeMessage = (senderId) => {
  facebook.sendMessage(senderId, 'Remember that your UA is unique. Talk to me again if you want to know what is your UA or where is located any UA you have.');
  facebook.sendMessage(senderId, 'Thanks for using Universal Address');
};

router.post('/webhook', (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      const webhook_event = entry.messaging[0];
      const senderId = webhook_event.sender.id;
      const fbMessage = webhook_event.message;

      if (fbMessage) {
        logger.info(`Receive a message from ${senderId}`);

        facebook.sendAction(senderId, facebook.available_actions.TYPING);

        if (fbMessage.quick_reply) {
          const quickReply = fbMessage.quick_reply;

          logger.info(`Receive a Quick Reply from user [${senderId}]: ${quickReply.payload}`);

          if (quickReply.payload === QUICK_REPLY_PAYLOADS.GENERATE) {
            AddressesService.getAddressByUserId(senderId).then(userAd => {
              if (userAd) {
                setTimeout(() => {
                  facebook.sendMessage(senderId, `Your Universal Address is ${userAd}`);
                }, 150);

                setTimeout(() => {
                  sendUniversalGoodbyeMessage(senderId);
                  facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
                }, 250);
              } else {
                // Send the Quick Reply for location
                setTimeout(() => {
                  facebook.sendMessage(`You do not have an UA yet! But let's create one! Sharing your location I can create your unique UA`);
                  facebook.quickReplyLocation(senderId, 'Send my location');
                  facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
                }, 150);
              }
            });
          } else if (quickReply.payload === QUICK_REPLY_PAYLOADS.GET) {
            ActionsService.save(senderId, QUICK_REPLY_PAYLOADS.GET);

            setTimeout(() => {
              facebook.sendMessage(senderId, `Type the exact UA and I'll show the location on a map`);
              facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
            }, 150);
          }
        } else if (fbMessage.text) {
          logger.info(fbMessage.text);

          // If the user made and action send message depending on the text sent
          if (ActionsService.hasAny(senderId) && ActionsService.get(senderId) === QUICK_REPLY_PAYLOADS.GET) {
            ActionsService.remove(senderId);

            const addressToMatch = fbMessage.text.toLowerCase();

            // Get the static image address
            AddressesService.guessAddressFromText(addressToMatch).then(res => {
              if (Object.keys(res).length > 0) {
                const staticMap = MapQuestService.getStaticMapUrl({
                  current: {
                    lat: res.geo.lat,
                    long: res.geo.long,
                  }
                });

                // Upload the image
                return facebook.uploadFileFromUrl(staticMap, facebook.valid_attachment_types.IMAGE_FILE).then((id) => {
                  // Send the image
                  return facebook.sendAttachment(senderId, id, facebook.valid_attachment_types.IMAGE_FILE).then(() => {
                    setTimeout(() => {
                      facebook.sendMessage(senderId, LinkUtility.generateShortLink(res.perma));

                      setTimeout(() => {
                        sendUniversalGoodbyeMessage(senderId);
                        facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
                      }, 150);
                    }, 150);
                  });
                });
              } else {
                facebook.sendMessage(senderId, 'Address not found');
              }
            }).catch((err) => {
              facebook.sendMessage(senderId, `An error ocurr try this later`);
              facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
            });
          } else {
            // Mark message as seen
            facebook.sendAction(senderId, facebook.available_actions.MARK_AS_READ);

            // Send welcome message
            setTimeout(() => {
              facebook.quickReplyTextButton(senderId, 'Hi! I am here to help you to being part of the Universal Address (UA) mission', [
                {
                  title: `What's my UA?`,
                  payload: QUICK_REPLY_PAYLOADS.GENERATE,
                },
                {
                  title: 'Get UA Location',
                  payload: QUICK_REPLY_PAYLOADS.GET,
                },
              ]);

              facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
            }, 250);
          }
        } else if (fbMessage.attachments) {
          const attachment = fbMessage.attachments[0];

          if (attachment.type === 'location') {
            const location = attachment.payload;
            const lat = location.coordinates.lat;
            const long = location.coordinates.long;

            W3WService.get3WordsFromCords(lat, long).then(word => {
              const firstWord = word.split('.')[0];

              AddressesService.getAddressByUserId(senderId).then(userAd => {
                if (userAd) {
                  facebook.sendMessage(senderId, `Your Universal Address is ${userAddress}`);
                  sendUniversalGoodbyeMessage(senderId);
                  facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
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
                facebook.sendMessage(senderId, `Your Universal Address is ${userAddress}`);
                sendUniversalGoodbyeMessage(senderId);
                facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
              }).catch(() => {
                facebook.sendMessage(senderId, 'An error ocurr, please try it again');
                facebook.sendAction(senderId, facebook.available_actions.END_TYPING);
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
