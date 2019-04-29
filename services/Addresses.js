const perma = require('perma');
const logger = require('winston-this')('addresses-service');
const MongoDB = require('../database/MongoDB');

/**
 * This class is going to store the users locations
 */
class Addresses {
  static get COLLECTION_NAME () {
    return 'addresses';
  }

  static get EARTH_RADIUS_IN_MILES () {
    return 3959;
  }

  static get MIN_RADIUS_METERS() {
    return 50;
  }

  static get SEARCH_RADIUS_METERS() {
    return 5000;
  }

  /**
   * Miles to Meters Converter
   * @param meters
   * @returns {number}
   */
  metersToMiles(meters) {
    return meters * 0.000621371;
  }

  /**
   * Get a MongoDB query for searching within a geo location point
   * @param lat
   * @param long
   * @param distance
   * @returns {{$geoWithin: {$centerSphere: *[]}}}
   */
  getGeoWithinQuery({ lat, long, distance }) {
    return {
      $geoWithin : {
        $centerSphere : [
          [
            lat,
            long
          ],
          (this.metersToMiles(distance) / Addresses.EARTH_RADIUS_IN_MILES)
        ]
      }
    }
  }

  /**
   * Retrieve all the near locations
   * @param lat
   * @param long
   * @returns {Promise<any>}
   */
  getNearLocations({ lat, long }) {
    return new Promise((resolve) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Addresses.COLLECTION_NAME);

        collection.find({
          loc: {
            $near :
              {
                $geometry:
                  {
                    type: "Point",  coordinates: [Number(lat),  Number(long) ]
                  },
                $minDistance: 0,
                $maxDistance: Addresses.SEARCH_RADIUS_METERS,
              }
          }
        }).toArray((err, res) => {
          MongoDB.close(client);

          if (res === null) {
            logger.error(`Can't find any locations for Lat = ${lat} / Long = ${long}`);
            return resolve([]);
          }

          logger.info(`Getting the locations near: Lat = ${lat} / Long = ${long}. Found ${res.length}`);

          resolve(res);
        })
      });
    });
  }

  getGoogleMapLink(lat, long) {
    return `http://www.google.com/maps/place/${lat},${long}`;
  }

  addAddress(userData, lat, long, threeWords, firstWord, realAddress) {
    return new Promise((resolve, reject) => {
      logger.info(`Adding the address for ${userData.id} and the location is ${realAddress}`);

      return MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Addresses.COLLECTION_NAME);

        const data = {
          loc: {
            type: 'Point',
            coordinates: [long, lat]
          },
          three_words: threeWords,
          first_word: firstWord,
          address: realAddress,
          perma: perma(`${lat},${long}`, 10)
        };

        if (userData) {
          data.user = {
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name,
            profile_pic: userData.profile_pic,
          };
        }

        collection.insertOne(data).then(() => {
          MongoDB.close(client);

          return resolve(realAddress);
        }).catch((err) => {
          logger.error(`An error ocurr adding location: ${err}`);

          MongoDB.close(client);

          return reject(err);
        });
      });
    });
  }

  getAddressByUserId(userId) {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Addresses.COLLECTION_NAME);

        collection.findOne({
          "user.id": userId,
        }).then((res) => {
          if (res === null) {
            return resolve('');
          }

          resolve(res.address);
        }).catch(err => {
          logger.error(`An error ocurr checking if user ${userId} has an UA: ${err}`);

          MongoDB.close(client);

          reject('An error ocurr');
        });
      });
    });
  }

  getGoogleMapLinkByPermaId(id) {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Addresses.COLLECTION_NAME);

        collection.findOne({
          perma: id,
        }).then((res) => {
          if (res === null) {
            return resolve('');
          }

          resolve(this.getGoogleMapLink(res.loc.coordinates[1], res.loc.coordinates[0]));
        }).catch(err => {
          logger.error(`An error ocurr checking if user ${id} has an UA: ${err}`);

          MongoDB.close(client);

          reject('An error ocurr');
        });
      });
    });
  }

  getAddressCount(firstWord) {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Addresses.COLLECTION_NAME);

        collection.find({
          first_word: firstWord
        }).count().then((count) => {
          const nextNumber = count + 1;

          logger.info(`Count for word ${firstWord} is ${nextNumber}`);

          resolve(nextNumber);
        }).catch(err => {
          logger.error(`An error ocurr checking the next number: ${err}`);

          MongoDB.close(client);

          reject('An error ocurr');
        });
      });
    });
  }

  guessAddressFromText(address) {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        logger.info(`Looking for address ${address}`);

        const collection = db.collection(Addresses.COLLECTION_NAME);

        collection.findOne({
          address: address.trim().toLowerCase()
        }).then((res) => {
          if (res === null) {
            logger.info(`Address NOT found ${address}`);
            return resolve({});
          }

          logger.info(`Address found ${address}`);

          resolve(res);
        }).catch(err => {
          logger.error(`An error ocurr checking the next number: ${err}`);

          MongoDB.close(client);

          reject('An error ocurr');
        });
      });
    });
  }

  findAddressesFromW3W(w3w) {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        logger.info(`Looking for w3w ${w3w}`);

        const collection = db.collection(Addresses.COLLECTION_NAME);

        collection.find({
          three_words: w3w.trim().toLowerCase()
        }).toArray((err, res) => {
          MongoDB.close(client);

          if (res === null) {
            logger.info(`Address NOT found ${w3w}`);
            return resolve([]);
          }

          logger.info(`Address found ${w3w}`);

          resolve(res);
        })
      });
    });
  }
}

module.exports = new Addresses();
