const express = require('express');
const { SECRET_KEY } = require('../config');
const router = new express.Router();
const db = require('../db');
require('../config');
const { Message } = require('../models/messages');

router.get('/:id', async function (req, res, next) {
	try {
		const id = req.params.id;
		let username = req.user.username;
		const message = await Message.get(id);
		if (![message.from_user, message.to_user].includes(username)) {
			throw new ExpressError(`You don't have access to this message`, 400);
		} else {
			return res.json({
				response: {
					message
				}
			});
		}
	} catch (err) {
		return next(err);
	}
});

router.post('/', async function (req, res, next) {
	try {
		const { to_username, body, sent_at } = req.body;
		const from_username = req.user.username;
		const message = await Message.create({ from_username, to_username, body, sent_at });
		return res.json({
			response: { message }
		});
	} catch (err) {
		return next(err);
	}
});

router.post('/:id/read', async function (req, res, next) {
	try {
		const id = req.params.id;
		const message = await Message.get(id);
		if (message.to_username !== req.user.username) {
			throw new ExpressError(`You aren't authorized to read this message`, 400);
		}
		const readMessage = await Message.markRead(id);
		return res.json({
			response: { readMessage }
		});
	} catch (err) {
		return next(err);
	}
});
