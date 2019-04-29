/**
 * TODO: You need to add this code on the database so you can query with GEO Location
 * db.addresses.createIndex({loc:"2dsphere"});
 */
const config = require('config');
const { MongoClient } = require('mongodb');
const { MONGO_USER, MONGO_PASSWORD } = process.env;

class MongoDB {
  constructor(){
    const { host, port, database } = config.get('mongo');
    this.mongoServer = `mongodb://${(MONGO_USER && MONGO_PASSWORD) ? `${MONGO_USER}:${MONGO_PASSWORD}@` : ''}${host}:${port}/${database}`;
  }

  connect() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.mongoServer, {
        useNewUrlParser: true
      }, (err, client) => {
        if (err) return reject(err);
        return resolve({
          client,
          db: client.db(config.get('mongo.database')),
        });
      });
    });
  }

  close(client) {
    return Promise.resolve().then(() => client.close());
  }
}

module.exports = new MongoDB();
