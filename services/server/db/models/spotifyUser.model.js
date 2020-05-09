const { Sequelize, DataTypes, Model } = require('sequelize');
const logger = require('../../lib/logger');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.NODE_ENV === 'test' ? false : logger.log
});

class SpotifyUser extends Model {}

SpotifyUser.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    autoIncrement: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  spotifyUID: DataTypes.STRING,
  accessToken: DataTypes.STRING,
  refreshToken: DataTypes.STRING,
  userID: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'SpotifyUser'
});

module.exports = SpotifyUser;