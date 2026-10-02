const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// importando/incializando models
const User = require('../models/User');
const Address = require('../models/Address');
const Tech = require('../models/Tech');

const connection = new Sequelize(dbConfig);

// enviando a conexão para o método estático
// conectando o model ao bd
User.init(connection);
Address.init(connection);
Tech.init(connection);

// métodos de associação
User.associate(connection.models);
Address.associate(connection.models);
Tech.associate(connection.models);

module.exports = connection;