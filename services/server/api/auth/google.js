const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

function standardizedProfile (profile) {
	return {
		email: profile._json.email,
		googleUID: profile.id,
		displayName: profile.displayName,
		profileImage: profile._json.picture
	};
}

const configure = ({ findOrCreateUser, callbackURL }) => {
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL
	}, async function (accessToken, refreshToken, profile, cb) {
		await findOrCreateUser(standardizedProfile(profile));
		return cb(null, profile);	
	}));
}

function handleCallback(req, res, next) {
	console.log('handling callback');
	return passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login',
		accessType: 'offline',
		session: false,
		prompt: 'consent'
	})(req, res, next);
}

module.exports = {
	configure,
	handleCallback
};