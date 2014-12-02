# epsilon-delta
## by [Elvin Yung](https://github.com/elvinyung)

Quick, pluggable token-bucket rate limiter middleware for Express and Connect.

### Quickstart

Sample express app that uses epsilon-delta without redis (don't try this on production, kids!):

```javascript
var epsilonDelta = require('epsilon-delta'),
  express = require('express');

var app = express();

var limiter = epsilonDelta({
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

```

### Configurations

When creating a limiter, the following configurations are available:

#### `db`
The [node-redis](https://www.npmjs.org/package/redis) client to be used. If you don't provide one, epsilon-delta will use a rudimentary in-memory store. 

#### `route`
The route the limiter operates on. By default, this is `*`.

#### `method`
The HTTP method the limiter operates on. By default, this is `*`.

#### `userKey`
The key used to identify individual users. By default this is `connection.remoteAddress`, the user's IP address.

#### `capacity`
The maximum number of requests in a user's bucket. By default, this is 200.

#### `expire`
The time in milliseconds, starting from the user's first request, before the user's token bucket is refilled. By default this is 3600000, or 1 hour.

#### `limitResponse`
The response body sent when the limit has been reached by the requesting user. This field can be either a string or an object, in which case it will be serialized to JSON.

#### `limitCallback`
A callback that will be called (with the request and response objects) when the limit has been reached by the requesting user. Note that if the callback sends a response, `limitResponse` won't be sent.

All configuration fields are optional.