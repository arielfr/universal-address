const logger = require('winston-this')('addresses-service');
const MongoDB = require('../database/MongoDB');
const MapQuestService = require('../services/MapQuest');

/**
 * This class is going to store the users locations
 */
class Addresses {
  static get COLLECTION_NAME () {
    return 'addresses';
  }

  addAddress(userData, lat, long, threeWords, firstWord, realAddress) {
    return new Promise((resolve, reject) => {
      logger.info(`Adding the address for ${userData.id} and the location is ${realAddress}`);

      return MongoDB.connect().then(({ client, db }) => {
        const collection = db.collection(Addresses.COLLECTION_NAME);

        const data = {
          geo: {
            lat: lat,
            long: long,
          },
          three_words: threeWords,
          first_word: firstWord,
          address: realAddress,
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

  /**
   * Check if the user already have and address
   * @param userId
   * @returns {Promise<any>}
   */
  haveAddress(userId) {
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

  getAddressImage(address) {
    return new Promise((resolve, reject) => {
      MongoDB.connect().then(({ client, db }) => {
        logger.info(`Looking for address ${address}`);

        const collection = db.collection(Addresses.COLLECTION_NAME);

        collection.findOne({
          address: address.trim().toLowerCase()
        }).then((res) => {
          console.log(res);
          if (res === null) {
            logger.info(`Address NOT found ${address}`);
            return resolve('');
          }

          logger.info(`Address found ${address}`);

          const staticMap = MapQuestService.getStaticMapUrl({
            current: {
              lat: res.geo.lat,
              long: res.geo.long,
            }
          });

          resolve(staticMap);
        }).catch(err => {
          logger.error(`An error ocurr checking the next number: ${err}`);

          MongoDB.close(client);

          reject('An error ocurr');
        });
      });
    });
  }
}

module.exports = new Addresses();
