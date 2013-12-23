
module.exports = {
	// Bold
	'b': {
		open: '<strong>',
		close: '</strong>'
	},

	// Italic
	'i': {
		open: '<em>',
		close: '</em>'
	},

	// Underline
	'u': {
		open: '<span style="text-decoration: underline;">',
		close: '</span>'
	},

	// Strike
	's': {
		open: '<span style="text-decoration: line-through;">',
		close: '</span>'
	},

	// Font size
	'size': {
		open: function(token, options) {
			var argument = token.arguments.tag;

			// No size passed, or invalid argument. Return unsuccessful.
			if (!argument || isNaN(argument)) {
				return false;
			}

			// Grab the size, constrain if required
			size = +argument;
			if (options.constrainSize) {
				size = Math.min(options.max, Math.max(options.min, size));
			}

			// Output
			var sizeValue = size.toString(10)+options.unit;
			return '<span style="font-size: '+sizeValue+';">';
		},
		close: '</span>',
		options: {
			constrainSize: true,
			min: 1,
			max: 72,
			unit: 'px'
		}
	},

	'color' : {
		open: function(token) {
			var argument = token.arguments.tag;
			if (!argument) {
				return false;
			}

			// To prevent nasty stuff
			argument = argument.replace('"', '');

			return '<span style="color: '+argument+';">'
		},
		close: '</span>'
	}
}
