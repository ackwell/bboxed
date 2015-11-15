var should = require('should')
  , bboxed = require('../lib/bboxed');

describe('Parser', function() {
	describe('removeInvalidTags: true', function() {
		// To prevent spill-over into other tests
		var opts = {removeInvalidTags: true};

		it('removes stray closing tags', function() {
			bboxed('text[/b]', opts).should.equal('text');
		});

		it('removes unknown tags', function() {
			bboxed('[test]text[/test]', opts).should.equal('text');
		});

		it('removes tags with incorrect parameters/interior', function() {
			bboxed('[url]invalid[/url]', opts).should.equal('invalid');
			bboxed('[url=invalid]text[/url]', opts).should.equal('text');
		});
	});

	describe('noDefaultTags: true', function() {
		var opts = {noDefaultTags: true};

		it('does not include default tags', function() {
			bboxed('[b]text[/b]', opts).should.equal('[b]text[/b]');
		});

		it('does not impede on addTag', function() {
			bboxed.addTag('comment', {open: '<!--', close: '-->'});
			bboxed('[comment]text[/comment]', opts).should.equal('<!--text-->');
		});
	});
});
