var assert = require('assert'),
  epsilonDelta = require('../lib/limiter');

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
        assert.equal(limitReached, true);
        done();
      });
    });
  });
});