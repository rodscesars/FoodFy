const db = require("./src/config/db");
const { hash } = require("bcryptjs");

/**
 * Cria um usuário administrador padrão com senha "admin"
 */
async function createUserAdmin() {
  try {
    const query = `INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)`;

    const password = await hash("admin", 8);

    const values = ["Administrador", "admin@foodfy.com", password, true];

    await db.query(query, values);

    console.log("Administrador criado com sucesso!");
  } catch (err) {
    console.error(err);
  }
}

createUserAdmin();
