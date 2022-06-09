const Recipe = require("../models/Recipe");
const File = require("../models/File");

module.exports = {
  async index(req, res) {
    let results = await Recipe.all();
    const recipes = results.rows;

    const recipeFilesPromises = recipes.map((recipe) =>
      Recipe.files(recipe.id).then((result) => ({
        ...result.rows[0],
        recipe_id: recipe.id,
      }))
    );

    let files = await Promise.all(recipeFilesPromises);

    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/recipes/index", { recipes, files });
  },
  async create(req, res) {
    const results = await Recipe.chefSelect();
    const chefSelect = results.rows;

    return res.render("admin/recipes/create", { chefSelect });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (key != "information" && req.body[key] == "") {
        return res.send("Preencha todos os campos!");
      }
    }

    if (req.files.length == 0) {
      return res.send("Please, send at least one image");
    }

    req.body.user_id = req.session.userId;

    const filteredingredients = req.body.ingredients.filter((ingredient) => {
      return ingredient !== "";
    });

    const filteredpreparation = req.body.preparation.filter(
      (preparation) => preparation !== ""
    );

    req.body.ingredients = filteredingredients;
    req.body.preparation = filteredpreparation;

    let recipes = await Recipe.create(req.body);
    const recipeId = recipes.rows[0].id;

    const filesPromise = req.files.map((file) =>
      File.create({ ...file }).then((results) => {
        const fileId = results.rows[0].id;
        return File.createRecipeFiles({ recipe_id: recipeId, file_id: fileId });
      })
    );

    await Promise.all(filesPromise);

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send("Recipe not found!");

    results = await Recipe.files(recipe.id);
    let files = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/recipes/show", { recipe, files });
  },
  async edit(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send("Recipe not found!");

    results = await Recipe.chefSelect();
    const chefSelect = results.rows;

    results = await Recipe.files(req.params.id);
    let files = results.rows;
    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/recipes/edit", { recipe, chefSelect, files });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (
        key != "information" &&
        req.body[key] == "" &&
        key != "removed_files"
      ) {
        return res.send("Preencha todos os campos!");
      }
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map((file) =>
        File.create({ ...file }).then((results) => {
          const fileId = results.rows[0].id;
          return File.createRecipeFiles({
            recipe_id: req.body.id,
            file_id: fileId,
          });
        })
      );
      await Promise.all(newFilesPromise);
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",");
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      const removedFilesPromise = removedFiles.map((id) => File.delete(id));
      await Promise.all(removedFilesPromise);
    }

    const filteredingredients = req.body.ingredients.filter((ingredient) => {
      return ingredient !== "";
    });

    const filteredpreparation = req.body.preparation.filter(
      (preparation) => preparation !== ""
    );

    req.body.ingredients = filteredingredients;
    req.body.preparation = filteredpreparation;

    await Recipe.update(req.body);
    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    try {
      let results = await Recipe.files(req.body.id);
      let files = results.rows;

      const filesPromise = files.map((file) => File.delete(file.id));

      await Promise.all(filesPromise);
    } catch (err) {
      console.log(err);
    }
    await Recipe.delete(req.body.id);
    return res.redirect("/admin/recipes");
  },
};
