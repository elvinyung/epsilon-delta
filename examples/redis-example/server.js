var epsilonDelta = require('./../../'),
  express = require('express'),
  redis = require('redis');

var app = express();

var limiter = epsilonDelta({
	db: redis.createClient(),
  userKey: 'connection.remoteAddress', // identify users by IP
  capacity: 10, // 10 requests
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