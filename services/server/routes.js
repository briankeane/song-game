const path = require('path');


module.exports = function (app) {
  app.use('/v1/healthCheck', require('./api/healthCheck'));
  app.use('/v1/spotify', require('./api/spotify'));
  app.use('/v1/users', require('./api/user'));
  app.use('/v1/auth', require('./api/auth'));

  // serve the main swagger file
  app.get('/swagger.yaml', (req, res) => {
    res.sendFile(path.join(`${__dirname}/swagger.yaml`));
  });

  // serve any files within /api/** subdirectory
  app.get('/:apiName.swagger.yaml',(req, res) => {
    res.sendFile(path.join(`${__dirname}/api/${req.params.apiName}/${req.params.apiName}.swagger.yaml`));
  });

  app.get('/docs', (req, res) => {
    res.sendFile(path.join(`${__dirname}/views/docs.html`));
  });
};