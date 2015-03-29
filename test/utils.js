var assert = require('chai').assert,
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

    it('should be undefined for property that doesn\'t exist', function () {
      var obj = {};
      var key = 'a';

      assert.isUndefined(utils.nestedGet(obj, key));
    });

    it('should be undefined for nested property that doesn\'t exist', function () {
      var obj = {
        a: {
          b: {
            c: 'something'
          }
        }
      };
      var key = 'a.b.d';

      assert.isUndefined(utils.nestedGet(obj, key));
    });
  });

  describe('compileKey', function () {
    it('should properly compile a key template from context', function () {
      var obj = {
        lang: 'JavaScript',
        framework: 'Angular'
      };
      var template = 'my favorite language is :lang, and my favorite framework is :framework';

      assert.equal(utils.compileKey(template, obj), 
        'my favorite language is ' + obj.lang + ', and my favorite framework is ' + obj.framework);
    });

    it('should undefined for missing context keys', function () {
      var obj = {
        a: 'something'
      };
      var template = ':a is something, but :b is nothing';

      assert.equal(utils.compileKey(template, obj), 
        'something is something, but undefined is nothing');
    });
  });
});
