

/** Database setup for users. */

const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql://postgres.umfzfgwofyclooimlqpn:x6ESeLocNtfWSlxE@aws-0-us-west-1.pooler.supabase.com:5432/postgres";
} else {
  DB_URI = "postgresql://postgres.umfzfgwofyclooimlqpn:x6ESeLocNtfWSlxE@aws-0-us-west-1.pooler.supabase.com:5432/postgres";
}

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;