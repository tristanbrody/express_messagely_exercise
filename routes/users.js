const express = require('express');
require('../config');
const { User } = require('../models/user');
const db = require('../db');
const router = new express.Router();

router.get('/', async function (req, res, next) {
	try {
		const users = await User.all();
		return res.json(users);
	} catch (err) {
		return next(err);
	}
});

router.get('/:username', async function (req, res, next) {
	try {
		const username = req.params.username;
		const userDetails = await User.get(username);
		return res.json({ user: { userDetails } });
	} catch (err) {
		return next(err);
	}
});

router.get('/:username/to', async function (req, res, next) {
	try {
		const username = req.params.username;
		const toMessages = await User.messagesTo(username);
		return res.json({ messages: { toMessages } });
	} catch (err) {
		return next(err);
	}
});

router.get('/:username/from', async function (req, res, next) {
	try {
		const username = req.params.username;
		const fromMessages = await User.messagesFrom(username);
		return res.json({ messages: { fromMessages } });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
