var epsilonDelta = require('./../../'),
  express = require('express');

var app = express();

var limiter = epsilonDelta({
  userKey: function (req) {
  	return req.query.username || 'Anonymous';
  },
  capacity: 10, // 10 requests
  expire: 1000 * 60 * 60 * 1, // 1 hour
  limitResponse: {
    message: "NOPE"
  }
});
app.use(limiter);

app.get('/', function (req, res) {
  res.status(200).send('YEP');
});

app.listen(3000);