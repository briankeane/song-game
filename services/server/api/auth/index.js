const express = require('express');
const { ongGoogleSuccessfulAuth } = './googleController';
const router = express.Router();

router.post('/google/login',
	authorizeGoogleUser,
	onGoogleSuccessfulAuth
)
router.get('/auth/authorize', checkQueryFor(['redirect_uri']), controller.redirectToSpotifyForAuthorization);
router.post('/auth/token/swap', controller.swap);

module.exports = router;