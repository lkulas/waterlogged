'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const GardenSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
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
  harvestEvery: {
    type: Number,
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
    planted: this.planted || '',
    waterEvery: this.waterEvery,
    harvestEvery: this.harvestEvery || '',
    lastHarvested: this.lastHarvested || '',
    lastWatered: this.lastWatered || ''
  };
};

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = {Garden};
