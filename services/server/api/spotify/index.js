const express = require('express');
const controller = require('./spotify.controller');
const { checkQueryFor } = require('../routeValidators');

const router = express.Router();

router.get('/auth/authorize', checkQueryFor(['redirect_uri']), controller.redirectToSpotifyForAuthorization);
router.post('/auth/token/swap', controller.swap);

module.exports = router;