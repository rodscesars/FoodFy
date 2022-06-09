const Chef = require("../models/Chef");
const File = require("../models/File");
const Recipe = require("../models/Recipe");

module.exports = {
  async index(req, res) {
    let results = await Chef.all();
    let chefs = results.rows;

    chefs = chefs.map((chef) => ({
      ...chef,
      src: `${req.protocol}://${req.headers.host}${chef.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/chefs/index", { chefs });
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Preencha todos os campos!");
      }
    }

    let results = await File.create({
      filename: req.file.filename,
      path: req.file.path,
    });

    const fileId = results.rows[0].id;

    results = await Chef.create(req.body, fileId);
    const chef = results.rows[0];

    return res.redirect(`/admin/chefs/${chef.id}`);
  },
  async show(req, res) {
    //PEGAR O CHEF
    let results = await Chef.find(req.params.id);
    let chef = results.rows[0];

    if (!chef) return res.send("Chef not found!");

    //CRIAR SRC DA IMAGEM DO CHEF

    const avatarFile = {
      src: `${req.protocol}://${req.headers.host}${chef.path.replace(
        "public",
        ""
      )}`,
    };

    //PEGAR AS RECEITAS

    results = await Chef.recipeIndex(req.params.id);
    const recipeIndex = results.rows;

    //PEGAR IMAGEM DAS RECEITAS

    const recipeFilesPromise = recipeIndex.map((recipe) =>
      Recipe.allRecipeFiles(recipe.id).then((result) => ({ ...result.rows[0] }))
    );

    let files = await Promise.all(recipeFilesPromise);

    files = files.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }));

    return res.render("admin/chefs/show", {
      chef,
      recipeIndex,
      avatarFile,
      files,
    });
  },
  async edit(req, res) {
    let results = await Chef.find(req.params.id);
    const chef = results.rows[0];

    if (!chef) return res.send("Chef not found!");

    return res.render("admin/chefs/edit", { chef });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Preencha todos os campos!");
      }
    }

    let results = await Chef.find(req.body.id);
    const chef = results.rows[0];
    const oldFileId = chef.file_id;

    try {
      if (req.file) {
        results = await File.create({
          filename: req.file.filename,
          path: req.file.path,
        });
        const fileId = results.rows[0].id;
        await Chef.update(req.body, fileId);
        await Chef.deleteFile(oldFileId);
      } else await Chef.update(req.body, oldFileId);
    } catch (err) {
      console.log(err);
    }

    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    try {
      let results = await Chef.find(req.body.id);
      const chef = results.rows[0];

      if (chef.total_recipes >= 1) {
        return res.send("Chefs com receitas não podem ser deletados!");
      } else {
        await Chef.delete(req.body.id);
        await Chef.deleteFile(chef.file_id);
      }
    } catch (err) {
      console.log(err);
    }
    return res.redirect("/admin/chefs");
  },
};
