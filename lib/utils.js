
// function to get values from an object.
// e.g. getKey({a: {b: {c: 5}}}, 'a.b.c') == 5
function nestedGet (obj, key) {
  key = key.split('.');
  return key.reduce(function (obj, key) {
    return obj[key];
  }, obj);
}

// a simple templating engine for key
function compileKey (templ, ctx) {
  return templ
    .match(/:[\w\.]+/g)
    .reduce(function (acc, key) {
      return acc.replace(
        new RegExp(key, 'g'), 
        nestedGet(ctx, key.slice(1))
      );
    }, templ);
}

module.exports = {
  nestedGet: nestedGet,
  compileKey: compileKey
};