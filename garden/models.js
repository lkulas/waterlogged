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
    type: Number
    required: true
  },
  nextWater: function() {
    return addDays(this.lastWatered, this.waterEvery)
  },
  harvestEvery: {
    type: Number,
  },
  nextHarvest: function() {
    return addDays(this.lastHarvested, this.harvestEvery)
  },
  lastHarvested: {
    type: Date
  },
  lastWatered: {
    type: Date
  }
});

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

GardenSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    planted: this.planted || '',
    waterEvery: this.waterEvery,
    nextWater: this.nextWater,
    harvestEvery: this.harvestEvery || '',
    nextHarvest: this.nextHarvest || '',
    lastHarvested: this.lastHarvested || '',
    lastWatered: this.lastWatered || ''
  };
};

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = {Garden};
