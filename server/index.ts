const express = require('express');
const cors = require('cors');
const request = require('request');
const saveFace = require('./db');

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}));

app.use(express.static(__dirname + "/../dist/"));

const uriBase = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect/';
const subscriptionKey = 'dontstealmykeypls';

const port = 3000;

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

  // TODO: Send Request to Face API
  // TODO: Send Face API response to front-end
  // TODO: Save Face API response to database
});

app.listen(port, () => console.log(`Emojifier back-end listening on port ${port}!`));
