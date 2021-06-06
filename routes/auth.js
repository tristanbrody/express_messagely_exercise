const express = require('express');
const { SECRET_KEY } = require('../config');
const router = new express.Router();
const db = require('../db');
require('../config');
const { User } = require('../models/users');

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
		const { username, password, first_name, last_name, phone } = req.body;
		await User.register(username, password, first_name, last_name, phone);
		const token = jwt.sign({ username }, SECRET_KEY);
		return res.json({ token });
	} catch (err) {
		return next(err);
	}
});
