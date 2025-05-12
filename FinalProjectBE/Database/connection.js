const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// Use DATABASE_URL from .env or fallback to local DB
const connectionString = process.env.DATABASE_URL ;

const db = new pg.Pool({ connectionString });

module.exports = db;
console.log("🧠 Connected to DB:", connectionString); // ✅ Print the value actually used
