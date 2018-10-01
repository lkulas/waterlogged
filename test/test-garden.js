'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const faker = require('faker');
const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { Garden } = require('../garden');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

const _username = 'exampleUser1';

const token = jwt.sign(
  {
    user: {
      _username
    }
  },
  JWT_SECRET,
  {
    algorithm: 'HS256',
    subject: _username,
    expiresIn: '7d'
  }
);

chai.use(chaiHttp);

function seedGardenData() {
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generateGardenData());
  };
  return Garden.insertMany(seedData);
};

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

function nextWater(data) {
    return addDays(data.lastWatered, data.waterEvery);
};

function generateGardenData() {
  let gardenData = {
    username: _username,
    name: faker.random.word(),
    planted: new Date(),
    waterEvery: faker.random.number(),
    lastWatered: new Date(),
  };
  gardenData.nextWater = nextWater(gardenData);
  return gardenData;
};

function tearDownDb() {
  return mongoose.connection.dropDatabase();
};

describe('Garden API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () {
    return seedGardenData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  describe('GET endpoint', function() {
    it('should return existing records for logged in user', function() {
      let res;
      return chai.request(app)
      .get('/api/my-garden/' + _username)
      .set('Authorization', `Bearer ${token}`)
      .then(function(_res) {
        res = _res;
        expect(res).to.have.status(200);
        expect(res.body).to.have.lengthOf.at.least(1);
        return Garden
          .find({ username: _username })
          .count();
      })
      .then(function(count) {
        expect(res.body).to.have.lengthOf(count);
      })
    });

    it('should return records with correct fields', function() {
      let resGarden;
      return chai.request(app)
        .get('/api/my-garden/' + _username)
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);
          res.body.forEach(function(garden) {
            expect(garden).to.be.a('object');
            expect(garden).to.include.keys(
              'username', 'id', 'name', 'waterEvery', 'lastWatered', 'planted', 'nextWater');
          });
          resGarden = res.body[0];
          return Garden.findById(resGarden.id);
        })
        .then(function(garden) {
          expect(resGarden.id).to.equal(garden.id);
          expect(resGarden.username).to.equal(garden.username);
          expect(resGarden.name).to.equal(garden.name);
          expect(resGarden.waterEvery).to.equal(garden.waterEvery);
          expect(resGarden.lastWatered).to.equal(garden.lastWatered.toDateString());
          expect(resGarden.planted).to.equal(garden.planted.toDateString());
          expect(resGarden.nextWater).to.equal(garden.nextWater.toDateString());
        });
    });
  });

  describe('POST endpoint', function() {
    it('should add a new record', function() {
      const newPlant = generateGardenData();
      return chai.request(app)
        .post('/api/my-garden/')
        .set('Authorization', `Bearer ${token}`)
        .send(newPlant)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'username', 'name', 'planted', 'waterEvery', 'lastWatered', 'nextWater');
          return Garden.findById(res.body.id);
        })
        .then(function(garden) {
          expect(garden.id).to.not.be.null;
          expect(garden.username).to.equal(newPlant.username);
          expect(garden.name).to.equal(newPlant.name);
          expect(garden.waterEvery).to.equal(newPlant.waterEvery);
        });
    });
  });

  describe('PUT endpoint', function() {
    it('should update a record with new fields', function() {
      const updateData = {
        waterEvery: 7,
        lastWatered: new Date("2018-09-30")
      };
      return Garden
        .findOne()
        .then(function(garden) {
          updateData.id = garden.id;
          return chai.request(app)
          .put(`/api/my-garden/${garden.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateData);
        })
        .then(function(res) {
          expect (res).to.have.status(204);
          return Garden.findById(updateData.id);
        })
        .then(function(garden) {
          expect(garden.waterEvery).to.equal(updateData.waterEvery);
          expect(garden.lastWatered.toDateString()).to.equal(updateData.lastWatered.toDateString());
        });
    });
  });
});
