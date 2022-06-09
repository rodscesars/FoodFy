const User = require("../models/User");
const db = require("../../config/db");

function onlyUsers(req, res, next) {
  if (!req.session.userId) return res.redirect("/users/login");
  next();
}

async function isLoggedRedirectToUsers(req, res, next) {
  if (req.session.userId) {
    const id = req.session.userId;

    const user = await User.findOne({ where: { id } });

    return res.redirect("/admin/profile");
  }

  next();
}

async function adminValidation(req, res, next) {
  if (req.session.userId) {
    const id = req.session.userId;

    const user = await User.findOne({ where: { id } });

    if (!user.is_admin) {
      return res.render("admin/user/show", {
        user,
        error: "Somente os administradores podem acessar essa rota!",
      });
    }
  } else {
    return res.redirect("/admin");
  }
  next();
}

async function userRecipesValidation(req, res, next) {
  const id = req.session.userId;

  let results = await db.query(`SELECT * FROM recipes WHERE user_id = $1`, [
    id,
  ]);
  const userRecipes = results.rows;
  const allRecipesPromise = userRecipes.map((recipe) => recipe.id);

  function forNext(allRecipesId, currentRecipe) {
    for (recipe of allRecipesId) {
      if (recipe == currentRecipe) return recipe;
    }
  }

  const user = await User.findOne({ where: { id } });

  if (!forNext(allRecipesPromise, req.params.id) && !user.is_admin) {
    return res.render("admin/user/show", {
      user,
      error: "Você não pode modificar essa receita",
    });
  }

  next();
}

module.exports = {
  onlyUsers,
  isLoggedRedirectToUsers,
  adminValidation,
  userRecipesValidation,
};
