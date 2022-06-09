const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: "Por favor, preencha todos os campos!",
      };
    }
  }
}

async function post(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render("admin/user/create", fillAllFields);
  }

  let { name, email } = req.body;

  const user = await User.findOne({ where: { name }, or: { email } }); //vai verificar se já não existe o usuario

  if (user)
    return res.render("admin/user/create", {
      user: req.body,
      error: "Usuário já cadastrado!",
    });

  next();
}

async function show(req, res, next) {
  const { userId: id } = req.session;

  const user = await User.findOne({ where: { id } });

  if (!user)
    return res.render("admin/user/create", {
      error: "Usuário não encontrado!",
    });

  req.user = user;

  next();
}

async function update(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) {
    return res.render("admin/user/show", fillAllFields);
  }

  const { id, password } = req.body;

  if (!password)
    return res.render("admin/user/show", {
      user: req.body,
      error: "Coloque sua senha para atualizar seu cadastro",
    });

  const user = await User.findOne({ where: { id } });

  const passed = await compare(password, user.password);

  if (!passed)
    return res.render("admin/user/show", {
      user: req.body,
      error: "Senha incorreta!",
    });

  req.user = user;

  next();
}

async function deleteUsers(req, res, next) {
  // const { userId: id } = req.session;
  const id = req.body.id;
  const user = await User.findOne({ where: { id } });

  if (user.is_admin) {
    return res.render("admin/user/edit", {
      user,
      error: "Não é possível deletar a conta de um administrador!",
    });
  }
  next();
}

module.exports = {
  checkAllFields,
  post,
  show,
  update,
  deleteUsers,
};
