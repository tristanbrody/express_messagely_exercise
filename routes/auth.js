const express = require('express');
const { SECRET_KEY } = require('../config');
const router = new express.Router();
const db = require('../db');
db.connect();
require('../config');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ExpressError = require('../expressError');

router.post('/login', async function (req, res, next) {
	try {
		const { username, password } = req.body;
		const loginSuccessful = await User.authenticate(username, password);
		if (loginSuccessful) {
			User.updateLoginTimestamp(username);
			const token = jwt.sign({ username }, SECRET_KEY);
			return res.json({ token });
		} else {
			throw new ExpressError('Invalid username or password', 400);
		}
	} catch (err) {
		return next(err);
	}
});

router.post('/register', async function (req, res, next) {
	try {
		let { username } = await User.register(req.body);
		const token = jwt.sign({ username }, SECRET_KEY);
		return res.json({ token });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
