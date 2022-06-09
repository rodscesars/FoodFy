const User = require("../models/User");
const UserValidator = require("../validators/user");

async function updateAdmin(req, res, next) {
  const { id } = req.body;
  const user = await User.findOne({ where: { id } });

  const fillAllFields = UserValidator.checkAllFields(req.body);

  if (fillAllFields) return res.render("admin/user/edit", fillAllFields);

  req.user = user;

  next();
}

module.exports = {
  updateAdmin,
};
