'use strict';
exports.DATABASE_URL = process.env.MONGODB_URI || 'mongodb://localhost/gardens';
exports.TEST_DATABASE_URL = process.env.MONGOLAB_BLACK_URI || 'mongodb://localhost/gardens-test';
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';