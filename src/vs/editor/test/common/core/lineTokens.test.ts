/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { MetadataConsts } from 'vs/editor/common/encodedTokenAttributes';
import { LanguageIdCodec } from 'vs/editor/common/services/languagesRegistry';
import { IViewLineTokens, LineTokens } from 'vs/editor/common/tokens/lineTokens';

describe('LineTokens', () => {

	interface ILineToken {
		startIndex: number;
		foreground: number;
	}

	function createLineTokens(text: string, tokens: ILineToken[]): LineTokens {
		const binTokens = new Uint32Array(tokens.length << 1);

		for (let i = 0, len = tokens.length; i < len; i++) {
			binTokens[(i << 1)] = (i + 1 < len ? tokens[i + 1].startIndex : text.length);
			binTokens[(i << 1) + 1] = (
				tokens[i].foreground << MetadataConsts.FOREGROUND_OFFSET
			) >>> 0;
		}

		return new LineTokens(binTokens, text, new LanguageIdCodec());
	}

	function createTestLineTokens(): LineTokens {
		return createLineTokens(
			'Hello world, this is a lovely day',
			[
				{ startIndex: 0, foreground: 1 }, // Hello_
				{ startIndex: 6, foreground: 2 }, // world,_
				{ startIndex: 13, foreground: 3 }, // this_
				{ startIndex: 18, foreground: 4 }, // is_
				{ startIndex: 21, foreground: 5 }, // a_
				{ startIndex: 23, foreground: 6 }, // lovely_
				{ startIndex: 30, foreground: 7 }, // day
			]
		);
	}

	function renderLineTokens(tokens: LineTokens): string {
		let result = '';
		const str = tokens.getLineContent();
		let lastOffset = 0;
		for (let i = 0; i < tokens.getCount(); i++) {
			result += str.substring(lastOffset, tokens.getEndOffset(i));
			result += `(${tokens.getMetadata(i)})`;
			lastOffset = tokens.getEndOffset(i);
		}
		return result;
	}

	test('withInserted 1', () => {
		const lineTokens = createTestLineTokens();
		expect(renderLineTokens(lineTokens)).toStrictEqual('Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)')

		const lineTokens2 = lineTokens.withInserted([
			{ offset: 0, text: '1', tokenMetadata: 0, },
			{ offset: 6, text: '2', tokenMetadata: 0, },
			{ offset: 9, text: '3', tokenMetadata: 0, },
		]);

		expect(renderLineTokens(lineTokens2)).toStrictEqual('1(0)Hello (32768)2(0)wor(65536)3(0)ld, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)')
	});

	test('withInserted (tokens at the same position)', () => {
		const lineTokens = createTestLineTokens();
		expect(renderLineTokens(lineTokens)).toStrictEqual('Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)')

		const lineTokens2 = lineTokens.withInserted([
			{ offset: 0, text: '1', tokenMetadata: 0, },
			{ offset: 0, text: '2', tokenMetadata: 0, },
			{ offset: 0, text: '3', tokenMetadata: 0, },
		]);

    expect(renderLineTokens(lineTokens2)).toStrictEqual('1(0)2(0)3(0)Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)')
	});

	test('withInserted (tokens at the end)', () => {
		const lineTokens = createTestLineTokens();
    expect(renderLineTokens(lineTokens)).toStrictEqual('Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)day(229376)')
		const lineTokens2 = lineTokens.withInserted([
			{ offset: 'Hello world, this is a lovely day'.length - 1, text: '1', tokenMetadata: 0, },
			{ offset: 'Hello world, this is a lovely day'.length, text: '2', tokenMetadata: 0, },
		]);

		expect(renderLineTokens(lineTokens2), 'Hello (32768)world, (65536)this (98304)is (131072)a (163840)lovely (196608)da(229376)1(0)y(229376)2(0)')
	});

	test('basics', () => {
		const lineTokens = createTestLineTokens();

		expect(lineTokens.getLineContent(), 'Hello world).toStrictEqual(this is a lovely day')
		expect(lineTokens.getLineContent().length).toStrictEqual(33)
		expect(lineTokens.getCount()).toStrictEqual(7)

		expect(lineTokens.getStartOffset(0)).toStrictEqual(0)
		expect(lineTokens.getEndOffset(0)).toStrictEqual(6)
		expect(lineTokens.getStartOffset(1)).toStrictEqual(6)
		expect(lineTokens.getEndOffset(1)).toStrictEqual(13)
		expect(lineTokens.getStartOffset(2)).toStrictEqual(13)
		expect(lineTokens.getEndOffset(2)).toStrictEqual(18)
		expect(lineTokens.getStartOffset(3)).toStrictEqual(18)
		expect(lineTokens.getEndOffset(3)).toStrictEqual(21)
		expect(lineTokens.getStartOffset(4)).toStrictEqual(21)
		expect(lineTokens.getEndOffset(4)).toStrictEqual(23)
		expect(lineTokens.getStartOffset(5)).toStrictEqual(23)
		expect(lineTokens.getEndOffset(5)).toStrictEqual(30)
		expect(lineTokens.getStartOffset(6)).toStrictEqual(30)
		expect(lineTokens.getEndOffset(6)).toStrictEqual(33)
	});

	test('findToken', () => {
		const lineTokens = createTestLineTokens();

		expect(lineTokens.findTokenIndexAtOffset(0)).toStrictEqual(0)
		expect(lineTokens.findTokenIndexAtOffset(1)).toStrictEqual(0)
		expect(lineTokens.findTokenIndexAtOffset(2)).toStrictEqual(0)
		expect(lineTokens.findTokenIndexAtOffset(3)).toStrictEqual(0)
		expect(lineTokens.findTokenIndexAtOffset(4)).toStrictEqual(0)
		expect(lineTokens.findTokenIndexAtOffset(5)).toStrictEqual(0)
		expect(lineTokens.findTokenIndexAtOffset(6)).toStrictEqual(1)
		expect(lineTokens.findTokenIndexAtOffset(7)).toStrictEqual(1)
		expect(lineTokens.findTokenIndexAtOffset(8)).toStrictEqual(1)
		expect(lineTokens.findTokenIndexAtOffset(9)).toStrictEqual(1)
		expect(lineTokens.findTokenIndexAtOffset(10)).toStrictEqual(1)
		expect(lineTokens.findTokenIndexAtOffset(11)).toStrictEqual(1)
		expect(lineTokens.findTokenIndexAtOffset(12)).toStrictEqual(1)
		expect(lineTokens.findTokenIndexAtOffset(13)).toStrictEqual(2)
		expect(lineTokens.findTokenIndexAtOffset(14)).toStrictEqual(2)
		expect(lineTokens.findTokenIndexAtOffset(15)).toStrictEqual(2)
		expect(lineTokens.findTokenIndexAtOffset(16)).toStrictEqual(2)
		expect(lineTokens.findTokenIndexAtOffset(17)).toStrictEqual(2)
		expect(lineTokens.findTokenIndexAtOffset(18)).toStrictEqual(3)
		expect(lineTokens.findTokenIndexAtOffset(19)).toStrictEqual(3)
		expect(lineTokens.findTokenIndexAtOffset(20)).toStrictEqual(3)
		expect(lineTokens.findTokenIndexAtOffset(21)).toStrictEqual(4)
		expect(lineTokens.findTokenIndexAtOffset(22)).toStrictEqual(4)
		expect(lineTokens.findTokenIndexAtOffset(23)).toStrictEqual(5)
		expect(lineTokens.findTokenIndexAtOffset(24)).toStrictEqual(5)
		expect(lineTokens.findTokenIndexAtOffset(25)).toStrictEqual(5)
		expect(lineTokens.findTokenIndexAtOffset(26)).toStrictEqual(5)
		expect(lineTokens.findTokenIndexAtOffset(27)).toStrictEqual(5)
		expect(lineTokens.findTokenIndexAtOffset(28)).toStrictEqual(5)
		expect(lineTokens.findTokenIndexAtOffset(29)).toStrictEqual(5)
		expect(lineTokens.findTokenIndexAtOffset(30)).toStrictEqual(6)
		expect(lineTokens.findTokenIndexAtOffset(31)).toStrictEqual(6)
		expect(lineTokens.findTokenIndexAtOffset(32)).toStrictEqual(6)
		expect(lineTokens.findTokenIndexAtOffset(33)).toStrictEqual(6)
		expect(lineTokens.findTokenIndexAtOffset(34)).toStrictEqual(6)
	});

	interface ITestViewLineToken {
		endIndex: number;
		foreground: number;
	}

	function assertViewLineTokens(_actual: IViewLineTokens, expected: ITestViewLineToken[]): void {
		const actual: ITestViewLineToken[] = [];
		for (let i = 0, len = _actual.getCount(); i < len; i++) {
			actual[i] = {
				endIndex: _actual.getEndOffset(i),
				foreground: _actual.getForeground(i)
			};
		}
		assert.deepStrictEqual(actual, expected);
    expect(actual).toStrictEqual(expected)
	}

	test('inflate', () => {
		const lineTokens = createTestLineTokens();
		assertViewLineTokens(lineTokens.inflate(), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 },
			{ endIndex: 33, foreground: 7 },
		]);
	});

	test('sliceAndInflate', () => {
		const lineTokens = createTestLineTokens();
		assertViewLineTokens(lineTokens.sliceAndInflate(0, 33, 0), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 },
			{ endIndex: 33, foreground: 7 },
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(0, 32, 0), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 },
			{ endIndex: 32, foreground: 7 },
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(0, 30, 0), [
			{ endIndex: 6, foreground: 1 },
			{ endIndex: 13, foreground: 2 },
			{ endIndex: 18, foreground: 3 },
			{ endIndex: 21, foreground: 4 },
			{ endIndex: 23, foreground: 5 },
			{ endIndex: 30, foreground: 6 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(0, 30, 1), [
			{ endIndex: 7, foreground: 1 },
			{ endIndex: 14, foreground: 2 },
			{ endIndex: 19, foreground: 3 },
			{ endIndex: 22, foreground: 4 },
			{ endIndex: 24, foreground: 5 },
			{ endIndex: 31, foreground: 6 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(6, 18, 0), [
			{ endIndex: 7, foreground: 2 },
			{ endIndex: 12, foreground: 3 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(7, 18, 0), [
			{ endIndex: 6, foreground: 2 },
			{ endIndex: 11, foreground: 3 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(6, 17, 0), [
			{ endIndex: 7, foreground: 2 },
			{ endIndex: 11, foreground: 3 }
		]);

		assertViewLineTokens(lineTokens.sliceAndInflate(6, 19, 0), [
			{ endIndex: 7, foreground: 2 },
			{ endIndex: 12, foreground: 3 },
			{ endIndex: 13, foreground: 4 },
		]);
	});
});
