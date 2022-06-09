const { Pool } = require("pg");

module.exports = new Pool({
  user: "rodrigomendes",
  password: "",
  host: "localhost",
  port: 5432,
  database: "foodfydb",
});
