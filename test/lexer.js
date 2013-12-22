var should = require('should')
		Lexer = require('../lib/bboxed').Lexer

describe('Lexer', function() {
	describe('.tokenise()', function() {
		it('returns an empty array when an empty string is passed', function() {
			Lexer.tokenise('').should.eql([]);
		});

		it('handles single tags', function() {
			Lexer.tokenise('[tag]')[0].should.contain({
				type: 'tag',
				tag: 'tag',
				closing: false
			});
		});

		it('ignores empty brackets', function() {
			Lexer.tokenise('text [] text').should.eql([{
				type: 'text',
				text: 'text [] text'
			}]);
		});

		it('handles closing tags', function() {
			var result = Lexer.tokenise('[tag][/tag]');
			result[0].should.contain({
				type: 'tag',
				tag: 'tag',
				closing: false
			});
			result[1].should.contain({
				type: 'tag',
				tag: 'tag',
				closing: true
			});
		});

		it('handles encapsulated text', function() {
			var result = Lexer.tokenise('[tag]text[/tag]');
			result[0].should.contain({
				type: 'tag',
				tag: 'tag',
				closing: false
			});
			result[1].should.contain({
				type: 'text',
				text: 'text'
			});
			result[2].should.contain({
				type: 'tag',
				tag: 'tag',
				closing: true
			});
		});

		it('handles tag arguments', function() {
			Lexer.tokenise('[tag=argument]')[0].should.contain({
				type: 'tag',
				tag: 'tag',
				closing: false,
				argument: 'argument'
			});
		});

		it('handles quoted arguments', function() {
			var expect = {
				type: 'tag',
				tag: 'tag',
				closing: false,
				argument: 'multi word'
			};
			Lexer.tokenise('[tag="multi word"]')[0].should.contain(expect);
			Lexer.tokenise('[tag=\'multi word\']')[0].should.contain(expect);
		});

		it('handles nested tags', function() {
			var result = Lexer.tokenise('[outer][inner]text[/inner][/outer]');
			result[0].should.contain({
				tag: 'outer',
				closing: false
			});
			result[1].should.contain({
				tag: 'inner',
				closing: false
			});
			result[2].should.contain({
				type: 'text',
				text: 'text'
			});
			result[3].should.contain({
				tag: 'inner',
				closing: true
			});
			result[4].should.contain({
				tag: 'outer',
				closing: true
			});
		});
	});
});