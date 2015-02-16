# [bboxed] [![Build Status](https://travis-ci.org/ackwell/bboxed.png?branch=master)](https://travis-ci.org/ackwell/bboxed) [![NPM version](https://badge.fury.io/js/bboxed.png)](http://badge.fury.io/js/bboxed)

An extensible `[bbcode]` parser for node.js. (And other platforms once it's running nicely)

Hat tips to [marked](https://github.com/chjj/marked/), from which I've borrowed a few ideas.

## Installing

**Warning:** Though most of the module is complete, there are sections that remain
incomplete, and may result in breaking changes. It should be stable, but I'd suggest pinpointing the version pretty precisely in your package.json.

```sh
$ npm install bboxed
```

## Using

If you like things to Just Work™:

```js
console.log(bboxed('Bboxing [i]Bbcode[/i]'));
// Output: Bboxing <em>Bbcode</em>
```
### Options

For a list of all avaliable options, check [this wiki page](https://github.com/ackwell/bboxed/wiki/Options).

#### Parser

Parsing options can be set with `.setOption(s)`, or can be passed to the `bboxed` function.

```js
// All three examples do the same thing
bboxed.setOption('key', 'value');
bboxed('Some text');

bboxed.setOptions({key: 'value'});
bboxed('Some text');

bboxed('Some text', {key: 'value'});
```

#### Tags

Some tags (such as `[size]`) support options. Default options can be overwitten
with `.setTagOption(s)`:

```js
// Set multiple settings
bboxed.setTagOptions('size', {
	min: 20,
	max: 200,
	unit: '%'
});

// Set one setting at a time
bboxed.setTagOption('size', 'min', 20);
// etc...
```

### Adding your own tags

Want a custom tag? Just add it with `.addTag(s)`!

#### Basic usage

```js
// An object of {name: tag} can also be passed to create multiple at once
bboxed.addTag('comment', {
	open: '<!--',
	close: '-->'
});
console.log(bboxed('[comment]Commented[/comment]'));
// Output: <!--Commented-->
```

#### Advanced usage

```js
// This is a nonsensical tag demonstrating the interface, and won't do anything.
bboxed.setTagOption('example', 'changed', 'This has been changed');
bboxed.addTag('example', {
	open: function(token, options) {
		// The below is based on this example: [example=tag arg=argument]Interior[/example]
		token.arguments.tag; // 'tag'
		token.arguments.arg; // 'argument'
	
		token.interior; // 'Interior'

		options.changed; // 'This has been changed'
		options.notChanged; // 'This will not be changed'
	
		// Returning false in either open or close signifies that there was a failure.
		// Failed tags will be left unparsed.
		return false;

		// Return a string to signify success, and render it.
		return '<someTag>';
	},
	close: '</someTag>',
	options: {
		changed: 'This will be changed',
		notChanged: 'This will not be changed'
	}
});
```

## Developing

```sh
$ git clone https://github.com/ackwell/bboxed.git
$ cd bboxed
$ npm install
```

Before sending a pull request, make sure it is passing the tests with `npm test`.
If you add a new feature, make sure to add tests for it.

### To-do

In no particular order:

* Tables
* Settings for [img]?
* Settings for [url]? (Stuff like target="_blank")
* Add support for non-node.js systems.

## Changelog

* **v0.3.1:**
	* Added list support [#] and [*] and some list tests for robustness
* **v0.2.2:**
	* Fixed invalid single tag errors
	* Improved argument regex to allow more characters
	* Added a target option for `[url]` tags
* **v0.2.1:**
	* Fixed inifinite loop bug with non-alphanumeric tags (`[=]`, for example)
* **v0.2.0:**
	* Added parser options
	* Added support for single tags
* **v0.1.0:** Initial release

## License

Copyright (c) 2013 Saxon Landers <saxon@ackwell.com.au>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.