const express = require('express');
const controller = require('./user.controller');
// const { checkJWTAuthorization } = require('../security');

const router = express.Router();

router.post('/', controller.createUser);

module.exports = router;