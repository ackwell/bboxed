var should = require('should')
  , bboxed = require('../lib/bboxed')

describe('bboxed', function() {
	describe('#tokenise', function() {
		// it('should return an empty array when an empty string is passed', function() {
		// 	bboxed.tokenise('')
		// 		.should.eql([]);
		// });

		// it('should split tag brackets', function() {
		// 	bboxed.tokenise('[tag]')
		// 		.should.eql(['[', 'tag', ']']);
		// });

		// it('should ignore empty brackets', function() {
		// 	bboxed.tokenise('text [] text')
		// 		.should.eql(['text [] text']);
		// });

		// it('should split closing slash as part of opening bracket', function() {
		// 	bboxed.tokenise('[tag][/tag]')
		// 		.should.eql(['[', 'tag', ']', '[/', 'tag', ']']);
		// });

		// it('should split tag arguments', function() {
		// 	bboxed.tokenise('[tag=argument]')
		// 		.should.eql(['[', 'tag', '=', 'argument', ']']);
		// });

		// it('should remove quotes enclosing arguments', function() {
		// 	bboxed.tokenise('[tag="multi word"]')
		// 		.should.eql(['[', 'tag', '=', 'multi word', ']']);
		// 	bboxed.tokenise('[tag=\'multi word\']')
		// 		.should.eql(['[', 'tag', '=', 'multi word', ']']);
		// });
	});
});