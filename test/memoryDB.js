var expect = require('chai').expect,
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
          expect(data).to.equal('somevalue');
        });
      })
    });
  });

  describe('hmset', function () {
    it('should properly hmset something to memoryDB', function () {
      db.hmset('somekey', {foo: 'somevalue'}, function (err) {
        db.get('somekey', function (err, data) {
          expect(data).to.deep.equal({foo: 'somevalue'});
        });
      })
    });

    it('should properly hmset reset something to memoryDB', function () {
      db.hmset('somekey', {foo: '1'}, function (err) {
        db.hmset('somekey', {foo: '2'}, function (err) {
          db.get('somekey', function (err, data) {
            expect(data).to.deep.equal({foo: '2'});
          });
        });
      })
    });
  });
});
