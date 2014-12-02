// memoryDB
// a quick and dirty in-memory datastore, good for testing

var memoryDB = function () {
  var db = {};
  
  // get & hgetall and set & hmset are the same for now, will change later
  return {
    get: function (key, cb) {
      var val = db[key] || null;
      cb && cb(null, val);
      return val;
    },
    set: function (key, val, cb) {
      db[key] = val;
      cb && cb(null);
      return val;
    },
    hgetall: function (key, cb) {
      var val = db[key] || null;
      cb && cb(null, val);
      return val;
    },
    hmset: function(key, val, cb) {
      db[key] = val;
      cb && cb(null);
      return val;
    }
  };
}

module.exports = memoryDB;