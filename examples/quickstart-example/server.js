var epsilonDelta = require('./../../'),
  express = require('express');

var app = express();

var limiter = epsilonDelta({
  userKey: 'connection.remoteAddress', // identify users by IP
  capacity: 10, // 200 requests
  expire: 1000 * 60 * 60 * 1, // 1 hour
  limitResponse: {
    message: "Sorry! You're all out for now."
  }
});
app.use(limiter);

app.get('/', function (req, res) {
  res.status(200).send('Hello world!');
});

app.listen(3000);