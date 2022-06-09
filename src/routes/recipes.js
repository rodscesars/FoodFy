const express = require("express");
const routes = express.Router();
const recipes = require("../app/controllers/RecipesController");
const multer = require("../app/middlewares/multer");

const { userRecipesValidation } = require("../app/middlewares/session");
const { onlyUsers } = require("../app/middlewares/session");

routes.get("/", onlyUsers, recipes.index);
routes.get("/create", onlyUsers, recipes.create);
routes.get("/:id", onlyUsers, recipes.show);
routes.get("/:id/edit", onlyUsers, userRecipesValidation, recipes.edit);

routes.post(
  "/",
  onlyUsers,

  multer.array("photos", 5),
  recipes.post
);
routes.put("/", onlyUsers, multer.array("photos", 5), recipes.put);
routes.delete("/", onlyUsers, recipes.delete);

module.exports = routes;
