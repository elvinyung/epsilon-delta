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
});
