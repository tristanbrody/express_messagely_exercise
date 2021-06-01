/** Common config for message.ly */

// read .env files and make environmental variables

require('dotenv').config();

let DB_URI;
if (process.env.NODE_ENV === 'test') {
	DB_URI = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/messagely_test`;
} else {
	DB_URI = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/messagely`;
}

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
	DB_URI,
	SECRET_KEY,
	BCRYPT_WORK_FACTOR
};
