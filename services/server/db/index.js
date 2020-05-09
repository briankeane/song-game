const Sequelize = require('sequelize');
const logger = require('../lib/logger');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.NODE_ENV === 'test' ? false : logger.log
});

const models = {
  User: require('./models/user.model'),
  SpotifyUser: require('./models/spotifyUser.model')
};

module.exports = {
  sequelize,
  db: sequelize,
  models
};