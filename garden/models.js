'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const GardenSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

GardenSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = {Garden};
