const oracledb = require("oracledb");
const path = require("path");

let pool;

async function initializeDatabase() {
  try {
    const clientPath = path.join(
      __dirname,
      "..",
      "Oracle",
      "instantclient_21_3",
    );

    oracledb.initOracleClient({
      libDir: clientPath,
    });
    console.log(
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      process.env.DB_CONNECT_STRING,
    );
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,

    //   poolMin: 2,
    //   poolMax: 20,
    //   poolIncrement: 2,

    //   poolTimeout: 60,
    });

    console.log("Oracle Connection Pool Created");
  } catch (error) {
    console.error("Database Initialization Error");
    console.error(error);
    process.exit(1);
  }
}

function getPool() {
  return pool;
}

module.exports = {
  initializeDatabase,
  getPool,
};
