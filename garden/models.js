'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const GardenSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  planted: {
    type: Date
  },
  waterEvery: {
    type: Number,
    required: true
  },
  lastHarvested: {
    type: Date
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
    planted: this.planted || null,
    waterEvery: this.waterEvery,
    lastHarvested: this.lastHarvested || null,
    lastWatered: this.lastWatered || new Date()
  };
};

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = {Garden};
