/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ensureNoDisposablesAreLeakedInTestSuite } from 'vs/base/test/common/utils';
import { Range } from 'vs/editor/common/core/range';
import { UnicodeHighlighterOptions, UnicodeTextModelHighlighter } from 'vs/editor/common/services/unicodeTextModelHighlighter';
import { createTextModel } from 'vs/editor/test/common/testTextModel';

describe('UnicodeTextModelHighlighter', () => {
	ensureNoDisposablesAreLeakedInTestSuite();

	function t(text: string, options: UnicodeHighlighterOptions): unknown {
		const m = createTextModel(text);
		const r = UnicodeTextModelHighlighter.computeUnicodeHighlights(m, options);
		m.dispose();

		return {
			...r,
			ranges: r.ranges.map(r => Range.lift(r).toString())
		};
	}

	test('computeUnicodeHighlights (#168068)', () => {
		expect(
			t(`
	For å gi et eksempel
`, {
				allowedCodePoints: [],
				allowedLocales: [],
				ambiguousCharacters: true,
				invisibleCharacters: true,
				includeComments: false,
				includeStrings: false,
				nonBasicASCII: false
			}),

		).toStrictEqual(
      {
				ambiguousCharacterCount: 0,
				hasMore: false,
				invisibleCharacterCount: 4,
				nonBasicAsciiCharacterCount: 0,
				ranges: [
					'[2,5 -> 2,6]',
					'[2,7 -> 2,8]',
					'[2,10 -> 2,11]',
					'[2,13 -> 2,14]'
				]
			}
    );
	});
});
