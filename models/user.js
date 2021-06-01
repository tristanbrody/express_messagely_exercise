/** User class for message.ly */

const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config');
const db = require('../db');
const ExpressError = require('../expressError');

/** User of the site. */

class User {
	/** register new user -- returns
	 *    {username, password, first_name, last_name, phone}
	 */

	static async register({ username, password, first_name, last_name, phone }) {
		const joinAt = new Date();
		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
		const result = await db.query(
			`
      INSERT INTO users 
        (username, password, first_name, last_name, phone, join_at)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING
        username, password, first_name, last_name, phone
    `,
			[username, hashedPassword, first_name, last_name, phone, joinAt]
		);
		return result.rows[0];
	}

	/** Authenticate: is this username/password valid? Returns boolean. */

	static async authenticate(username, password) {
		try {
			const result = await db.query(
				`
			  SELECT password
			  FROM users
			  WHERE username = $1
			`,
				[username]
			);
			const user = results.rows[0];
			console.log(user);
			if (user) {
				return await bcrypt.compare(password, user.password);
			}
			return false;
		} catch {
			return false;
		}
	}

	/** Update last_login_at for user */

	static async updateLoginTimestamp(username) {
		try {
			const now = new Date();
			const result = await db.query(
				`
      UPDATE users
      SET last_login_at = $1
      WHERE username = $2 
    `,
				[now, username]
			);
			return true;
		} catch {
			return false;
		}
	}

	/** All: basic info on all users:
	 * [{username, first_name, last_name, phone}, ...] */

	static async all() {
		const result = await db.query(`
      SELECT username, first_name, last_name, phone
      FROM users
      WHERE 1 = 1
    `);
		return result.rows;
	}

	/** Get: get user by username
	 *
	 * returns {username,
	 *          first_name,
	 *          last_name,
	 *          phone,
	 *          join_at,
	 *          last_login_at } */

	static async get(username) {
		try {
			const result = await db.query(
				`
        SELECT
          username, first_name, last_name, phone, join_at, last_login_at
        FROM 
          users
        WHERE
          username = $1
      `,
				[username]
			);
			return result.rows[0];
		} catch {
			return false;
		}
	}

	/** Return messages from this user.
	 *
	 * [{id, to_user, body, sent_at, read_at}]
	 *
	 * where to_user is
	 *   {username, first_name, last_name, phone}
	 */

	static async messagesFrom(username) {
		const result = await db.query(
			`
      SELECT id, to_user, body, sent_at, read_at
      FROM messages m 
      LEFT JOIN users u ON m.from_username = u.username
      WHERE u.username = $1 
    `,
			[username]
		);
		return result.rows;
	}

	/** Return messages to this user.
	 *
	 * [{id, from_user, body, sent_at, read_at}]
	 *
	 * where from_user is
	 *   {id, first_name, last_name, phone}
	 */

	static async messagesTo(username) {
		const result = await db.query(
			`
      SELECT id, from_user, body, sent_at, read_at
      FROM messages m 
      LEFT JOIN users u ON m.to_username = u.username
      WHERE u.username = $1 
    `,
			[username]
		);
		return result.rows;
	}
}

module.exports = User;
