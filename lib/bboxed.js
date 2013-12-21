
/**
 * Lexer
 */

tokens = {
  tag:  /\[(\/?)\s*(\w+)(?:\s*=\s*(?:['"](.+?)['"]|(\w+?)))?\s*\]/
, text: /.+/
}

function Lexer() {
  this.tokens = [];
}

Lexer.prototype.tokenise = function(input) {
	while (input) {
		if (match = tokens.tag.exec(input)) {
			input = input.substring(match[0].length);
			this.tokens.push({
			  type: 'tag'
			, tag: match[2]
			, closing: match[1] === '/'
			, argument: match[3] || match[4]
			});
			continue;
		}

		if (match = tokens.text.exec(input)) {
			input = input.substring(match[0].length);
			this.tokens.push({
			  type: 'text'
			, text: match[0]
			});
			continue;
		}
	}

	return this.tokens;
}

Lexer.tokenise = function(input) {
	return new Lexer().tokenise(input);
}

/**
 * Main function
 */

function bboxed(input) {

}

/**
 * Exports
 */

bboxed.Lexer = Lexer;

module.exports = bboxed;
