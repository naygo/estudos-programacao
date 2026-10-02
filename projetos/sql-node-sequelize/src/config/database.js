// exportando as credenciais do banco de dados 
// para: database/index.js & .sequelizerc

module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '1234',
    database: 'nodesequelize',
    define: {
        timestamps: true,
        // created_at: data que o registro foi criado
        // update_at: ultima vez que o registro foi atualizado
        underscored: true,
    },
};

