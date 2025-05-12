const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const connectionString = "postgres://sana:sananeel@localhost:5432/maindb";

const db = new pg.Pool({ connectionString });
module.exports = db;
