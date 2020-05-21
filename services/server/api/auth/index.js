const express = require('express');
const google = require('./google');
const router = express.Router();
const passport = require('passport');

const findOrCreateUser = (profile) => {
	console.log('profile: ', JSON.stringify(profile,0,2));
	return Promise.resolve();
}

google.configure({ findOrCreateUser, callbackURL: `${process.env.BASE_URL}:10020/v1/auth/google/callback` });


router.use(passport.initialize());

router.get('/google/login', 
	passport.authenticate('google', 
		{ 
			scope: [
				'https://www.googleapis.com/auth/gmail.compose',
				'https://www.googleapis.com/auth/gmail.readonly',
				'https://www.googleapis.com/auth/userinfo.email',
				'https://www.googleapis.com/auth/calendar.readonly',
				'https://www.googleapis.com/auth/userinfo.profile'
				],
			accessType: 'offline',
			session: false,
			prompt: 'consent' }));

router.get('/google/callback', google.handleCallback, (req, res) =>  res.redirect('/'));


module.exports = router;