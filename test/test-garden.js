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

function generateGardenData() {
  return {
    username: _username,
    name: faker.random.word(),
    planted: faker.date.past(),
    waterEvery: faker.random.number(),
    lastWatered: faker.date.past(),
  };
};

function tearDownDb() {
  return mongoose.connection.dropDatabase();
};

describe('Protected endpoint', function () {
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
  });

  describe('/api/my-garden', function () {
    it('Should reject requests with no credentials', function () {
      return chai
        .request(app)
        .get('/api/my-garden')
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });

    it('Should reject requests with an invalid token', function () {
      const token = jwt.sign(
        {
          _username
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );
      return chai
        .request(app)
        .get('/api/my-garden')
        .set('Authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should reject requests with an expired token', function () {
      const token = jwt.sign(
        {
          user: {
            _username
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: _username
        }
      );
      return chai
        .request(app)
        .get('/api/my-garden')
        .set('authorization', `Bearer ${token}`)
        .then(() =>
          expect.fail(null, null, 'Request should not succeed')
        )
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
          expect(res).to.have.status(401);
        });
    });
    it('Should send protected data', function () {
      return chai
        .request(app)
        .get('/api/my-garden')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
        });
    });
  });
});
