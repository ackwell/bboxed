
/**
 * Lexer
 */

tokens = {
  tag:  /\[(\/?)\s*(\w+)(?:\s*=\s*(?:['"](.+?)['"]|(\w+?)))?\s*\]/
, text: /.+/
}

function Lexer() {}

Lexer.tokenise = function(input) {
	var result = [];

	while (input) {
		if (match = tokens.tag.exec(input)) {
			input = input.substring(match[0].length);
			result.push({
			  type: 'tag'
			, tag: match[2]
			, closing: match[1] === '/'
			, argument: match[3] || match[4]
			});
			continue;
		}

		if (match = tokens.text.exec(input)) {
			input = input.substring(match[0].length);
			result.push({
			  type: 'text'
			, text: match[0]
			});
			continue;
		}
	}

	return result;
}

/**
 * Parser
 */

function Parser() {

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
