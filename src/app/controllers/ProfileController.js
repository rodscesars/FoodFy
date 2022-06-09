const User = require("../models/User");

module.exports = {
  async index(req, res) {
    const { user } = req;

    return res.render("admin/user/show", { user });
  },
  async put(req, res) {
    try {
      const { user } = req;
      let { name, email } = req.body;

      await User.update(user.id, { name, email });

      return res.render("admin/user/show", {
        user: req.body,
        success: "Conta atualizada com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/user/show", {
        user: req.body,
        error: "Algum erro aconteceu!",
      });
    }
  },
};
