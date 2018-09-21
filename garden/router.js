'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Garden} = require('./models');

const router = express.Router();

const passport = require('passport');

const jwtAuth = passport.authenticate('jwt', { session: false });

const jsonParser = bodyParser.json();

module.exports = {router};
