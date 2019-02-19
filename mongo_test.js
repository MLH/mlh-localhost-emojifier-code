const MongoClient = require('mongodb').MongoClient;

const dbName = 'emojifier';

MongoClient.connect("mongodb://localhost:27017/emojifier",  { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.createCollection("faces");
    var myobjFace = { imageUrl: "https://example.com", faceAttributes: "{'example': 'insert'}" };
    dbo.collection("faces").insertOne(myobjFace, function(err, res) {
        if (err) throw err;
        console.log(`Inserted object successfully!`);
    });

    db.close();
});
