var expect = require('chai').expect,
  epsilonDelta = require('../lib/limiter'),
  MockDate = require('mockdate');;

describe('limiter', function () {
  describe('rate', function () {
    it('should correctly rate limit a user', function (done) {
      var limiter = epsilonDelta({
        capacity: 10, // 100 requests
      });
      var username = 'someone';

      for (var a = 0; a < 10; a++) {
        limiter.rate(username);
      }

      limiter.rate(username, function (err, limitReached) {
        expect(limitReached).to.be.true;
        done();
      });
    });

    it('should correctly let non limit reached user through', function (done) {
      var limiter = epsilonDelta({
        capacity: 10, // 100 requests
      });
      var username = 'someone';

      for (var a = 0; a < 5; a++) {
        limiter.rate(username);
      }

      limiter.rate(username, function (err, limitReached) {
        expect(limitReached).to.be.false;
        done();
      });
    });

    it('should correctly refill bucket', function (done) {
      MockDate.set(10000);
      var limiter = epsilonDelta({
        capacity: 10, // 100 requests,
        expire: 10000 // 10 seconds
      });
      var username = 'someone';

      for (var a = 0; a < 10; a++) {
        limiter.rate(username);
      }
      
      limiter.rate(username, function (err, limitReached) {
        expect(limitReached).to.be.true;
      });

      MockDate.set(20001);
      limiter.rate(username, function (err, limitReached) {
        expect(limitReached).to.be.false;
        done();
      });
    });
  });

  describe('manualSet', function () {
    it('should correctly set user rate limit data when capacity is object', function (done) {
      var limiter = epsilonDelta({
        capacity: 10, // 100 requests
      });
      var username = 'someone';

      for (var a = 0; a < 10; a++) {
        limiter.rate(username);
      }

      limiter.manualSet(username, {
        capacity: 100
      });

      limiter.updateUser(username, function (err, data) {
        expect(data.capacity).to.equal(99);
        done();
      });
    });

    it('should correctly set user rate limit data when capacity is number', function (done) {
      var limiter = epsilonDelta({
        capacity: 10, // 100 requests
      });
      var username = 'someone';

      for (var a = 0; a < 10; a++) {
        limiter.rate(username);
      }

      limiter.manualSet(username, 100);

      limiter.updateUser(username, function (err, data) {
        expect(data.capacity).to.equal(99);
        done();
      });
    });

    it('should correctly set user rate limit data back to defaults if no args given', function (done) {
      var limiter = epsilonDelta({
        capacity: 10, // 100 requests
      });
      var username = 'someone';

      for (var a = 0; a < 5; a++) {
        limiter.rate(username);
      }

      limiter.manualSet(username);

      limiter.updateUser(username, function (err, data) {
        expect(data.capacity).to.equal(9);
        done();
      });
    });
  });
});