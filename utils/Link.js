const LinkUtility = {
  BASE_URL: 'https://universal-address.now.sh',
  SHORT_LINK_PATH: '/r/',
};

/**
 * Get link using tinyUrlId
 * @param tinyUrlId
 * @returns {string}
 */
LinkUtility.generateShortLink = function (tinyUrlId) {
  return this.BASE_URL + this.SHORT_LINK_PATH + tinyUrlId;
};

module.exports = LinkUtility;
