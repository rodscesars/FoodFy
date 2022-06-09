const db = require("../../config/db");
const { hash } = require("bcryptjs");
const Recipe = require("./Recipe");
const File = require("./File");
const fs = require("fs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");

module.exports = {
  async findOne(filters) {
    let query = `SELECT * FROM users`;

    Object.keys(filters).map((key) => {
      query = `${query}
        ${key}`;
      Object.keys(filters[key]).map((field) => {
        query = `${query} ${field} = '${filters[key][field]}'`;
      });
    });

    const results = await db.query(query);

    return results.rows[0];
  },
  async create(data) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4) RETURNING id`;

      const password = crypto.randomBytes(8).toString("hex");

      const passwordHash = await hash(password, 8);

      const values = [
        data.name,
        data.email,
        passwordHash,
        data.is_admin == "on" ? true : false,
      ];

      await mailer.sendMail({
        to: data.email,
        from: "no-reply@foodfy.com.br",
        subject: "Senha para primeiro acesso",
        html: `<h2>Senha de Acesso no Foodfy</h2>
          <p>Boas vindas, ${data.name}</p>
          <p>Você pode alterar a sua senha após realizar o seu primeiro acesso.</p>
          <p>As informações de login seguem abaixo: </p>
          <p>Email: ${data.email}</p>
          <p>
            Senha: ${password}
          </p>
        `,
      });

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
      console.error(err);
    }
  },
  async update(id, fields) {
    let query = `UPDATE users SET`;

    Object.keys(fields).map((key, index, array) => {
      if (index + 1 < array.length) {
        query = `${query}
        ${key} = '${fields[key]}',`;
      } else {
        //ultima iteracao
        query = `${query}
        ${key} = '${fields[key]}'
        WHERE id = ${id}`;
      }
    });

    await db.query(query);
    return;
  },
  async delete(id) {
    let results = await db.query("SELECT * from recipes WHERE user_id = $1", [
      id,
    ]);
    const recipes = results.rows;

    const allFilesPromise = recipes.map((recipe) => Recipe.files(recipe.id));
    let promiseResults = await Promise.all(allFilesPromise);

    await db.query("DELETE FROM users WHERE id=$1", [id]);

    promiseResults.map((results) =>
      results.rows.map((file) => {
        try {
          File.delete(file.id);
        } catch (err) {
          console.error(err);
        }
      })
    );
  },
  all() {
    return db.query(`
    SELECT * FROM users
    ORDER BY updated_at DESC
  `);
  },
};
