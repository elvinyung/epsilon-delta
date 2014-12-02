var epsilonDelta = require('./../../'),
  express = require('express');

var app = express();

var limiter = epsilonDelta({
  userKey: 'connection.remoteAddress', // identify users by IP
  capacity: 100, // 200 requests
  expire: 1000 * 60 * 60 * 1, // 1 hour
  limitResponse: {
    message: "Sorry! You're all out for now."
  }
});
app.use(limiter.middleware);

app.get('/', function (req, res) {
  res.send(200, 'Hello world!');
});