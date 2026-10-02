// controller para relatórios; buscas mais complexas no banco de dados
const { Op } = require('sequelize');
const User = require('../models/User');

module.exports = {
    async show(req, res) {
        // encontrar todos usuários que tem email que termina com @gmail.com
        // desses usuarios eu quero buscar todos que moram na rua "Rua ABC"
        // desses usuários quero buscar as tecnologias que começam com React

        const users = await User.findAll({
            attributes: ['name', 'email'],
            where: {
                email: {
                    [Op.iLike]: '%@gmail.com'
                }
            },
            include: [
                { association: 'addresses', where: { street: 'Rua ABC' } }, //endereços
                { association: 'techs', required: false ,where: { name: { [Op.iLike]: 'React%' } } }, // tecnologias
            ]
        })
        return res.json(users);
    }
}