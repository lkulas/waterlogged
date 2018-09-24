'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Garden} = require('./models');

const router = express.Router();

const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

//GET 

router.get('/gardens', jwtAuth, (req, res) => {
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

module.exports = {router};
