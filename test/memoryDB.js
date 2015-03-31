var assert = require('chai').assert,
  memoryDB = require('../lib/backends/memory-db');

describe('memoryDB', function () {
  var db;

  beforeEach(function () {
    db = memoryDB();
  });

  describe('set', function () {
    it('should properly set something to memoryDB', function () {
      db.set('somekey', 'somevalue', function (err) {
        db.get('somekey', function (err, data) {
          assert.equal(data, 'somevalue');
        });
      })
    });
  });

  describe('hmset', function () {
    it('should properly hmset something to memoryDB', function () {
      db.hmset('somekey', {foo: 'somevalue'}, function (err) {
        db.get('somekey', function (err, data) {
          assert.deepEqual(data, {foo: 'somevalue'});
        });
      })
    });

    it('should properly hmset reset something to memoryDB', function () {
      db.hmset('somekey', {foo: '1'}, function (err) {
        db.hmset('somekey', {foo: '2'}, function (err) {
          db.get('somekey', function (err, data) {
            assert.deepEqual(data, {foo: '2'});
          });
        });
      })
    });
  });
});
