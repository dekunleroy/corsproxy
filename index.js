const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const logger = require('morgan');

const app = express();
dotenv.config({ path: './.env' });
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb ' }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Headers', '*');
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.post('/search', (req, res) => {
  console.log(`req.body`, req.body);
  const { input } = req.body;
  fetch(`https://api.deezer.com/search?q=${input}`, {
    method: 'GET',
    mode: 'no-cors',
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json, text/plain, */*',
    Authorization: 'Bearer e9d874c859b7133d36df9b5bcd38512d',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log({ data });
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(`err`, err);
      res.status(500).send(err);
    });
});

app.get('/tracks', (req, res) => {
  fetch('https://api.deezer.com/chart/0/tracks&limit=24', {
    method: 'GET',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer e9d874c859b7133d36df9b5bcd38512d',
  })
    .then((response) => response.json())
    .then((data) => {
      console.log({ data });
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(`err`, err);
      res.status(500).send(err);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`app running on port ${PORT}`));
