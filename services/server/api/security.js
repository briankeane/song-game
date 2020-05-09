const settings = require('../settings');
const jwt = require('express-jwt')({secret: settings.JWT_SECRET});

function checkJWTAuthorization(req, res, next) {
  jwt(req, res, (err) => {
    if (req.user) {
      return next();
    } else {
      let error = new Error('Invalid credentials');
      error.code = 'jwt';
      err.statusCode = 401;
      return next(err);
    }
  });
}

module.exports = {
  checkJWTAuthorization
};