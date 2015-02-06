// memoryDB
// a quick and dirty in-memory datastore, good for testing

var memoryDB = function () {
  var db = {};

  var get = function get (key, cb) {
    var val = db[key] || null;
    cb && cb(null, val);
    return val;
  }

  var set = function set (key, val, cb) {
    db[key] = val;
    cb && cb(null);
    return 0;
  }

  var hgetall = function hgetall (key, cb) {
    var val = db[key] || null;
    cb && cb(null, val);
    return val;
  }

  var hmset = function hmset (key, val, cb) {
    db[key] = val;
    cb && cb(null);
    return 0;
  }
  
  // get & hgetall and set & hmset are the same for now, will change later
  return {
    get: get,
    set: set,
    hgetall: hgetall,
    hmset: hmset
  };
}

module.exports = memoryDB;