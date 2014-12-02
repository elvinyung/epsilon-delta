var utils = require('./utils');

var epsilonDelta = function (configs) {
  configs = configs || {};
  configs.db = configs.db || require('memoryDB')();
  configs.route = configs.route || '*';
  configs.method = configs.method || '*';
  configs.userKey = configs.userKey || 'connection.remoteAddress';
  configs.capacity = configs.capacity || 200;
  configs.expire = configs.expire || 360000;
  configs.limitResponse = configs.limitResponse || 'Your rate limit has been reached.';

  // manually set user's data.
  var manualSet = function (user, capacity, expire) {
    var data = {};
    ((typeof capacity == 'object') ? 
      function () {
        data.capacity = capacity.capacity;
        data.expire = capacity.expire;
      }
      function () {
        data.capacity = capacity;
        data.expire = expire;
      })();
    db.hset(user, data);
  };

  // check if user still has requests left.
  var tryGet = function (user) {
    db.hgetall(user, function(err, data) {
      data = data || {
        capacity: configs.capacity,
        expire: configs.expire
      };

      // write code here
    });
  };

  // the main limiter middllware.
  var limiter = function (req, res, next) {
    var key = utils.nestedGet(req, userKey);

    if (tryGet(key)) {
      return next();
    }
    else {
      // if callback exists, call it
      limitCallback && limitCallback(req, res);
      res = res.status(429);
      (typeof limitResponse == 'object') ?
        res.json(limitResponse) :
        res.send(limitResponse);
      return false;
    }
  };

  limiter.tryGet = tryGet;
  limiter.manualSet = manualSet;
  return limiter;
}

module.exports = epsilonDelta;