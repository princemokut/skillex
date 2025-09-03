/**
 * Export configuration modules for use in other packages
 */
module.exports = {
  eslint: {
    base: require('./eslint/base'),
  },
  prettier: require('./prettier'),
  typescript: {
    base: require('./typescript/base.json'),
  },
};
