'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {Garden} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return Garden.find()
    .then(gardens => res.json(gardens.map(garden => garden.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
