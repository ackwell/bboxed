
/**
 * Lexer
 */

var tokens = {
  tag:  /^\[(\/?)\s*(\w+)(?:\s*=\s*(?:['"](.+?)['"]|(\w+?)))?\s*\]/
, text: /^(?:\[]|[^[])+/
}

function Lexer() {}

Lexer.tokenise = function(input) {
	var result = [];

	while (input) {
		if (match = tokens.tag.exec(input)) {
			input = input.substring(match[0].length);
			result.push({
			  type: 'tag'
			, tag: match[2].toLowerCase()
			, closing: match[1] === '/'
			, argument: match[3] || match[4]
			, text: match[0]
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

var defaultTagOptions = {
  hasCloseTag: true
, allowInnerTags: true
}

function Parser(tags) {
	this.tags = tags;
	this.currentPosition = 0
	this.tokens = [];
}

Parser.prototype.parse = function(tokens) {
	this.tokens = tokens;
	return this.parseGroup();
}

Parser.prototype.parseGroup = function(endTag) {
	var token
	  , result = '';

	while (token = this.peek()) {
		this.next();

		// It's a text tag, parse and continue
		if (token.type == 'text') {
			result += token.text;
			continue;
		}

		// If a group end has been requested, and we reach it, exit the function
		if (token.tag == endTag && token.closing) {
			return result;
		}

		// If it's a stray closing tag, or a tag we don't understand, treat as text
		var tag = this.tags[token.tag];
		if (token.closing || !tag) {
			result += token.text;
			continue;
		}

		// Merge default settings in
		tag = merge(defaultTagOptions, tag);

		// Ok, so it's a opening tag that exists. Parse accodingly
		if (tag.hasCloseTag) {
			var startPosition = this.currentPosition
			  , interior = this.parseGroup(token.tag);

			// Interior group failed (unclosed tag), roll back treat as text instead
			if (!interior) {
				this.currentPosition = startPosition;
				result += token.text;
				continue;
			}

			// Interior group must have succeeded.
			result += tag.open + interior + tag.close;

			continue;
		} else {
			continue;
		}
	}

	// If the loop expired, but we were looking for an endTag, return unsuccessful
	if (endTag) {
		return false;
	}

	return result;
}

// Utility functions
Parser.prototype.end = function() {
	return this._currentPosition == this.tokens.length;
}

Parser.prototype.peek = function() {
	return this.end()? null : this.tokens[this.currentPosition];
}

Parser.prototype.next = function() {
	if (!this.end()) {
		this.currentPosition++;
	}
}

Parser.prototype.goTo = function(position) {
	this.currentPosition = position;
}

// 

/**
 * Util
 */
function merge(obj) {
	var i = 1
	  , target
	  , key;

	for (; i < arguments.length; i++) {
		target = arguments[i];
		for (key in target) {
			if (Object.prototype.hasOwnProperty.call(target, key)) {
				obj[key] = target[key];
			}
		}
	}

	return obj;
}

/**
 * Main function
 */

function bboxed(input) {
	var tokens = Lexer.tokenise(input)
	  , parser = new Parser(bboxed.tags)
	  , output = parser.parse(tokens);

	return output;
}

bboxed.tags = require('./tags')

/**
 * Exports
 */

bboxed.Lexer = Lexer;
bboxed.Parser = Parser;

module.exports = bboxed;
