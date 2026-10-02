const express = require('express');

// Importando controllers
const UserController = require('./controllers/UserController');
const Addresses = require('./controllers/AddressController');
const TechController = require('./controllers/TechController');
const ReportController = require('./controllers/ReportController')

const routes = express.Router();

// Users routers
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

// Addresses routes
routes.get('/users/:user_id/addresses', Addresses.index);
routes.get('/addresses', Addresses.indexAll);
routes.post('/users/:user_id/addresses', Addresses.store);

// Techs routes
routes.get('/users/:user_id/techs', TechController.index);
routes.post('/users/:user_id/techs', TechController.store);
routes.delete('/users/:user_id/techs', TechController.delete);

// Report route
routes.get('/report/', ReportController.show)

module.exports = routes;