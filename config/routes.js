'use strict';

/*
 * Module dependencies.
 */

const users = require('../app/controllers/users');
const properties = require('../app/controllers/properties');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

const propertyAuth = [auth.requiresLogin, auth.property.hasAuthorization];

const fail = {
  failureRedirect: '/login'
};

/**
 * Expose routes
 */

module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport);

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    pauth('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);

  app.param('userId', users.load);

  // property routes
  app.param('id', properties.load);
  app.get('/properties', properties.index);
  app.get('/properties/new', auth.requiresLogin, properties.new);
  app.post('/properties', auth.requiresLogin, properties.create);
  app.get('/properties/:id', properties.show);
  app.get('/properties/:id/edit', propertyAuth, properties.edit);
  app.put('/properties/:id', propertyAuth, properties.update);
  app.delete('/properties/:id', propertyAuth, properties.destroy);

  // home route
  app.get('/', properties.index);

  // tag routes
  app.get('/tags/:tag', tags.index);


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    res.status(500).render('500', { error: err.stack });
  });

  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
