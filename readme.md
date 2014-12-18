# epsilon-delta
## by [Elvin Yung](https://github.com/elvinyung)

Quick, pluggable token-bucket rate limiter middleware for Express and Connect.

### Quickstart

Install [from NPM](https://www.npmjs.org/package/epsilon-delta):

    npm install epsilon-delta

Sample express app that uses epsilon-delta without redis (don't try this on production, kids!):

```javascript
var epsilonDelta = require('epsilon-delta'),
  express = require('express');

var app = express();

var limiter = epsilonDelta({
  userKey: 'connection.remoteAddress', // identify users by IP
  capacity: 100, // 100 requests
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
```

### Configurations

When creating a limiter, the following configurations are available:

#### `db`
The [node-redis](https://www.npmjs.org/package/redis) client to be used. If you don't provide one, epsilon-delta will use a rudimentary in-memory store. 

#### `userKey`
The key used to identify individual users. By default this is the string `connection.remoteAddress`, the user's IP address. 

You can also supply a function that takes a request parameter. If you do, epsilon-delta will call that function, passing in the request object, and use the return value as the user key.

#### `capacity`
The maximum number of requests in a user's bucket. By default, this is 200.

#### `expire`
The time in milliseconds, starting from the user's first request, before the user's token bucket is refilled. By default this is 3600000, or 1 hour.

#### `limitResponse`
The response body sent when the limit has been reached by the requesting user. This field can be either a string or an object, in which case it will be serialized to JSON.

#### `limitCallback`
A callback that will be called (with the request and response objects) when the limit has been reached by the requesting user. Note that if the callback sends a response, `limitResponse` won't be sent.

#### `limitHeader`
The name of the header that will contain the rate limit. Defaults to `X-Rate-Limit-Limit`.

#### `remainingHeader`
The name of the header that will contain the remaining request quota. Defaults to `X-Rate-Limit-Remaining`.

#### `resetHeader`
The name of the header that will contain the time left, in milliseconds, until the rate limiter resets. Defaults t `X-Rate-Limit-Reset`.

All configuration fields are optional.

### Using the Limiter
The limiter returns a middleware function compatible with Express and Connect. In addition, the following methods are provided for a given `limiter`:

#### `limiter.rate(userKey, callback)`
Gets information regarding the limiter for the given `userKey`, passing it to `callback`. 

#### `limiter.manualSet(userKey[, capacity, expire])`
Sets the limiter numbers for the given `userKey` so that its bucket has the given `capacity` and it refills at `expire`.

#### `limiter.manualSet(userKey, data)`
Sets the limiter numbers for the given `userKey` according to `data`.