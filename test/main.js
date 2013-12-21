var should = require('should')
  , bboxer = require('../lib/bboxer')

describe('bboxer', function() {
	describe('#tokenise', function() {
		it('should return an empty array when an empty string is passed', function() {
			bboxer.tokenise('').should.equal([]);
		});
	});
});