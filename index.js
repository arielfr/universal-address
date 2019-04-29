const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
// const viewEngine = require('./middlewares/view-engine');
const logger = require('winston-this')('index');
const port = process.env.PORT || config.get('port');
const environment = process.env.NODE_ENV;

logger.info(`NODE_ENV: ${environment}`);

// Express Application initialization
const app = express();

// Add Handlebars view engine
// viewEngine(app);

// Adding body-parser
app.use(bodyParser.json());

/*
app.use(express.static(__dirname + '/public'));

app.use(require('./routes/index'));
app.use(require('./routes/ping'));
app.use(require('./routes/policy'));
app.use(require('./routes/about'));
app.use(require('./routes/webhook'));
*/

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
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
app.get('/webhook', (req, res) => {
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





app.use(require('./routes/ping'));
app.use(require('./routes/ua'));

app.use((err, req, res, next) => {
  logger.error(err);

  res.status(500).send('Oops, an error ocurred...');
});

app.use((req, res) => {
  res.redirect('/');
});

app.listen(port, function () {
  logger.info(`Application up and running on port ${port}`);
});
