var utils = require('./utils');

var epsilonDelta = function (configs) {
  configs = configs || {};

  var defaults = {
    db: require('./backends/memory-db')(),
    userKey: 'connection.remoteAddress',
    capacity: 200,
    expire: 360000,
    autolimit: true,
    limitResponse: 'Your rate limit has been reached.',
    limitHeader: 'X-Rate-Limit-Limit',
    remainingHeader: 'X-Rate-Limit-Remaining',
    resetHeader: 'X-Rate-Limit-Reset'
  };

  Object.keys(defaults).forEach(function (k) {
    configs[k] = configs[k] || defaults[k];
  });

  var db = configs.db;

  // manually set user's data.
  var manualSet = function manualSet (userKey, capacity, expire, cb) {
    if (typeof capacity === 'function') {
      cb = capacity;
      delete capacity;
    }
    else if (typeof expire === 'function') {
      cb = expire;
      delete expire;
    }

    var data = {};
    if (typeof expire === 'undefined' && typeof capacity === 'undefined') {
      capacity = configs.capacity;
      expire = configs.expire + Date.now();
    }
    else if (typeof expire === 'undefined') {
      expire = cb;
      if (typeof capacity === 'object') {
        expire = capacity.expire || configs.expire + Date.now();
        capacity = capacity.capacity || configs.capacity;
      }
      else {
        expire = configs.expire + Date.now();
      }
    }

    data = {
      capacity: capacity,
      expire: expire
    };

    db.hmset(userKey, data, function(err, reply) {
      cb && cb(err, err ? null : data);
    });
  };

  // general request update function
  var updateUser = function updateUser (userKey, cb) {
    db.hgetall(userKey, function (err, data) {
      var now = Date.now();

      // default value the data
      data = data || {};
      data.capacity = data.hasOwnProperty('capacity') ? 
        data.capacity : configs.capacity;
      data.expire = data.hasOwnProperty('expire') ? 
        data.expire : (configs.expire + Date.now());

      // refill bucket if should be refilled before now
      (data.expire <= now) && function(){
        data.capacity = configs.capacity;
        data.expire = now + configs.expire;
      }();

      // take one from bucket if user still has tokens
      (data.capacity > 0) && (data.capacity--);

      db.hmset(userKey, data, function(err, result) {
        cb && cb(err, err ? null : data);
      });
    });
  };

  var rate = function rate (userKey, cb) {
    updateUser(userKey, function (err, data) {
      var limitReached = data.capacity <= 0;
      cb && cb(err, limitReached);
    });
  };

  // the main limiter middleware.
  var limiter = function limiter (req, res, next) {
    var userKey = ((typeof configs.userKey == 'function') ?
      configs.userKey(req) :
      ((configs.userKey.indexOf(':') != -1) ? 
        utils.compileKey(configs.userKey, req) :
        utils.nestedGet(req, configs.userKey)));

    updateUser(userKey, function (err, data) {
      res.setHeader(configs.limitHeader, configs.capacity);
      res.setHeader(configs.remainingHeader, data.capacity);
      res.setHeader(configs.resetHeader, data.expire - Date.now());

      res.limitReached = false;
      ((configs.autolimit && parseInt(data.capacity) > 0) ? 
        next :
        function () {
          // if callback exists, call it
          res.limitReached = true;
          configs.limitCallback && configs.limitCallback(req, res);
          
          (typeof configs.limitResponse == 'object') &&
            res.set('Content-Type', 'application/json');
          res.status(429);
          res.end(JSON.stringify(configs.limitResponse));
        })();
    });
  };

  limiter.rate = rate;
  limiter.updateUser = updateUser;
  limiter.manualSet = manualSet;
  return limiter;
}

module.exports = epsilonDelta;