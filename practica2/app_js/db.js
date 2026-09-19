const { Pool } = require("pg");

const pool = new Pool({
    host: "db-semi1-g1.postgres.database.azure.com",
    port: 5432,
    database: "postgres",
    user: "marvin",
    password: "Seminario12026",
    ssl: {
    rejectUnauthorized: false  // necesario para Azure PostgreSQL
  }
});

module.exports = pool;