const db = require("../../config/db");

module.exports = {
  chefIndex() {
    return db.query(
      `SELECT chefs.*, files.path, count(recipes) AS total_recipes
    FROM chefs
    LEFT JOIN files ON (files.id = chefs.file_id)
    LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
    GROUP BY chefs.id, files.id
    ORDER BY chefs.id`
    );
  },
  recipeIndex() {
    return db.query(
      `SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ORDER BY updated_at`
    );
  },
  findRecipe(id) {
    return db.query(
      `SELECT recipes.*, chefs.name AS chef_name
     FROM recipes
     LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
     WHERE recipes.id = $1
     ORDER BY updated_at`,
      [id]
    );
  },
  paginate(params) {
    const { filter, limit, offset } = params;

    let query = "";
    let filterQuery = "";
    let totalQuery = `(SELECT count(*) FROM recipes) AS total`;

    if (filter) {
      filterQuery = `
      WHERE recipes.title ILIKE '%${filter}%'`;

      totalQuery = `(SELECT count(*) FROM recipes
      ${filterQuery}) AS total`;
    }

    query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    ${filterQuery}
    ORDER BY updated_at
    LIMIT $1 OFFSET $2
    `;

    return db.query(query, [limit, offset]);
  },
};
