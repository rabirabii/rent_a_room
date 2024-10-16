require("dotenv").config({ path: "config/.env" });

module.exports = {
  development: {
    username: process.env.DB_USER || "defaultUser",
    password: process.env.DB_PASSWORD || "defaultPassword",
    database: process.env.DB_NAME || "defaultDatabase",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || "defaultUser",
    password: process.env.DB_PASSWORD || "defaultPassword",
    database: process.env.DB_TEST_NAME || "testDatabase",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
};
