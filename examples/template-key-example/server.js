var epsilonDelta = require('./../../'),
  express = require('express');

var app = express();

var limiter = epsilonDelta({
  userKey: 'limitkey-:connection.remoteAddress-:query.username',
  capacity: 10, // 10 requests
  expire: 1000 * 60 * 60 * 1, // 1 hour
  limitResponse: 'too many requests'
});
app.use(limiter);

app.get('/', function (req, res) {
  res.status(200).send('Hello world!');
});

app.listen(3000);