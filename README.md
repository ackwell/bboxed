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
with `.setTagOptions`:

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

## License

I suppose I should add a license text in.