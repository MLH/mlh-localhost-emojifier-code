const express = require('express')
const cors = require('cors')
const mongodb = require('mongodb')
const request = require('request')

const MongoClient = require('mongodb').MongoClient

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'emojifier';

const app = express()
app.use(express.json())
app.use(cors({
  origin: '*',
}))

// When you sign up for the Face API, your region might be different. Be sure to replace eastus with the correct region.
const uriBase = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect/';

// When you sign up for the Face API, you'll be given a subscription key. Paste that between the quotation marks below.
const subscriptionKey = '';

const port = process.env.PORT || 3000

app.get('/', (req, res) => (res.send('Your app is running on localhost:4200 - check it out there!')))


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
