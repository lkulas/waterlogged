'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Garden} = require('./models');

const router = express.Router();

const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

//GET - getting all records
router.get('/', jsonParser, jwtAuth, (req, res) => {
	Garden
		.find()
		.then(gardens => {
			res.status(200).json(gardens.map(garden => garden.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: "Something went wrong"});
		});
});

// GET - for specific user
router.get('/:username', jsonParser, jwtAuth, (req, res) => {
	Garden
		.find({ username: req.params.username })
		.then(gardens => {
			res.status(200).json(gardens.map(garden => garden.serialize()));
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({error: "Something went wrong"});
		});
});

// POST
router.post('/', jsonParser, jwtAuth, (req, res) => {
	const requiredFields = ['name', 'username', 'waterEvery'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	Garden
		.create({
			username: req.body.username,
			planted: new Date(),
			name: req.body.name,
			waterEvery: req.body.waterEvery,
			lastWatered: new Date()
		})
		.then(Garden => res.status(201).json(Garden.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({error: 'Internal server error'});
		});
});

// PUT
router.put('/:id', jsonParser, jwtAuth, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		res.status(400).json({
			error: 'Request path id and request body id must match'
		});
	}
	const updated = {};
	const updateableFields = ['waterEvery', 'lastWatered', 'nextWater'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}
	});
	Garden
		.findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
		.then(updatedPlant => res.status(204).end())
		.catch(err => res.status(500).json({error: 'Internal server error'}));
});

// DELETE
router.delete('/:id', jwtAuth, (req, res) => {
	Garden
		.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end();
		})
		.catch(err => res.status(500).json({error: 'Internal server error'}));
});

module.exports = {router};
