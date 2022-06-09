const db = require("../../config/db");
const { date } = require("../../lib/utils");
const fs = require("fs");

module.exports = {
  create(data, file_id) {
    const query = `
    INSERT INTO chefs (
      name,
      file_id,
      created_at
    ) VALUES ($1, $2, $3)
    RETURNING id`;

    const values = [data.name, file_id, date(Date.now()).iso];

    return db.query(query, values);
  },
  find(id) {
    const query = `SELECT chefs.*, count(recipes) AS total_recipes, files.path
    FROM chefs
    LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
    LEFT JOIN files ON (files.id = chefs.file_id)
    WHERE chefs.id = $1
    GROUP BY chefs.id, files.id`;

    return db.query(query, [id]);
  },
  update(data, fileId) {
    const query = `
    UPDATE chefs SET
      name = ($1),
      file_id = ($3)
    WHERE id = $2
  `;
    const values = [data.name, data.id, fileId];

    return db.query(query, values);
  },
  delete(id) {
    return db.query(`DELETE from chefs WHERE id=$1`, [id]);
  },
  recipeIndex(id) {
    const query = `SELECT recipes.*
    FROM recipes
    LEFT JOIN chefs ON(recipes.chef_id = chefs.id)
    WHERE recipes.chef_id = $1
    GROUP BY recipes.id`;

    return db.query(query, [id]);
  },
  async deleteFile(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = result.rows[0]; //pega o file pelo id

      fs.unlinkSync(file.path); //sincroniza a path do file com o fs, deleta o arquivo

      await db.query(`DELETE FROM files WHERE id = $1`, [id]);
    } catch (err) {
      console.error(err);
    }
  },
  all() {
    return db.query(`SELECT CHEFS.*, files.path, count(recipes) AS total_recipes
    FROM chefs
    LEFT JOIN files ON (files.id = chefs.file_id)
    LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
    GROUP BY chefs.id, files.id
    ORDER BY chefs.id`);
  },
};
