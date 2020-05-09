'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable('SpotifyUsers', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          autoIncrement: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        spotifyUID: {
          type: Sequelize.STRING
        },
        accessToken: {
          type: Sequelize.STRING
        },
        refreshToken: {
          type: Sequelize.STRING
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }),
      queryInterface.createTable('Users', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          autoIncrement: false,
        },
        displayName: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING,
          unique:true,
          allowNull: false
        },
        profileImageURL: {
          type: Sequelize.STRING
        },
        role: {
          type: Sequelize.ENUM('admin', 'user', 'guest'),
          allowNull: false,
          defaultValue: 'user'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.dropTable('SpotifyUsers'),
      queryInterface.dropTable('Users')
    ]);
  }
};