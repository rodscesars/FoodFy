const express = require("express");
const routes = express.Router();

const ProfileController = require("../app/controllers/ProfileController");

const UserValidator = require("../app/validators/user");

const { onlyUsers } = require("../app/middlewares/session");

routes.get("/", onlyUsers, UserValidator.show, ProfileController.index);
routes.put("/", onlyUsers, UserValidator.update, ProfileController.put);

module.exports = routes;
