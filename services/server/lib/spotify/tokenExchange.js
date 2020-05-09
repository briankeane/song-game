const url = require('url');
const axios = require('axios');
const encryption = require('./encryption');
const settings = require('../../settings');

const { logAndReturnError } = require('../../lib/logger');

const authHeader = 'Basic ' + Buffer.from(settings.SPOTIFY_CLIENT_ID + ':' + settings.SPOTIFY_CLIENT_SECRET).toString('base64');
const clientCallback = 'playola-oauth://spotify';
const spotifyEndpoint = 'https://accounts.spotify.com/api/token';


function swapCodeForToken ({ redirect_uri, code }) {
  return new Promise((resolve, reject) => {
    const config = {
      method: 'post',
      url: url.parse(spotifyEndpoint),
      data: {
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri || clientCallback,
        code
      },
      headers: { Authorization: authHeader }
    };

    axios(config)
      .then(res => {
        res.data.refresh_token = encryption.encrypt(res.data.refresh_token);
        return resolve(res.data);
      })
      .catch(err => reject(logAndReturnError(err)));
  });
}

function refreshTokens ({ refresh_token }) {
  return new Promise((resolve, reject) => {
    var decryptedToken = encryption.decrypt(refresh_token);

    const config = {
      method: 'post',
      url: url.parse(spotifyEndpoint),
      data: {
        'grant_type': 'refresh_token',
        'refresh_token': decryptedToken
      },
      headers: { Authorization: authHeader }
    };

    axios(config)
      .then(res => {
        if (res.data.refresh_token) {
          res.data.refresh_token = encryption.encrypt(res.data.refresh_token);
        }
        return resolve(res.data);
      })
      .catch(err => reject(logAndReturnError(err)));
  });
} 


module.exports = {
  swapCodeForToken,
  refreshTokens
};