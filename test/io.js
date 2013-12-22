
var fs = require('fs')
	, path = require('path')
  , bboxed = require('../lib/bboxed');

describe('io', function() {
	// Get list of files
	var dir = __dirname + '/io'
	  , files;

	files = fs
		.readdirSync(dir)
		.filter(function(file) {
			return path.extname(file) == '.bbcode';
		})
		.sort(function(a, b) {
			a = path.basename(a).toLowerCase().charCodeAt(0);
			b = path.basename(b).toLowerCase().charCodeAt(0);
			return a > b? 1 : (a < b? -1 : 0);
		});

	for (var i = 0; i < files.length; i++) {
		(function(file) {
			var file = path.join(dir, file)
				, bbcode = fs.readFileSync(file, 'utf8')
				, html = fs.readFileSync(file.replace(/\..+$/, '') + '.html', 'utf8');

			it(files[i].replace(/\..+$/,''), function() {
				bboxed(bbcode).should.equal(html);
			});
		})(files[i]);
	}
});