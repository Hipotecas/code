/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as assert from 'assert';
import { Position } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';

describe('Editor Core - Range', () => {
	test('empty range', () => {
		const s = new Range(1, 1, 1, 1);
		expect(s.startLineNumber).toStrictEqual(1)
		expect(s.startColumn).toStrictEqual(1)
		expect(s.endLineNumber).toStrictEqual(1)
		expect(s.endColumn).toStrictEqual(1)
		expect(s.isEmpty()).toStrictEqual(true)
	});

	test('swap start and stop same line', () => {
		const s = new Range(1, 2, 1, 1);
		expect(s.startLineNumber).toStrictEqual(1)
		expect(s.startColumn).toStrictEqual(1)
		expect(s.endLineNumber).toStrictEqual(1)
		expect(s.endColumn).toStrictEqual(2)
		expect(s.isEmpty()).toStrictEqual(false)
	});

	test('swap start and stop', () => {
		const s = new Range(2, 1, 1, 2);
		expect(s.startLineNumber).toStrictEqual(1)
		expect(s.startColumn).toStrictEqual(2)
		expect(s.endLineNumber).toStrictEqual(2)
		expect(s.endColumn).toStrictEqual(1)
		expect(s.isEmpty()).toStrictEqual(false)
	});

	test('no swap same line', () => {
		const s = new Range(1, 1, 1, 2);
		expect(s.startLineNumber).toStrictEqual(1)
		expect(s.startColumn).toStrictEqual(1)
		expect(s.endLineNumber).toStrictEqual(1)
		expect(s.endColumn).toStrictEqual(2)
		expect(s.isEmpty()).toStrictEqual(false)
	});

	test('no swap', () => {
		const s = new Range(1, 1, 2, 1);
		expect(s.startLineNumber).toStrictEqual(1)
		expect(s.startColumn).toStrictEqual(1)
		expect(s.endLineNumber).toStrictEqual(2)
		expect(s.endColumn).toStrictEqual(1)
		expect(s.isEmpty()).toStrictEqual(false)
	});

	test('compareRangesUsingEnds', () => {
		let a: Range, b: Range;

		a = new Range(1, 1, 1, 3);
		b = new Range(1, 2, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start < b.start, a.end < b.end');

		a = new Range(1, 1, 1, 3);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start = b.start, a.end < b.end');

		a = new Range(1, 2, 1, 3);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start > b.start, a.end < b.end');

		a = new Range(1, 1, 1, 4);
		b = new Range(1, 2, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) < 0, 'a.start < b.start, a.end = b.end');

		a = new Range(1, 1, 1, 4);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) === 0, 'a.start = b.start, a.end = b.end');

		a = new Range(1, 2, 1, 4);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start > b.start, a.end = b.end');

		a = new Range(1, 1, 1, 5);
		b = new Range(1, 2, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start < b.start, a.end > b.end');

		a = new Range(1, 1, 2, 4);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start = b.start, a.end > b.end');

		a = new Range(1, 2, 5, 1);
		b = new Range(1, 1, 1, 4);
		assert.ok(Range.compareRangesUsingEnds(a, b) > 0, 'a.start > b.start, a.end > b.end');
	});

	test('containsPosition', () => {
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(1, 3))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(2, 1))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(2, 2))).toStrictEqual(true)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(2, 3))).toStrictEqual(true)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(3, 1))).toStrictEqual(true)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(5, 9))).toStrictEqual(true)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(5, 10))).toStrictEqual(true)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(5, 11))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsPosition(new Position(6, 1))).toStrictEqual(false)
	});

	test('containsRange', () => {
		expect(new Range(2, 2, 5, 10).containsRange(new Range(1, 3, 2, 2))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(2, 1, 2, 2))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(2, 2, 5, 11))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(2, 2, 6, 1))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(5, 9, 6, 1))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(5, 10, 6, 1))).toStrictEqual(false)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(2, 2, 5, 10))).toStrictEqual(true)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(2, 3, 5, 9))).toStrictEqual(true)
		expect(new Range(2, 2, 5, 10).containsRange(new Range(3, 100, 4, 100))).toStrictEqual(true)
	});

	test('areIntersecting', () => {
		expect(Range.areIntersecting(new Range(2, 2, 3, 2), new Range(4, 2, 5, 2))).toStrictEqual(false)
		expect(Range.areIntersecting(new Range(4, 2, 5, 2), new Range(2, 2, 3, 2))).toStrictEqual(false)
		expect(Range.areIntersecting(new Range(4, 2, 5, 2), new Range(5, 2, 6, 2))).toStrictEqual(false)
		expect(Range.areIntersecting(new Range(5, 2, 6, 2), new Range(4, 2, 5, 2))).toStrictEqual(false)
		expect(Range.areIntersecting(new Range(2, 2, 2, 7), new Range(2, 4, 2, 6))).toStrictEqual(true)
		expect(Range.areIntersecting(new Range(2, 2, 2, 7), new Range(2, 4, 2, 9))).toStrictEqual(true)
		expect(Range.areIntersecting(new Range(2, 4, 2, 9), new Range(2, 2, 2, 7))).toStrictEqual(true)
	});
});
