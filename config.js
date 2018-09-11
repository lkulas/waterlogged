'use strict';
exports.DATABASE_URL = process.env.MONGODB_URI || 'mongodb://heroku_4w445fn2:37edr83v718vp0vbuhcuf1fg1n@ds151612.mlab.com:51612/heroku_4w445fn2';
exports.TEST_DATABASE_URL = process.env.MONGOLAB_BLACK_URI || 'mongodb://heroku_58v64c3h:895n4on9ok0nhb1ssruncrtmlq@ds151612.mlab.com:51612/heroku_58v64c3h';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';