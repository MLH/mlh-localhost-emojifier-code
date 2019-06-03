const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const mongoURL = 'mongodb://localhost:27017/emojifier';

module.exports = function saveFace(imageUrl, data) {
  MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, db) => {
    if (err) throw err;
    const dbo = db.db();
    // TODO: insert the object into the database
  });
};
