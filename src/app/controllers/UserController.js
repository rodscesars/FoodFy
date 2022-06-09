const User = require("../models/User");

module.exports = {
  create(req, res) {
    return res.render("admin/user/create");
  },
  async edit(req, res) {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    return res.render("admin/user/edit", { user });
  },
  async post(req, res) {
    const user = await User.create(req.body);

    return res.redirect("/admin/profile");
  },
  async put(req, res) {
    try {
      const { user } = req;
      let { name, email, is_admin } = req.body;

      is_admin = is_admin || false;

      await User.update(user.id, { name, email, is_admin });

      return res.render("admin/user/edit", {
        user: req.body,
        success: "Conta atualizada com sucesso!",
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/user/edit", {
        user: req.body,
        error: "Algum erro aconteceu!",
      });
    }
  },
  async delete(req, res) {
    try {
      await User.delete(req.body.id);

      const results = await User.all();
      const users = results.rows;

      return res.render("admin/user/index", {
        users,
        success: "Conta deletada com sucesso!",
      });
    } catch (err) {
      console.error(err);
      const results = await User.all();
      const users = results.rows;
      return res.render("admin/user/index", {
        users,
        error: "Erro ao tentar deletar a conta!",
      });
    }
  },
  async list(req, res) {
    const results = await User.all();
    const users = results.rows;

    return res.render("admin/user/index", { users });
  },
};
