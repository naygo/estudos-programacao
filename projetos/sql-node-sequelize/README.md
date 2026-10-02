# SQL no Node.js com Sequelize
## Rocketseat - Masterclass #01

+ Back-end qualquer que contém:
    - usuários
    - endereços
    - tecnologias

+ Com as relações:
    - usuários 1-1 endereços
    - usuários N-N tecnologias

+ Foi utilizado:
    - Postgres
    - Sequelize
    - Node

+ Para visualização de resultados e inserção de dados:
    - DBeaver
    - Insomnia

## Níveis de abstração
>Formas de se comunicar com o banco de dados

+ 1º nível: **Postgres**
    - querys dentro do banco de dados
+ 2º nível: **Knex**
    - query builder
    - suporte para as **_migrations_**
        - _migrations:_ como o banco de dados vai se comportar em tempo de vida da aplicação 
    - Histórico de dados
+ 3º nível: **Sequelize**
    - ORM para escrever menos código
    - define models
    - tem um query builder por baixo dos panos
    - **_sequelize-cli_**: interface de linha de comandos


## Comandos Sequelize

+ **yarn sequelize db:create** 
    - cria o banco de dados
+ **yarn sequelize migration:create --name=create-nomeTabela**
    - cria uma migration
+ **yarn sequelize db:migrate**
    - após a consiguração da migration, envia ela para o BD como um tabela
+ **yarn sequelize db:migrate:undo**
    - desfaz o último bd:migrate
+ **yarn sequelize db:migrate:undoall**
    - desfaz todo db:migrate

## Arquitetura de projetos

+ [src](/src/): fontes da aplicação
+ [server.js](src/server.js): liga o server
+ [routes.js](src/routes.js): estabelicida as rotas que os métodos dos controllers devem tomar
+ [config/database.js](src/config/database.js): exporta um objeto de configurações da conexão ao banco de dados
+ [database](src/database/): tudo relacionado ao banco de dados 
+ [database/index.js](src/database/index.js): onde é estabelido a conexão dos módulos com o banco de dados
+ [.sequelizerc](/.sequelizerc/): informa ao sequelize as credenciais de acesso, e onde deve salvar as migrations
+ [database/migrations](src/database/migrations): migrations criadas pelo sequelize
+ [models](src/models): módulos da aplicação, classes que representam de como a aplicação vai se comunicar com a base de dados 
+ [controllers](src/controllers): lida com as requisições e envia respostas para o front-end

