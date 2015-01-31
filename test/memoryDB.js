var assert = require('assert'),
  memoryDB = require('../lib/memoryDB');

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
