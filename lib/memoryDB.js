// memoryDB
// a quick and dirty in-memory datastore, good for testing

var memoryDB = function () {
  var db = {};

  function get (key, cb) {
    var val = db[key] || null;
    cb && cb(null, val);
    return val;
  }

  function set (key, val, cb) {
    db[key] = val;
    cb && cb(null);
    return 0;
  }

  function hgetall (key, cb) {
    var val = db[key] || null;
    cb && cb(null, val);
    return val;
  }

  function hmset (key, val, cb) {
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