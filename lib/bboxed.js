
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
			continue;
		}

		if (match = tokens.text.exec(input)) {
			input = input.substring(match[0].length);
			continue;
		}
	}

	return [];
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

bboxed.tokenise = Lexer.tokenise;

module.exports = bboxed;
