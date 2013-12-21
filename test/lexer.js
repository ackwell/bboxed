var should = require('should')
  , Lexer = require('../lib/bboxed').Lexer

describe('Lexer', function() {
	describe('.tokenise()', function() {
		it('return an empty array when an empty string is passed', function() {
			Lexer.tokenise('').should.eql([]);
		});

		it('handle single tags', function() {
			Lexer.tokenise('[tag]').should.eql([{
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			, argument: undefined
			}]);
		});

		it('ignore empty brackets', function() {
			Lexer.tokenise('text [] text').should.eql([{
			  type: 'text'
			, text: 'text [] text'
			}]);
		});

		it('handle closing tags', function() {
			Lexer.tokenise('[tag][/tag]').should.eql([{
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			, argument: undefined
			}, {
			  type: 'tag'
			, tag: 'tag'
			, closing: true
			, argument: undefined
			}]);
		});

		it('handles encapsulated text', function() {
			Lexer.tokenise('[tag]text[/tag]').should.eql([{
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			, argument: undefined
			}, {
			  type: 'text'
			, text: 'text'
			}, {
			  type: 'tag'
			, tag: 'tag'
			, closing: true
			, argument: undefined
			}]);
		});

		it('handle tag arguments', function() {
			Lexer.tokenise('[tag=argument]').should.eql([{
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			, argument: 'argument'
			}]);
		});

		it('handle quoted arguments', function() {
			var expect = [{
			  type: 'tag'
			, tag: 'tag'
			, closing: false
			, argument: 'multi word'
			}];
			Lexer.tokenise('[tag="multi word"]').should.eql(expect);
			Lexer.tokenise('[tag=\'multi word\']').should.eql(expect);
		});
	});
});