var utils = require('./utils');

var epsilonDelta = function (configs) {
  configs = configs || {};
  configs.db = configs.db || require('./memoryDB')();
  configs.userKey = configs.userKey || 'connection.remoteAddress';
  configs.capacity = configs.capacity || 200;
  configs.expire = configs.expire || 360000;
  configs.autolimit = configs.autolimit || true;
  configs.limitResponse = configs.limitResponse || 'Your rate limit has been reached.';
  configs.limitHeader = configs.limitHeader || 'X-Rate-Limit-Limit';
  configs.remainingHeader = configs.remainingHeader || 'X-Rate-Limit-Remaining';
  configs.resetHeader = configs.resetHeader || 'X-Rate-Limit-Reset';

  var db = configs.db;

  // manually set user's data.
  function manualSet (userKey, capacity, expire) {
    var data = {};
    ((typeof capacity == 'object') ? 
      function () {
        capacity.capacity = capacity.capacity || configs.capacity;
        capacity.expire = capacity.expire || configs.expire;

        data.capacity = capacity.capacity;
        data.expire = capacity.expire;
      } :
      function () {
        capacity = capacity;

        data.capacity = capacity;
        data.expire = expire;
      })();
    db.hmset(userKey, data);
  };

  // check if user still has requests left.
  function rate (userKey, cb) {
    db.hgetall(userKey, function(err, data) {
      var now = Date.now();

      // default value the data
      data = data || {};
      data.capacity = data.capacity || configs.capacity;
      data.expire = data.expire || configs.expire;

      // refill bucket if should be refilled before now
      (data.expire <= now) && function(){
        data.capacity = configs.capacity;
        data.expire = now + configs.expire;
      }();

      // take one from bucket if user still has tokens
      (data.capacity > 0) && (data.capacity--);

      // write code here
      db.hmset(userKey, data);
      cb(null, data);
      return data;
    });
  };

  function compileKey(templ, req) {
    var render = "";
    var phrases = templ.split(/\s+/);
    phrases.forEach(function (phrase) {
      var varmatch = phrase.match(/:(.+)/);
      if (varmatch.length > 1) {
        render.push(utils.nestedGet(req, varmatch[1]));
      }
      else {
        render.push(concat(phrase))
      }
    });
    return render.join(' ');
  }

  // the main limiter middllware.
  function limiter (req, res, next) {
    var userKey = ((typeof configs.userKey == 'function') ?
      configs.userKey(req) :
      ((configs.userKey.indexOf(':') != -1) ? 
        compileKey(configs.userKey, req) :
        utils.nestedGet(req, configs.userKey)));

    rate(userKey, function (err, data) {
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
  limiter.manualSet = manualSet;
  return limiter;
}

module.exports = epsilonDelta;