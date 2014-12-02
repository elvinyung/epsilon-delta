var utils = require('./utils');

var epsilonDelta = function (configs) {
  configs = configs || {};
  configs.db = configs.db || require('./memoryDB')();
  configs.userKey = configs.userKey || 'connection.remoteAddress';
  configs.capacity = configs.capacity || 200;
  configs.expire = configs.expire || 360000;
  configs.limitResponse = configs.limitResponse || 'Your rate limit has been reached.';

  var db = configs.db;

  // manually set user's data.
  var manualSet = function (user, capacity, expire) {
    var data = {};
    ((typeof capacity == 'object') ? 
      function () {
        data.capacity = capacity.capacity;
        data.expire = capacity.expire;
      } :
      function () {
        data.capacity = capacity;
        data.expire = expire;
      })();
    db.hmset(user, data);
  };

  // check if user still has requests left.
  var rate = function (user, cb) {
    db.hgetall(user, function(err, data) {
      var now = Date.now();
      data = data || {
        capacity: configs.capacity,
        expire: now + configs.expire
      };

      // refill bucket if should be refilled before now
      (data.expire < now) && function(){
        data.capacity = configs.capacity;
        data.expire = now + configs.expire;
      }();

      // take one from bucket if user still has tokens
      (data.capacity > 0) && function(){
        data.capacity -= 1;
      }();

      // write code here
      db.hmset(user, data);
      cb(null, data);
      return data;
    });
  };

  // the main limiter middllware.
  var limiter = function (req, res, next) {
    var key = utils.nestedGet(req, configs.userKey);

    rate(key, function(err, data){
      res.set({
          'X-Rate-Limit-Limit': configs.capacity,
          'X-Rate-Limit-Remaining': data.capacity,
          'X-Rate-Limit-Reset': data.expire - Date.now()
        });

      if (data.capacity)
      {
        next();
      }
      else {
        // if callback exists, call it
        configs.limitCallback && config.limitCallback(req, res);
        
        (typeof configs.limitResponse == 'object') &&
          res.set('Content-Type', 'application/json');
        res.status(429);
        res.end(JSON.stringify(configs.limitResponse));
      }
    });
  };

  limiter.tryGet = rate;
  limiter.manualSet = manualSet;
  return limiter;
}

module.exports = epsilonDelta;