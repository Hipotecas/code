
# Range

The `Range` interface represents a fragment of a document that can contain nodes and parts of text nodes.

A Range can start and end at any point, and the start and end point may even be the same (in which case it be a empty range).

## Properties

- `collapsed`: Returns a Boolean indicating whether the range's start and end points are at the same position.
- `commonAncestorContainer`: Returns the deepest, or further down the document tree, `Node` that contains both `startContainer` and `endContainer`. Returns `null` if `startContainer` and `endContainer` are not in the same tree.
- `endContainer`: Returns the `Node` within which the Range ends.
- `endOffset`: Returns a number representing where in the `endContainer` the Range ends.
- `startContainer`: Returns the `Node` within which the Range starts.
- `startOffset`: Returns a number representing where in the `startContainer` the Range starts.




## Links

- [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) on MDN
- [Range](https://dom.spec.whatwg.org/#interface-range) on DOM Standard
- [Range](https://www.w3.org/TR/2000/REC-DOM-Level-2-Traversal-Range-20001113/ranges.html#Level-2-Range-Position) on DOM Level 2 Traversal and Range Specification (2000)
