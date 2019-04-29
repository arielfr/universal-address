const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
// const viewEngine = require('./middlewares/view-engine');
const logger = require('winston-this')('index');
const port = process.env.PORT || config.get('port');
const environment = process.env.NODE_ENV;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// Get the Swagger document
const swaggerDocument = YAML.load('./docs/swagger.yaml');

logger.info(`NODE_ENV: ${environment}`);

// Express Application initialization
const app = express();

// Adding body-parser
app.use(bodyParser.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(require('./routes/ping'));
app.use(require('./routes/ua'));
app.use(require('./routes/webhook'));
app.use(require('./routes/redirect'));

/**
 * The home is the documentation for the API using Swagger
 */
app.use('/', (req, res, next) => {
  res.redirect('/docs');
});

app.use((err, req, res, next) => {
  logger.error(err);

  res.status(500).send('Oops, an error ocurred...');
});

app.listen(port, function () {
  logger.info(`Application up and running on port ${port}`);
});
