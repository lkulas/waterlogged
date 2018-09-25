'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const GardenSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  planted: {
    type: Date,
    required: true
  },
  waterEvery: {
    type: Number,
    required: true
  },
  lastWatered: {
    type: Date
  }
});

GardenSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    planted: this.planted || new Date(),
    waterEvery: this.waterEvery,
    lastWatered: this.lastWatered
  };
};

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = {Garden};
