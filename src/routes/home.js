const express = require("express");
const routes = express.Router();

const home = require("../app/controllers/HomeController");

routes.get("/", home.home);
routes.get("/about", home.about);
routes.get("/recipes", home.recipes);
routes.get("/recipes/:id", home.show);
routes.get("/chefs", home.chefs);

module.exports = routes;
