const express = require("express");
const routes = express.Router();
const chefs = require("../app/controllers/ChefsController");
const multer = require("../app/middlewares/multer");

const { adminValidation, onlyUsers } = require("../app/middlewares/session");

routes.get("/", onlyUsers, chefs.index);
routes.get("/create", onlyUsers, adminValidation, chefs.create);
routes.get("/:id", onlyUsers, chefs.show);
routes.get("/:id/edit", onlyUsers, adminValidation, chefs.edit);

routes.post(
  "/",
  onlyUsers,
  adminValidation,
  multer.single("avatar"),
  chefs.post
);
routes.put("/", onlyUsers, adminValidation, multer.single("avatar"), chefs.put);
routes.delete("/", onlyUsers, adminValidation, chefs.delete);

module.exports = routes;
