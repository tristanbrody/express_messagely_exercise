/** Database connection for messagely. */

require('dotenv').config();
const { Client } = require('pg');

let DB_URI;

if (process.env.NODE_ENV === 'test') {
	DB_URI = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/messagely_test`;
} else {
	DB_URI = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/messagely`;
}

const db = new Client({
	connectionString: DB_URI
});

db.connect();

module.exports = db;
