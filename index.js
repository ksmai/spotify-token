const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const request = require('request');

const app = express();
app.use(compression());
app.use(helmet());
app.use(cors());

const { CLIENT_ID, CLIENT_SECRET } = process.env;
if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error('CLIENT_ID and/or CLIENT_SECRET is not set!');
}
const base64 = new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`)
  .toString('base64');
const Authorization = `Basic ${base64}`;
app.get('/token', (req, res) => {
  request(
    {
      url: 'https://accounts.spotify.com/api/token',
      method: 'POST',
      form: { grant_type: 'client_credentials' },
      headers: { Authorization },
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.append('Content-Type', response.headers['content-type']);
        res.send(body);
      } else {
        res.status(response.statusCode).json({ error: error || body });
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`spotify-token running on port ${PORT}`);
});
