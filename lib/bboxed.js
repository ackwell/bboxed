
/**
 * Lexer
 */

var tokens = {
	tag:  /^\[(\/?)\s*(\[?\w+|\*|#)(?:\s*=\s*(?:(['"])(.+?)\3|([^\]'" ]+)))?\s*([^\]]+?)?\]/,
	argument: /^(\w+)\s*=\s*(?:(['"])(.+?)\2|([^\]'" ]+))/,
	text: /^(?:\[]|[^[])+/,
	listBlock:  /^\[(\*|#)].*(($\r\n?|\n^)\[\1].*)*/m
}

// In case I ever need to expand the lexer with other stuff.
function Lexer() {}

Lexer.tokenise = function(input) {
	var result = []
		, match
		, argmatch
	  , token
		, block;

	var insideList = false;
	while (input) {
		if (match = tokens.tag.exec(input)) {

			//Handle the special case [*] and [#] list tag
			//-----------------------------------
			//We need to detect if we are at dealing with a list
			//If so jump ahead of the parser and add closing tags for [*] and [#]
			//as well as wrapping the entire block in a [ulist] or [olist] tag
			//Then the parser will handle list normally
			
			if ((block = tokens.listBlock.exec(input)) && insideList === false) {
				insideList = true; //only jump ahead and replace if we aren't currently parsing in a list
				var blockLength = block[0].length;
				var list = block[0].split(/\r\n?|\n/); //handle both Windows and Unix line breaks
				for ( var i = 0; i < list.length; i++ ) {
    			list[i] = list[i] + '[/' + match[2] + ']';
				}
				var listType = 'u';
				if (match[2] === '#') {
					listType = 'o'
				}
				list.unshift('[' + listType +'list]');
				list.push('[/' + listType + 'list]');
				input = list.join('') + input.substr(blockLength);
				match = tokens.tag.exec(input);
			}
			if (match[0] === '[/ulist]' | match[0] === '[/olist]') //the parser has reached end of a list block
				{
					insideList = false;
				}
			input = input.substring(match[0].length);
			token = {
				type: 'tag',
				tag: match[2].toLowerCase(),
				closing: match[1] === '/',
				arguments: {tag: match[4] || match[5]},
				text: match[0]
			}
			while (match[6]) {
				if (argmatch = tokens.argument.exec(match[6])) {
					match[6] = match[6].substring(argmatch[0].length);
					token.arguments[argmatch[1]] = argmatch[3] || argmatch[4];
					continue;
				}

				match[6] = match[6].substring(1);
			}
			result.push(token);
			continue;
		}

		if (match = tokens.text.exec(input)) {
			input = input.substring(match[0].length);
			result.push({
				type: 'text',
				text: match[0]
			});
			continue;
		}

		// No matches found, chop a single character off and try again
		var text = input.substring(0, 1)
		  , input = input.substring(1);
		result.push({
			type: 'text',
			text: text
		});
	}

	return result;
}

/**
 * Parser
 */

var defaultTagOptions = {
	hasCloseTag: true,
	allowInnerTags: true,
	options: {}
}

function Parser(tags, options) {
	this.tags = tags;
	this.options = options;
	this.currentPosition = 0
	this.tokens = [];
}

Parser.prototype.parse = function(tokens) {
	this.tokens = tokens;
	return this.parseGroup();
}

Parser.prototype.parseGroup = function(endTag, treatAllAsText) {
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

		// If the function has been told to parse all as text, do so
		var tag = this.tags[token.tag];
		if (treatAllAsText) {
			result += token.text;
			continue;
		}

		// If it's a stray closing tag, or a tag we don't understand, parse as invalid.
		if (token.closing || !tag) {
			result += this.parseInvalidTag(token, tag);
			continue;
		}

		// Merge default settings in
		tag = merge(defaultTagOptions, tag);

		// Ok, so it's a opening tag that exists. Parse accodingly
		if (tag.hasCloseTag) {
			result += this.parseClosedTag(token, tag);
			continue;
		} else {
			result += this.parseSingleTag(token, tag);
			continue;
		}
	}

	// If the loop expired, but we were looking for an endTag, return unsuccessful
	if (endTag) {
		return false;
	}

	return result;
}

Parser.prototype.parseClosedTag = function(token, tag) {
	var startPosition = this.currentPosition
	  , open = tag.open
	  , interior = this.parseGroup(token.tag, !tag.allowInnerTags)
	  , close = tag.close
	  , options = tag.options;

	if (this.options.tags.hasOwnProperty(token.tag)) {
		options = merge(options, this.options.tags[token.tag]);
	}

	// Add the interior into the token so the functions can use it
	token.interior = interior;

	if (typeof open == 'function') { open = open(token, options); }
	if (typeof close == 'function') { close = close(token, options); }

	// Interior group failed (unclosed tag), or open/close failed.
	// Roll back and treat as text instead
	if ((!open && typeof open != 'string') || !interior || (!close && typeof open != 'string')) {
		this.currentPosition = startPosition;
		return this.parseInvalidTag(token, tag);
	}

	// Interior group must have succeeded.
	return open + interior + close;
}

Parser.prototype.parseSingleTag = function(token, tag) {
	var startPosition = this.currentPosition
	  , tag = tag.tag || tag.open
	  , options = tag.options;

	if (this.options.tags.hasOwnProperty(token.tag)) {
		options = merge(options, this.options.tags[token.tag]);
	}

	if (typeof tag == 'function') { tag = tag(token, options); }

	if ((!tag && typeof tag != 'string')) {
		this.currentPosition = startPosition;
		return this.parseInvalidTag(token, tag);
	}

	// Interior group must have succeeded.
	return tag;
}

Parser.prototype.parseInvalidTag = function(token, tag) {
	return this.options.removeInvalidTags? '' : token.text;
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

Parser.parse = function(tokens, tags, options) {
	var parser = new Parser(tags, options);
	return parser.parse(tokens);
}

/**
 * Util
 */
function merge() {
	var i = 0
	  , target
	  , key
	  , obj = {};

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

function bboxed(input, options, callback) {
	var tokens = Lexer.tokenise(input);

	if (callback || typeof options == 'function') {
		if (!callback) {
			callback = options;
			options = {};
		}

		options = merge(bboxed.options, options);

		var done = function() {
			var out, error;
			try { out = Parser.parse(tokens, bboxed.tags, options); }
			catch (e) { error = e; }
			return error? callback(error) : callback(null, out);
		};
		return done();
	}

	return Parser.parse(tokens, bboxed.tags, merge(bboxed.options, options));
}

/**
 * Tags
 */

bboxed.tags = require('./tags');

bboxed.addTag =
bboxed.addTags = function(tagName, tag) {
	if (typeof tagName == 'object') {
		bboxed.tags = merge(bboxed.tags, tagName);
	} else {
		bboxed.tags[tagName] = tag;
	}
}

/**
 * Options
 */

bboxed.options = {
	tags: {},
	removeInvalidTags: false
};

bboxed.setOption =
bboxed.setOptions = function(key, value) {
	if (typeof key == 'object') {
		bboxed.options = merge(bboxed.options, value);
	} else {
		bboxed.options[key] = value;
	}
};

bboxed.setTagOption =
bboxed.setTagOptions = function(tagName, key, value) {
	var tags = bboxed.options.tags;
	if (!tags.hasOwnProperty(tagName)) {
		tags[tagName] = {};
	}

	if (typeof key == 'object') {
		tags[tagName] = merge(tags[tagName], key);
	} else {
		tags[tagName][key] = value;
	}
};

/**
 * Exports
 */

bboxed.Lexer = Lexer;
bboxed.Parser = Parser;

module.exports = bboxed;
