const app = require('../../server');
const request = require('supertest');
const { assert } = require('chai');
const db = require('../../db');
const settings = require('../../settings');
const {
  ensureAppReady,
  clearDatabase
} = require('../../testHelpers/testUtils');
const encryption = require('../../lib/spotify/encryption');
const { createSpotifyUser } = require('../../testHelpers/spotify/helpers');
const jwt = require('jsonwebtoken');

describe('User', function () {
  let spotifyAccessToken, spotifyRefreshToken, encryptedSpotifyRefreshToken;

  before(async function () {
    spotifyAccessToken = 'thisisanaccesstoken';
    spotifyRefreshToken = 'thisisaspotifyrefreshtoken';
    encryptedSpotifyRefreshToken = encryption.encrypt(spotifyRefreshToken);
    await ensureAppReady(app);
    await clearDatabase(db);
  });

  afterEach(async function () {
    await clearDatabase(db);
  });

  describe('User and SpotifyUser already exist', function () {  
    let user, spotifyUser;

    before(async function () {
      spotifyUser = await createSpotifyUser(db, { accessToken: spotifyAccessToken, refreshToken: encryptedSpotifyRefreshToken });
      user = await db.models.User.findOne({ where: { id: spotifyUser.userID } });
    });

    it('should return the existing User if its SpotifyUser already exists', function(done) {
      request(app)
        .post('/v1/users')
        .send({ spotifyRefreshToken: encryptedSpotifyRefreshToken })
        .set('Accept', 'application/json')
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          assert.exists(res.body.token);
          jwt.verify(res.body.token, settings.JWT_SECRET, (err, payload) => {
            assert.equal(payload.email, user.email);
            assert.equal(payload.profileImageURL, user.profileImageURL);
            assert.equal(payload.role, user.role);
            assert.equal(payload.displayName, user.displayName);
            assert.equal(payload.id, user.id.toString());
            done();
          });
        });
    });

    it('should create a new User and SpotifyUser if they do not yet exist', function () {

    });
  });

  it('should gracefully handle a bad token', function() {

  });

  it('should work if the User and SpotifyUser already exist', function () {

  }); 
});