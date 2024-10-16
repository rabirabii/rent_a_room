require("dotenv").config({ path: "config/.env" });
const fs = require("fs");
const { Client } = require("pg");

const dbName = "room_booking_system";

async function createDatabase() {
  const envPath = "config/.env";

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");

    if (envContent.includes(`DB_NAME=${dbName}`)) {
      console.log(
        `.env file already contains DB_NAME=${dbName}. No need to create the database.`
      );
      return;
    }
  }

  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: "postgres",
  });

  try {
    await client.connect();

    const checkDbQuery = `SELECT datname FROM pg_catalog.pg_database WHERE datname = $1`;
    const result = await client.query(checkDbQuery, [dbName]);

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);

      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
      }

      const updatedEnvContent =
        envContent.replace(/DB_NAME=.*/g, "") + `\nDB_NAME=${dbName}\n`;
      fs.writeFileSync(envPath, updatedEnvContent.trim(), "utf8");

      console.log(".env file updated with DB_NAME");
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    await client.end();
  }
}

module.exports = createDatabase;
