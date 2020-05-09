const { createSpotifyUserAndUser } = require('../../lib/spotify/lib');
const { generateToken } = require('../jwt');

function createUser (req, res) {
  const { spotifyRefreshToken } = req.body;
  createSpotifyUserAndUser({ refreshToken: spotifyRefreshToken })
    .then(({ spotifyUser, user }) => generateToken(user))
    .then(token => res.status(201).json({ token }))
    .catch(err => res.status(400).json(err));
}

module.exports = {
  createUser
};