const querystring = require('querystring');
const settings = require('../../settings');
const tokenExchange = require('../../lib/spotify/tokenExchange');
const { createSpotifyUserAndUser } = require('../../lib/spotify/lib');
const logger = require('../../lib/logger');

function redirectToSpotifyForAuthorization (req, res) {
  const query = querystring.stringify({
    response_type: 'code',
    client_id: settings.SPOTIFY_CLIENT_ID,
    scope: settings.SPOTIFY_SCOPES,
    redirect_uri: req.query.redirect_uri
  });
  return res.redirect('https://accounts.spotify.com/authorize?' + query);
}

async function swap (req, res, next) {
  const { code, refresh_token, redirect_uri } = req.body;
  let body;
  try {
    if (code) {
      body = await tokenExchange.swapCodeForToken({ code, redirect_uri });
      await createSpotifyUserAndUser({
        accessToken: body.access_token,
        refreshToken: body.refresh_token
      });
    } else {
      body = await tokenExchange.refreshTokens({ refresh_token });
    }
    return res.status(200).json(body);
  } catch (err) {
    logger.error(err);
    return res.status(400).json(err);
  }
}

module.exports = {
  redirectToSpotifyForAuthorization,
  swap
};