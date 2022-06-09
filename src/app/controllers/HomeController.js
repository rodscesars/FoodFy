const data = require("../../../data.json");
const Home = require("../models/Home");
const Recipe = require("../models/Recipe");

module.exports = {
  home(req, res) {
    return res.render("home/home", { recipes: data.recipes });
  },
  about(req, res) {
    return res.render("home/about");
  },
  async recipes(req, res) {
    let { filter, page, limit } = req.query;

    page = page || 1;
    limit = limit || 2;
    const offset = limit * (page - 1);

    if (filter) {
      const params = {
        filter,
        limit,
        offset,
      };

      let results = await Home.paginate(params);
      const recipes = results.rows;

      if (recipes.length == 0)
        return res.send("Nenhuma receita encontrada com esse valor!");

      const recipesPromise = recipes.map((recipe) =>
        Recipe.files(recipe.id).then((result) => ({
          ...result.rows[0],
          recipe_id: recipe.id,
        }))
      );

      let files = await Promise.all(recipesPromise);

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
      };

      return res.render("home/recipes", {
        recipes,
        pagination,
        filter,
        files,
      });
    } else {
      const params = {
        limit,
        offset,
      };

      results = await Home.paginate(params);
      const recipes = results.rows;

      if (recipes.length == 0) return res.send("Nenhuma receita encontrada!");

      const recipesPromise = recipes.map((recipe) =>
        Recipe.files(recipe.id).then((result) => ({
          ...result.rows[0],
          recipe_id: recipe.id,
        }))
      );

      let files = await Promise.all(recipesPromise);

      files = files.map((file) => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace(
          "public",
          ""
        )}`,
      }));

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
      };

      return res.render("home/recipes", {
        recipes,
        pagination,
        files,
      });
    }
  },
  async show(req, res) {
    let results = await Home.findRecipe(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send("Receita não encontrada!");

    results = await Recipe.files(recipe.id);
    let files = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("home/show", { recipe, files });
  },
  async chefs(req, res) {
    let results = await Home.chefIndex();
    let chefs = results.rows;

    chefs = chefs.map((chef) => ({
      ...chef,
      src: `${req.protocol}://${req.headers.host}${chef.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("home/chefs", { chefs });
  },
};
