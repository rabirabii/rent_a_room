// File: db.js

const DatabaseConnection = require("./DatabaseConnections");
const { insertTestData } = require("./InsertData");
require("dotenv").config({ path: "config/.env" });
require("./Relations");

async function initializeDatabase() {
  try {
    await DatabaseConnection.authenticate();
    console.log(`Connected successfully to ${process.env.DB_NAME}`);

    await DatabaseConnection.sync({ force: false });
    console.log(`Tables synchronized with database: ${process.env.DB_NAME}`);

    // if (process.env.NODE_ENV !== "production") {
    //   await insertTestData();
    // }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { initializeDatabase };
