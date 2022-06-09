const express = require("express");
const routes = express.Router();

const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");

const UserValidator = require("../app/validators/user");
const SessionValidator = require("../app/validators/session");

const {
  isLoggedRedirectToUsers,
  adminValidation,
  onlyUsers,
} = require("../app/middlewares/session");

const { updateAdmin } = require("../app/middlewares/user");

routes.get("/login", isLoggedRedirectToUsers, SessionController.loginForm);

routes.post("/login", SessionValidator.login, SessionController.login);

routes.post("/logout", SessionController.logout);

routes.get("/forgot-password", SessionController.forgotForm);

routes.post(
  "/forgot-password",
  SessionValidator.forgot,
  SessionController.forgot
);

routes.get("/password-reset", SessionController.resetForm);

routes.post("/password-reset", SessionValidator.reset, SessionController.reset);

routes.get("/", onlyUsers, adminValidation, UserController.list);
routes.get("/create", onlyUsers, adminValidation, UserController.create);
routes.post(
  "/",
  onlyUsers,
  adminValidation,
  UserValidator.post,
  UserController.post
);
routes.get("/:id/edit", onlyUsers, adminValidation, UserController.edit);
routes.put("/:id", onlyUsers, adminValidation, updateAdmin, UserController.put);
routes.delete(
  "/:id",
  onlyUsers,
  adminValidation,
  UserValidator.deleteUsers,
  UserController.delete
);

module.exports = routes;
