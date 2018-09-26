'use strict';

const mongoose = require('mongoose');

const options = { weekday: 'long', month: 'long', day: 'numeric' };

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
  },
  waterEvery: {
    type: Number,
    required: true
  },
  lastWatered: {
    type: Date
  },
  nextWater: {
    type: Date,
  }
});

GardenSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    name: this.name,
    planted: this.planted,
    waterEvery: this.waterEvery,
    lastWatered: this.lastWatered,
    nextWater: nextWater(this)
  };
};

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function nextWater(data) {
    return addDays(data.lastWatered, data.waterEvery).toLocaleString('en-US', options);
};

const Garden = mongoose.model('Garden', GardenSchema);

module.exports = {Garden};
