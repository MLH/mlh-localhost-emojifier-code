const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const request = require('request');

const MongoClient = require('mongodb').MongoClient;

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'emojifier';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}));

// When you sign up for the Face API, your region might be different. Be sure to replace eastus with the correct region.
const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect/';

// When you sign up for the Face API, you'll be given a subscription key. Paste that between the quotation marks below.
const subscriptionKey = '';

const port = 3000;

app.get('/', (req, res) => (
  res.send('This is the port for receiving images. Your app is running on localhost:4200 - check it out there!'))
);

app.post('/', (req, res) => {
  const { imageUrl } = req.body;

  const params = {
    'returnFaceAttributes': 'emotion'
  };

  const options = {
    url: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
  };
  request.post(options, (error, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(body);
    res.send(body);

    if(response.statusCode == "200"){
      MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.createCollection("faces");
        var myobjFace = { imageUrl: imageUrl, faceAttributes: JSON.stringify(body) };
        dbo.collection("faces").insertOne(myobjFace, function(err, res) {
            if (err) throw err;
            console.log("1 register inserted");
        });

        db.close();
      });
    }
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
