# FoodFy
Website de gerenciamento de chefs e receitas desenvolvido durante o LaunchBase da Rocketseat 🚀


<p align="center">
    <img width="130px" src="./public/assets/chef.png" align="center"/>
</p>


# Sobre o projeto

## Funcionalidades


* Sistema de login
* Acesso para administrador
* Cadastro de usuários, chefs e receitas
* Banco de dados PostgreSQL.
* Upload de imagems com Multer.
* Páginas dinâmicas com Nunjucks.
* Sistema de recuperação de senha através do email.


## Tecnologias e Ferramentas Utilziadas

- [HTML](https://devdocs.io/html/)
- [CSS](https://devdocs.io/css/)
- [JavaScript](https://devdocs.io/javascript/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [NodeJS](https://nodejs.org/en/)
- [Nodemailer](https://nodemailer.com/about/)
- [Express](https://expressjs.com/)
- [Express Session](https://github.com/expressjs/session)
- [Multer](https://github.com/expressjs/multer)
- [PostgreSQL](https://www.postgresql.org/)
- [BcryptJS](https://github.com/dcodeIO/bcrypt.js)
- [Faker.js](https://github.com/Marak/Faker.js)


# Instalação

### Pré Requisitos

É necessário instalar o [Node.js](https://nodejs.org/en/) e [PostgreSQL](https://www.postgresql.org/). O [Postbird](https://github.com/Paxa/postbird) é a ferramenta indicada para o gerenciamento do banco de dados.

### Siga os passos abaixo

```bash
# Abra o terminal do seu ambiente de desenvolvimento e clone esse repositório
$ git clone https://github.com/rodscesars/FoodFy.git

# Entre no diretório do projeto
$ cd foodfy

# Instale todas as dependências
$ npm install

# Dê start na conexão com o PostgreSQL
# Procure o arquivo "database.sql" e copie os comandos para aplicar no Postbird a criação do banco de dados e suas tabelas

# Conecte-se com o banco de dados por meio do arquivo "db.js" dentro da pasta "src/config" 
# Edite as informações com o seu usuário e senha

# Em seguida rode o arquivo "seed.js", para criação de um usuário administrador padrão
# email: admin@foody.com
# senha: admin
$ node seed.js

# Inicie a aplicação
$ npm start
```

# Licença

Este projeto está sob licença MIT, para mais detalhes verifique [LICENSE](/LICENSE)

---
