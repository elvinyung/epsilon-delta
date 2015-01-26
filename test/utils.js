var assert = require('assert'),
  utils = require('../lib/utils');

describe('utils', function () {
  describe('nestedGet', function () {
    it('should properly return a nested property', function () {
      var obj = {
        a: {
          b: {
            c: 'something'
          }
        }
      };
      var key = 'a.b.c';
      var value = 'something';

      assert.equal(utils.nestedGet(obj, key), value);
    });
  });
});
