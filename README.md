# bboxed [![Build Status](https://travis-ci.org/ackwell/bboxed.png?branch=master)](https://travis-ci.org/ackwell/bboxed)

An extensible `[bbcode]` parser for node.js. (And other platforms once it's running nicely)

Hat tips to [marked](https://github.com/chjj/marked/), from which I've borrowed a few ideas.

## Installing

It's not finished yet. Stop that.

## Using

If you like things to Just Work™:

```js
console.log(bboxed('Bboxing [i]Bbcode[/i]'));
// Output: Bboxing <em>Bbcode</em>
```

Some tags, such as `[size]` support options. Default options can be overwitten
with `.setTagOption(s)`:

```js
// Set multiple settings
bboxed.setTagOptions('size', {
	min: 20,
	max: 200,
	unit: '%'
});

// Set one setting at a time
bboxed.setTagOptions('size', 'min', 20);
// etc...
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

* Ability to add additional tags
* Lists
* Tables
* Settings for [img]?
* Add support for non-node.js systems.

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