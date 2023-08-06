
# PieceTreeTextBuffer

The `PieceTreeTextBuffer` is a text buffer that stores the text in a piece tree. The piece tree is a tree of pieces. Each piece is a string. The tree is balanced and the pieces are immutable. This allows for efficient updates to the text buffer.

## PieceTreeBase

The `PieceTreeBase` is the base class for the `PieceTreeTextBuffer`. This is used to create a new piece tree data structure from an array of
`StringBuffer` objects, an end-of-line character (eol).

The class is initialized by create method, including `_buffers`, `root`, `_lineCnt`, `_length`, `_EOL`, `EOLLength`, and `EOLNormalized`. Which create a text buffer by determining the EOL character to use based on the number of CR, LF, CRLF characters in the text. If the text is empty or contains only one line, the default EOL character is used.
If more than half of the lines end with CRLF, then CRLF is used as the EOL character. Otherwise, LF is used as the EOL character. If the normalizeEOL parameter is true and the text contains CR or LF characters, then the chunks are normalized to use the specified EOL character.

It then iterates over the chunks and creates a new `Piece` object for each one. The `Piece` objects are used
to represent the individual pieces to text in the buffer, and are stored in the `PieceTreeBase` instance's `_buffer` property.

The create method also initializes the `_searchCache` property with a new `PieceTreeSearchCache` object, and the `_lastVisitedLine` property with an object containing the line number and value of the last visited line in the buffer.

To create each `Piece` object, the create method first checks if the `StringBuffer` object has any content. If it does, it checks if the lineStarts property of the `StringBuffer` object is defined. If it is not defined, it creates a new lineStarts array using the `createLineStartsFast` function. The lineStarts array is used to store the starting position of each line in the `StringBuffer` object.

The create method then creates a new `Piece` object using the `Piece` constructor. The `Piece` constructor takes several arguments, including the index of the `StringBuffer` object in the _buffers array, the start position of the Piece, the end position of the Piece, the index of the last line in the Piece, and the length of the Piece.

Then the create method calls the `rbInsertRight` method to insert the `Piece` object into the piece tree.
The `rbInsertRight` method is used to insert a new node into the piece tree while maintaining the red-black tree properties.


- `buffers`: It is an array of `StringBuffer` objects that represent the chunks of text in the buffer.
- `root`: It is a `TreeNode` object that represents the root node of the piece tree. The node is a `Piece` object that contains the entire text in the buffer.
- `lineCnt`: The number of lines in the buffer.
- `length`: The length of the buffer.
- `EOL`: The end of line character. It is either `\n` or `\r\n`.
- `EOLLength`: The length of the end of line character. It is either 1 or 2.
- `EOLNormalized`: Whether the end of line characters are normalized.


## PieceTreeTextBufferBuilder

The `PieceTreeTextBufferBuilder` class is responsible for building the chunks that are used to create the text buffer. It takes in a string and adds it to the chunks. It also keeps track of the BOM, the number of CR, LF, and CRLF characters, whether the text contains RTL characters, whether the text contains unusual line terminators, and whether the text is basic ASCII.

The `acceptChunk` method accepts a chunk of text and adds it to the chunks. If the chunk ends with a CR or a high currogate, then the last character is kept back and added to the next chunk. The finish method of the `PieceTreeTextBufferBuilder` class finishes building the chunks and returns a PieceTreeTextBufferFactory object
that can be used tot create a text buffer.


## PieceTreeTextBufferFactory


The `PieceTreeTextBufferFactory` class is responsible for creating a text buffer from a given set of chunks. It takes in a set of parameters such as the chunks, the byte order mark (BOM), the number of carriage returns (CR), the number of line feeds (LF), the number of carriage return line feed (CRLF), whether the text contains right-to-left (RTL) characters, whether the text contains unusual line terminators, whether the text is basic ASCII, and whether to normalize the end of line (EOL) characters.



## PieceTreeSearchCache

The `PieceTreeSearchCache` is used to cache the search results for a piece tree. It can improve the performance when searching through large text buffers.

- `get`: It takes an offset as a parameter and return a `CacheEntry` object if one exists in the cache that contains this offset. The `CacheEntry` object represents
  a node in the `PieceTreeBase` instance and contains information about the node's start offset and length.
- `get2`: Similar to `get`, but it takes a line number as a parameter instead of an offset. It returns a `CacheEntry` object if one exists in the cache that contains
  this line number.
- `set`: It takes an offset and a `CacheEntry` object as parameters and stores the `CacheEntry` object in the cache. The `CacheEntry` object represents a node in the
  `PieceTreeBase` instance and contains information about the node's start offset and length.
- `validate`: It takes an offset as a parameter and removes any `CacheEntry` objects from the cache that are no longer valid. A `CacheEntry` object is no longer valid
  if its node's parent is null or its start offset is greater than or equal to the given offset.

```ts
class PieceTreeSearchCache {
	private readonly _limit: number;
	private _cache: CacheEntry[];

	constructor(limit: number) {
		this._limit = limit;
		this._cache = [];
	}

	public get(offset: number): CacheEntry | null {
		for (let i = this._cache.length - 1; i >= 0; i--) {
			const nodePos = this._cache[i];
			if (nodePos.nodeStartOffset <= offset && nodePos.nodeStartOffset + nodePos.node.piece.length >= offset) {
				return nodePos;
			}
		}
		return null;
	}

	public get2(lineNumber: number): { node: TreeNode; nodeStartOffset: number; nodeStartLineNumber: number } | null {
		for (let i = this._cache.length - 1; i >= 0; i--) {
			const nodePos = this._cache[i];
			if (nodePos.nodeStartLineNumber && nodePos.nodeStartLineNumber < lineNumber && nodePos.nodeStartLineNumber + nodePos.node.piece.lineFeedCnt >= lineNumber) {
				return <{ node: TreeNode; nodeStartOffset: number; nodeStartLineNumber: number }>nodePos;
			}
		}
		return null;
	}

	public set(nodePosition: CacheEntry) {
		if (this._cache.length >= this._limit) {
			this._cache.shift();
		}
		this._cache.push(nodePosition);
	}

	public validate(offset: number) {
		let hasInvalidVal = false;
		const tmp: Array<CacheEntry | null> = this._cache;
		for (let i = 0; i < tmp.length; i++) {
			const nodePos = tmp[i]!;
			if (nodePos.node.parent === null || nodePos.nodeStartOffset >= offset) {
				tmp[i] = null;
				hasInvalidVal = true;
				continue;
			}
		}

		if (hasInvalidVal) {
			const newArr: CacheEntry[] = [];
			for (const entry of tmp) {
				if (entry !== null) {
					newArr.push(entry);
				}
			}

			this._cache = newArr;
		}
	}
}
```
