var should = require('should')
  , Lexer = require('../lib/bboxed').Lexer

describe('Lexer', function() {
	describe('.tokenise()', function() {
		it('return an empty array when an empty string is passed', function() {
			Lexer.tokenise('').should.eql([]);
		});

		it('handle single tags', function() {
			Lexer.tokenise('[tag]')[0].should.contain({
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			});
		});

		it('ignore empty brackets', function() {
			Lexer.tokenise('text [] text').should.eql([{
			  type: 'text'
			, text: 'text [] text'
			}]);
		});

		it('handle closing tags', function() {
			var result = Lexer.tokenise('[tag][/tag]');
			result[0].should.contain({
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			});
			result[1].should.contain({
			  type: 'tag'
			, tag: 'tag'
			, closing: true
			});
		});

		it('handles encapsulated text', function() {
			var result = Lexer.tokenise('[tag]text[/tag]');
			result[0].should.contain({
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			});
			result[1].should.contain({
			  type: 'text'
			, text: 'text'
			});
			result[2].should.contain({
			  type: 'tag'
			, tag: 'tag'
			, closing: true
			});
		});

		it('handle tag arguments', function() {
			Lexer.tokenise('[tag=argument]')[0].should.contain({
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			, argument: 'argument'
			});
		});

		it('handle quoted arguments', function() {
			var expect = {
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			, argument: 'multi word'
			};
			Lexer.tokenise('[tag="multi word"]')[0].should.contain(expect);
			Lexer.tokenise('[tag=\'multi word\']')[0].should.contain(expect);
		});
	});
});