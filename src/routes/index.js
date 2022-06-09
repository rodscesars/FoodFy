const express = require("express");
const routes = express.Router();

const home = require("./home");
const chefs = require("./chefs");
const recipes = require("./recipes");
const users = require("./users");
const profile = require("./profile");

const {
  onlyUsers,
  isLoggedRedirectToUsers,
} = require("../app/middlewares/session");

routes.use(home);
routes.use("/admin/recipes", onlyUsers, recipes);
routes.use("/admin/chefs", onlyUsers, chefs);
routes.use("/admin/users", users);
routes.use("/admin/profile", onlyUsers, profile);

routes.get("/admin", isLoggedRedirectToUsers, function (req, res) {
  return res.redirect("/admin/users/login");
});

module.exports = routes;
