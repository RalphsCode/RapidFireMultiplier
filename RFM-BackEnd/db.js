

/** Database setup for users. */

const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql://postgres:2024@localhost/rapidfiremultiplier";
} else {
  DB_URI = "postgresql://postgres:2024@localhost/rapidfiremultiplier";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;