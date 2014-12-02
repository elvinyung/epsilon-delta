
// function to get values from an object.
// e.g. getKey({a: {b: {c: 5}}}, 'a.b.c') == 5
var nestedGet = function (obj, key) {
  key = key.split('.');
  return key.reduce(function (obj, key) {
    return obj[key];
  }, obj);
};

module.exports = {
  nestedGet: nestedGet
};