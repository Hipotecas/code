/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import {
  compareFileExtensions, compareFileExtensionsDefault, compareFileExtensionsLower, compareFileExtensionsUnicode, compareFileExtensionsUpper, compareFileNames, compareFileNamesDefault, compareFileNamesLower, compareFileNamesUnicode, compareFileNamesUpper
} from 'vs/base/common/comparers';

const compareLocale = (a: string, b: string) => a.localeCompare(b);
const compareLocaleNumeric = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

describe('Comparers', () => {

	test('compareFileNames', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNames(null, null) === 0, 'null should be equal').toBe(true);
		expect(compareFileNames(null, 'abc') < 0, 'null should be come before real values').toBe(true);
		expect(compareFileNames('', '') === 0, 'empty should be equal').toBe(true);
		expect(compareFileNames('abc', 'abc') === 0, 'equal names should be equal').toBe(true);
		expect(compareFileNames('z', 'A') > 0, 'z comes after A').toBe(true);
		expect(compareFileNames('Z', 'a') > 0, 'Z comes after a').toBe(true);

		// name plus extension comparisons
		expect(compareFileNames('bbb.aaa', 'aaa.bbb') > 0, 'compares the whole name all at once by locale').toBe(true);
		expect(compareFileNames('aggregate.go', 'aggregate_repo.go') > 0, 'compares the whole name all at once by locale').toBe(true);

		// dotfile comparisons
		expect(compareFileNames('.abc', '.abc') === 0, 'equal dotfile names should be equal').toBe(true);
		expect(compareFileNames('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly').toBe(true);
		expect(compareFileNames('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true);
		expect(compareFileNames('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true);
		expect(compareFileNames('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot').toBe(true);

		// dotfile vs non-dotfile comparisons
		expect(compareFileNames(null, '.abc') < 0, 'null should come before dotfiles').toBe(true);
		expect(compareFileNames('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true);
		expect(compareFileNames('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true);
		expect(compareFileNames('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true);
		expect(compareFileNames('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true);

		// numeric comparisons
		expect(compareFileNames('1', '1') === 0, 'numerically equal full names should be equal').toBe(true);
		expect(compareFileNames('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true);
		expect(compareFileNames('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true);
		expect(compareFileNames('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long').toBe(true);
		expect(compareFileNames('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true);
		expect(compareFileNames('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true);
		expect(compareFileNames('a.ext1', 'b.Ext1') < 0, 'if names are different and extensions with numbers are equal except for case, filenames are sorted in name order').toBe(true);
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNames), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNames('a', 'A') !== compareLocale('a', 'A'), 'the same letter sorts in unicode order, not by locale').toBe(true);
		expect(compareFileNames('â', 'Â') !== compareLocale('â', 'Â'), 'the same accented letter sorts in unicode order, not by locale').toBe(true);
		assert.notDeepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNames), ['artichoke', 'Artichoke', 'art', 'Art'].sort(compareLocale), 'words with the same root and different cases do not sort in locale order');
		assert.notDeepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNames), ['email', 'Email', 'émail', 'Émail'].sort(compareLocale), 'the same base characters with different case or accents do not sort in locale order');

		// numeric comparisons
		expect(compareFileNames('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order').toBe(true);
		expect(compareFileNames('abc.txt1', 'abc.txt01') > 0, 'same name plus extensions with equal numbers sort in unicode order').toBe(true);
		expect(compareFileNames('art01', 'Art01') !== 'art01'.localeCompare('Art01', undefined, { numeric: true }),
			'a numerically equivalent word of a different case does not compare numerically based on locale').toBe(true);
		expect(compareFileNames('a.ext1', 'a.Ext1') > 0, 'if names are equal and extensions with numbers are equal except for case, filenames are sorted in full filename unicode order').toBe(true);

	});

	test('compareFileExtensions', () => {

		//
		// Comparisons with the same results as compareFileExtensionsDefault
		//

		// name-only comparisons
		expect(compareFileExtensions(null, null) === 0, 'null should be equal').toBe(true);
		expect(compareFileExtensions(null, 'abc') < 0, 'null should come before real files without extension').toBe(true);
		expect(compareFileExtensions('', '') === 0, 'empty should be equal').toBe(true);
		expect(compareFileExtensions('abc', 'abc') === 0, 'equal names should be equal').toBe(true);
		expect(compareFileExtensions('z', 'A') > 0, 'z comes after A').toBe(true);
		expect(compareFileExtensions('Z', 'a') > 0, 'Z comes after a').toBe(true);

		// name plus extension comparisons
		expect(compareFileExtensions('file.ext', 'file.ext') === 0, 'equal full names should be equal').toBe(true);
		expect(compareFileExtensions('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true);
		expect(compareFileExtensions('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true);
		expect(compareFileExtensions('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extensions even if filenames compare differently').toBe(true);

		// dotfile comparisons
		expect(compareFileExtensions('.abc', '.abc') === 0, 'equal dotfiles should be equal').toBe(true);
		expect(compareFileExtensions('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case').toBe(true);

		// dotfile vs non-dotfile comparisons
		expect(compareFileExtensions(null, '.abc') < 0, 'null should come before dotfiles').toBe(true);
		expect(compareFileExtensions('.env', 'aaa.env') < 0, 'if equal extensions, filenames should be compared, empty filename should come before others').toBe(true);
		expect(compareFileExtensions('.MD', 'a.md') < 0, 'if extensions differ in case, files sort by extension in unicode order').toBe(true);

		// numeric comparisons
		expect(compareFileExtensions('1', '1') === 0, 'numerically equal full names should be equal').toBe(true);
		expect(compareFileExtensions('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true);
		expect(compareFileExtensions('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true);
		expect(compareFileExtensions('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long').toBe(true);
		expect(compareFileExtensions('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true);
		expect(compareFileExtensions('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true);
		expect(compareFileExtensions('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true);
		expect(compareFileExtensions('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal').toBe(true);
		expect(compareFileExtensions('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true);
		expect(compareFileExtensions('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long').toBe(true);
		expect(compareFileExtensions('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, names should be compared').toBe(true);
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensions), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results from compareFileExtensionsDefault
		//

		// name-only comparisions
		expect(compareFileExtensions('a', 'A') !== compareLocale('a', 'A'), 'the same letter of different case does not sort by locale').toBe(true);
		expect(compareFileExtensions('â', 'Â') !== compareLocale('â', 'Â'), 'the same accented letter of different case does not sort by locale').toBe(true);
		assert.notDeepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensions), ['artichoke', 'Artichoke', 'art', 'Art'].sort(compareLocale), 'words with the same root and different cases do not sort in locale order');
		assert.notDeepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensions), ['email', 'Email', 'émail', 'Émail'].sort((a, b) => a.localeCompare(b)), 'the same base characters with different case or accents do not sort in locale order');

		// name plus extension comparisons
		expect(compareFileExtensions('a.MD', 'a.md') < 0, 'case differences in extensions sort in unicode order').toBe(true);
		expect(compareFileExtensions('a.md', 'A.md') > 0, 'case differences in names sort in unicode order').toBe(true);
		expect(compareFileExtensions('a.md', 'b.MD') > 0, 'when extensions are the same except for case, the files sort by extension').toBe(true);
		expect(compareFileExtensions('aggregate.go', 'aggregate_repo.go') < 0, 'when extensions are equal, names sort in dictionary order').toBe(true);

		// dotfile comparisons
		expect(compareFileExtensions('.env', '.aaa.env') < 0, 'a dotfile with an extension is treated as a name plus an extension - equal extensions').toBe(true);
		expect(compareFileExtensions('.env', '.env.aaa') > 0, 'a dotfile with an extension is treated as a name plus an extension - unequal extensions').toBe(true);

		// dotfile vs non-dotfile comparisons
		expect(compareFileExtensions('.env', 'aaa') > 0, 'filenames without extensions come before dotfiles').toBe(true);
		expect(compareFileExtensions('.md', 'A.MD') > 0, 'a file with an uppercase extension sorts before a dotfile of the same lowercase extension').toBe(true);

		// numeric comparisons
		expect(compareFileExtensions('abc.txt01', 'abc.txt1') < 0, 'extensions with equal numbers sort in unicode order').toBe(true);
		expect(compareFileExtensions('art01', 'Art01') !== compareLocaleNumeric('art01', 'Art01'), 'a numerically equivalent word of a different case does not compare by locale').toBe(true);
		expect(compareFileExtensions('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order').toBe(true);
		expect(compareFileExtensions('txt.abc01', 'txt.abc1') < 0, 'extensions with equivalent numbers sort in unicode order').toBe(true);
		expect(compareFileExtensions('a.ext1', 'b.Ext1') > 0, 'if names are different and extensions with numbers are equal except for case, filenames are sorted in extension unicode order').toBe(true);
		expect(compareFileExtensions('a.ext1', 'a.Ext1') > 0, 'if names are equal and extensions with numbers are equal except for case, filenames are sorted in extension unicode order').toBe(true);

	});

	test('compareFileNamesDefault', () => {

		//
		// Comparisons with the same results as compareFileNames
		//

		// name-only comparisons
		expect(compareFileNamesDefault(null, null) === 0, 'null should be equal').toBe(true);
		expect(compareFileNamesDefault(null, 'abc') < 0, 'null should be come before real values').toBe(true);
		expect(compareFileNamesDefault('', '') === 0, 'empty should be equal').toBe(true);
		expect(compareFileNamesDefault('abc', 'abc') === 0, 'equal names should be equal').toBe(true);
		expect(compareFileNamesDefault('z', 'A') > 0, 'z comes after A').toBe(true);
		expect(compareFileNamesDefault('Z', 'a') > 0, 'Z comes after a').toBe(true);

		// name plus extension comparisons
		expect(compareFileNamesDefault('file.ext', 'file.ext') === 0, 'equal full names should be equal').toBe(true);
		expect(compareFileNamesDefault('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true);
		expect(compareFileNamesDefault('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true);
		expect(compareFileNamesDefault('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently').toBe(true);
		expect(compareFileNamesDefault('aggregate.go', 'aggregate_repo.go') > 0, 'compares the whole filename in locale order').toBe(true);

		// dotfile comparisons
		expect(compareFileNamesDefault('.abc', '.abc') === 0, 'equal dotfile names should be equal').toBe(true);
		expect(compareFileNamesDefault('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly').toBe(true);
		expect(compareFileNamesDefault('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true);
		expect(compareFileNamesDefault('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true);
		expect(compareFileNamesDefault('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot').toBe(true);

		// dotfile vs non-dotfile comparisons
		expect(compareFileNamesDefault(null, '.abc') < 0, 'null should come before dotfiles').toBe(true);
		expect(compareFileNamesDefault('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true);
		expect(compareFileNamesDefault('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true);
		expect(compareFileNamesDefault('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true);
		expect(compareFileNamesDefault('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true);

		// numeric comparisons
		expect(compareFileNamesDefault('1', '1') === 0, 'numerically equal full names should be equal').toBe(true);
		expect(compareFileNamesDefault('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true);
		expect(compareFileNamesDefault('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true);
		expect(compareFileNamesDefault('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long').toBe(true);
		expect(compareFileNamesDefault('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true);
		expect(compareFileNamesDefault('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true);
		expect(compareFileNamesDefault('a.ext1', 'b.Ext1') < 0, 'if names are different and extensions with numbers are equal except for case, filenames are compared by full filename').toBe(true);
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesDefault), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results than compareFileNames
		//

		// name-only comparisons
		expect(compareFileNamesDefault('a', 'A') === compareLocale('a', 'A'), 'the same letter sorts by locale').toBe(true);
		expect(compareFileNamesDefault('â', 'Â') === compareLocale('â', 'Â'), 'the same accented letter sorts by locale').toBe(true);
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesDefault), ['email', 'Email', 'émail', 'Émail'].sort(compareLocale), 'the same base characters with different case or accents sort in locale order');

		// numeric comparisons
		expect(compareFileNamesDefault('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest number first').toBe(true);
		expect(compareFileNamesDefault('abc.txt1', 'abc.txt01') < 0, 'same name plus extensions with equal numbers sort shortest number first').toBe(true);
		expect(compareFileNamesDefault('art01', 'Art01') === compareLocaleNumeric('art01', 'Art01'), 'a numerically equivalent word of a different case compares numerically based on locale').toBe(true);
		expect(compareFileNamesDefault('a.ext1', 'a.Ext1') === compareLocale('ext1', 'Ext1'), 'if names are equal and extensions with numbers are equal except for case, filenames are sorted in extension locale order').toBe(true);
	});

	test('compareFileExtensionsDefault', () => {

		//
		// Comparisons with the same result as compareFileExtensions
		//

		// name-only comparisons
		expect(compareFileExtensionsDefault(null, null) === 0, 'null should be equal').toBe(true)
		expect(compareFileExtensionsDefault(null, 'abc') < 0, 'null should come before real files without extensions').toBe(true)
		expect(compareFileExtensionsDefault('', '') === 0, 'empty should be equal').toBe(true)
		expect(compareFileExtensionsDefault('abc', 'abc') === 0, 'equal names should be equal').toBe(true)
		expect(compareFileExtensionsDefault('z', 'A') > 0, 'z comes after A').toBe(true)
		expect(compareFileExtensionsDefault('Z', 'a') > 0, 'Z comes after a').toBe(true)

		// name plus extension comparisons
		expect(compareFileExtensionsDefault('file.ext', 'file.ext') === 0, 'equal full filenames should be equal').toBe(true)
		expect(compareFileExtensionsDefault('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true)
		expect(compareFileExtensionsDefault('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true)
		expect(compareFileExtensionsDefault('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first').toBe(true)

		// dotfile comparisons
		expect(compareFileExtensionsDefault('.abc', '.abc') === 0, 'equal dotfiles should be equal').toBe(true)
		expect(compareFileExtensionsDefault('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileExtensionsDefault(null, '.abc') < 0, 'null should come before dotfiles').toBe(true)
		expect(compareFileExtensionsDefault('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true)
		expect(compareFileExtensionsDefault('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true)

		// numeric comparisons
		expect(compareFileExtensionsDefault('1', '1') === 0, 'numerically equal full names should be equal').toBe(true)
		expect(compareFileExtensionsDefault('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true)
		expect(compareFileExtensionsDefault('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsDefault('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order').toBe(true)
		expect(compareFileExtensionsDefault('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true)
		expect(compareFileExtensionsDefault('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true)
		expect(compareFileExtensionsDefault('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsDefault('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal').toBe(true)
		expect(compareFileExtensionsDefault('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsDefault('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long').toBe(true)
		expect(compareFileExtensionsDefault('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared').toBe(true)
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsDefault), ['A2.txt', 'a10.txt', 'a20.txt', 'A100.txt'], 'filenames with number and case differences compare numerically');

		//
		// Comparisons with different results than compareFileExtensions
		//

		// name-only comparisons
		expect(compareFileExtensionsDefault('a', 'A') === compareLocale('a', 'A'), 'the same letter of different case sorts by locale').toBe(true)
		expect(compareFileExtensionsDefault('â', 'Â') === compareLocale('â', 'Â'), 'the same accented letter of different case sorts by locale').toBe(true)
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsDefault), ['email', 'Email', 'émail', 'Émail'].sort((a, b) => a.localeCompare(b)), 'the same base characters with different case or accents sort in locale order');

		// name plus extension comparisons
		expect(compareFileExtensionsDefault('a.MD', 'a.md') === compareLocale('MD', 'md'), 'case differences in extensions sort by locale').toBe(true)
		expect(compareFileExtensionsDefault('a.md', 'A.md') === compareLocale('a', 'A'), 'case differences in names sort by locale').toBe(true)
		expect(compareFileExtensionsDefault('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name').toBe(true)
		expect(compareFileExtensionsDefault('aggregate.go', 'aggregate_repo.go') > 0, 'names with the same extension sort in full filename locale order').toBe(true)

		// dotfile comparisons
		expect(compareFileExtensionsDefault('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true)
		expect(compareFileExtensionsDefault('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileExtensionsDefault('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true)
		expect(compareFileExtensionsDefault('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true)

		// numeric comparisons
		expect(compareFileExtensionsDefault('abc.txt01', 'abc.txt1') > 0, 'extensions with equal numbers should be in shortest-first order').toBe(true)
		expect(compareFileExtensionsDefault('art01', 'Art01') === compareLocaleNumeric('art01', 'Art01'), 'a numerically equivalent word of a different case compares numerically based on locale').toBe(true)
		expect(compareFileExtensionsDefault('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest string first').toBe(true)
		expect(compareFileExtensionsDefault('txt.abc01', 'txt.abc1') > 0, 'extensions with equivalent numbers sort shortest extension first').toBe(true)
		expect(compareFileExtensionsDefault('a.ext1', 'b.Ext1') < 0, 'if extensions with numbers are equal except for case, full filenames should be compared').toBe(true)
		expect(compareFileExtensionsDefault('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'a.Ext1'), 'if extensions with numbers are equal except for case, full filenames are compared in locale order').toBe(true)

	});

	test('compareFileNamesUpper', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNamesUpper(null, null) === 0, 'null should be equal').toBe(true)
		expect(compareFileNamesUpper(null, 'abc') < 0, 'null should be come before real values').toBe(true)
		expect(compareFileNamesUpper('', '') === 0, 'empty should be equal').toBe(true)
		expect(compareFileNamesUpper('abc', 'abc') === 0, 'equal names should be equal').toBe(true)
		expect(compareFileNamesUpper('z', 'A') > 0, 'z comes after A').toBe(true)

		// name plus extension comparisons
		expect(compareFileNamesUpper('file.ext', 'file.ext') === 0, 'equal full names should be equal').toBe(true)
		expect(compareFileNamesUpper('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true)
		expect(compareFileNamesUpper('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true)
		expect(compareFileNamesUpper('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently').toBe(true)
		expect(compareFileNamesUpper('aggregate.go', 'aggregate_repo.go') > 0, 'compares the full filename in locale order').toBe(true)

		// dotfile comparisons
		expect(compareFileNamesUpper('.abc', '.abc') === 0, 'equal dotfile names should be equal').toBe(true)
		expect(compareFileNamesUpper('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly').toBe(true)
		expect(compareFileNamesUpper('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true)
		expect(compareFileNamesUpper('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true)
		expect(compareFileNamesUpper('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileNamesUpper(null, '.abc') < 0, 'null should come before dotfiles').toBe(true)
		expect(compareFileNamesUpper('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true)
		expect(compareFileNamesUpper('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true)
		expect(compareFileNamesUpper('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true)
		expect(compareFileNamesUpper('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true)

		// numeric comparisons
		expect(compareFileNamesUpper('1', '1') === 0, 'numerically equal full names should be equal').toBe(true)
		expect(compareFileNamesUpper('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true)
		expect(compareFileNamesUpper('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileNamesUpper('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long').toBe(true)
		expect(compareFileNamesUpper('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true)
		expect(compareFileNamesUpper('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true)
		expect(compareFileNamesUpper('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest number first').toBe(true)
		expect(compareFileNamesUpper('abc.txt1', 'abc.txt01') < 0, 'same name plus extensions with equal numbers sort shortest number first').toBe(true)
		expect(compareFileNamesUpper('a.ext1', 'b.Ext1') < 0, 'different names with the equal extensions except for case are sorted by full filename').toBe(true)
		expect(compareFileNamesUpper('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'a.Ext1'), 'same names with equal and extensions except for case are sorted in full filename locale order').toBe(true)

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNamesUpper('Z', 'a') < 0, 'Z comes before a').toBe(true)
		expect(compareFileNamesUpper('a', 'A') > 0, 'the same letter sorts uppercase first').toBe(true)
		expect(compareFileNamesUpper('â', 'Â') > 0, 'the same accented letter sorts uppercase first').toBe(true)
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNamesUpper), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesUpper), ['Email', 'Émail', 'email', 'émail'], 'the same base characters with different case or accents sort uppercase first');

		// numeric comparisons
		expect(compareFileNamesUpper('art01', 'Art01') > 0, 'a numerically equivalent name of a different case compares uppercase first').toBe(true)
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesUpper), ['A2.txt', 'A100.txt', 'a10.txt', 'a20.txt'], 'filenames with number and case differences group by case then compare by number');

	});

	test('compareFileExtensionsUpper', () => {

		//
		// Comparisons with the same result as compareFileExtensionsDefault
		//

		// name-only comparisons
		expect(compareFileExtensionsUpper(null, null) === 0, 'null should be equal').toBe(true)
		expect(compareFileExtensionsUpper(null, 'abc') < 0, 'null should come before real files without extensions').toBe(true)
		expect(compareFileExtensionsUpper('', '') === 0, 'empty should be equal').toBe(true)
		expect(compareFileExtensionsUpper('abc', 'abc') === 0, 'equal names should be equal').toBe(true)
		expect(compareFileExtensionsUpper('z', 'A') > 0, 'z comes after A').toBe(true)

		// name plus extension comparisons
		expect(compareFileExtensionsUpper('file.ext', 'file.ext') === 0, 'equal full filenames should be equal').toBe(true)
		expect(compareFileExtensionsUpper('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true)
		expect(compareFileExtensionsUpper('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true)
		expect(compareFileExtensionsUpper('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first').toBe(true)
		expect(compareFileExtensionsUpper('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name').toBe(true)
		expect(compareFileExtensionsUpper('a.MD', 'a.md') === compareLocale('MD', 'md'), 'case differences in extensions sort by locale').toBe(true)
		expect(compareFileExtensionsUpper('aggregate.go', 'aggregate_repo.go') > 0, 'when extensions are equal, compares the full filename').toBe(true)

		// dotfile comparisons
		expect(compareFileExtensionsUpper('.abc', '.abc') === 0, 'equal dotfiles should be equal').toBe(true)
		expect(compareFileExtensionsUpper('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case').toBe(true)
		expect(compareFileExtensionsUpper('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true)
		expect(compareFileExtensionsUpper('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileExtensionsUpper(null, '.abc') < 0, 'null should come before dotfiles').toBe(true)
		expect(compareFileExtensionsUpper('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true)
		expect(compareFileExtensionsUpper('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true)
		expect(compareFileExtensionsUpper('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true)
		expect(compareFileExtensionsUpper('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true)

		// numeric comparisons
		expect(compareFileExtensionsUpper('1', '1') === 0, 'numerically equal full names should be equal').toBe(true)
		expect(compareFileExtensionsUpper('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true)
		expect(compareFileExtensionsUpper('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsUpper('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order').toBe(true)
		expect(compareFileExtensionsUpper('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true)
		expect(compareFileExtensionsUpper('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true)
		expect(compareFileExtensionsUpper('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsUpper('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal').toBe(true)
		expect(compareFileExtensionsUpper('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsUpper('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long').toBe(true)
		expect(compareFileExtensionsUpper('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared').toBe(true)
		expect(compareFileExtensionsUpper('abc.txt01', 'abc.txt1') > 0, 'extensions with equal numbers should be in shortest-first order').toBe(true)
		expect(compareFileExtensionsUpper('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest string first').toBe(true)
		expect(compareFileExtensionsUpper('txt.abc01', 'txt.abc1') > 0, 'extensions with equivalent numbers sort shortest extension first').toBe(true)
		expect(compareFileExtensionsUpper('a.ext1', 'b.Ext1') < 0, 'different names and extensions that are equal except for case are sorted in full filename order').toBe(true)
		expect(compareFileExtensionsUpper('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'b.Ext1'), 'same names and extensions that are equal except for case are sorted in full filename locale order').toBe(true)

		//
		// Comparisons with different results than compareFileExtensionsDefault
		//

		// name-only comparisons
		expect(compareFileExtensionsUpper('Z', 'a') < 0, 'Z comes before a').toBe(true)
		expect(compareFileExtensionsUpper('a', 'A') > 0, 'the same letter sorts uppercase first').toBe(true)
		expect(compareFileExtensionsUpper('â', 'Â') > 0, 'the same accented letter sorts uppercase first').toBe(true)
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensionsUpper), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase names first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsUpper), ['Email', 'Émail', 'email', 'émail'], 'the same base characters with different case or accents sort uppercase names first');

		// name plus extension comparisons
		expect(compareFileExtensionsUpper('a.md', 'A.md') > 0, 'case differences in names sort uppercase first').toBe(true)
		expect(compareFileExtensionsUpper('art01', 'Art01') > 0, 'a numerically equivalent word of a different case sorts uppercase first').toBe(true)
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsUpper), ['A2.txt', 'A100.txt', 'a10.txt', 'a20.txt',], 'filenames with number and case differences group by case then sort by number');

	});

	test('compareFileNamesLower', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNamesLower(null, null) === 0, 'null should be equal').toBe(true)
		expect(compareFileNamesLower(null, 'abc') < 0, 'null should be come before real values').toBe(true)
		expect(compareFileNamesLower('', '') === 0, 'empty should be equal').toBe(true)
		expect(compareFileNamesLower('abc', 'abc') === 0, 'equal names should be equal').toBe(true)
		expect(compareFileNamesLower('Z', 'a') > 0, 'Z comes after a').toBe(true)

		// name plus extension comparisons
		expect(compareFileNamesLower('file.ext', 'file.ext') === 0, 'equal full names should be equal').toBe(true)
		expect(compareFileNamesLower('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true)
		expect(compareFileNamesLower('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true)
		expect(compareFileNamesLower('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently').toBe(true)
		expect(compareFileNamesLower('aggregate.go', 'aggregate_repo.go') > 0, 'compares full filenames').toBe(true)

		// dotfile comparisons
		expect(compareFileNamesLower('.abc', '.abc') === 0, 'equal dotfile names should be equal').toBe(true)
		expect(compareFileNamesLower('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly').toBe(true)
		expect(compareFileNamesLower('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true)
		expect(compareFileNamesLower('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true)
		expect(compareFileNamesLower('.aaa_env', '.aaa.env') < 0, 'an underscore in a dotfile name will sort before a dot').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileNamesLower(null, '.abc') < 0, 'null should come before dotfiles').toBe(true)
		expect(compareFileNamesLower('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true)
		expect(compareFileNamesLower('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true)
		expect(compareFileNamesLower('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true)
		expect(compareFileNamesLower('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true)

		// numeric comparisons
		expect(compareFileNamesLower('1', '1') === 0, 'numerically equal full names should be equal').toBe(true)
		expect(compareFileNamesLower('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true)
		expect(compareFileNamesLower('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileNamesLower('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order even when they are multiple digits long').toBe(true)
		expect(compareFileNamesLower('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true)
		expect(compareFileNamesLower('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true)
		expect(compareFileNamesLower('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest number first').toBe(true)
		expect(compareFileNamesLower('abc.txt1', 'abc.txt01') < 0, 'same name plus extensions with equal numbers sort shortest number first').toBe(true)
		expect(compareFileNamesLower('a.ext1', 'b.Ext1') < 0, 'different names and extensions that are equal except for case are sorted in full filename order').toBe(true)
		expect(compareFileNamesLower('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'b.Ext1'), 'same names and extensions that are equal except for case are sorted in full filename locale order').toBe(true)

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNamesLower('z', 'A') < 0, 'z comes before A').toBe(true)
		expect(compareFileNamesLower('a', 'A') < 0, 'the same letter sorts lowercase first').toBe(true)
		expect(compareFileNamesLower('â', 'Â') < 0, 'the same accented letter sorts lowercase first').toBe(true)
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNamesLower), ['art', 'artichoke', 'Art', 'Artichoke'], 'names with the same root and different cases sort lowercase first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesLower), ['email', 'émail', 'Email', 'Émail'], 'the same base characters with different case or accents sort lowercase first');

		// numeric comparisons
		expect(compareFileNamesLower('art01', 'Art01') < 0, 'a numerically equivalent name of a different case compares lowercase first').toBe(true)
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesLower), ['a10.txt', 'a20.txt', 'A2.txt', 'A100.txt'], 'filenames with number and case differences group by case then compare by number');

	});

	test('compareFileExtensionsLower', () => {

		//
		// Comparisons with the same result as compareFileExtensionsDefault
		//

		// name-only comparisons
		expect(compareFileExtensionsLower(null, null) === 0, 'null should be equal').toBe(true)
		expect(compareFileExtensionsLower(null, 'abc') < 0, 'null should come before real files without extensions').toBe(true)
		expect(compareFileExtensionsLower('', '') === 0, 'empty should be equal').toBe(true)
		expect(compareFileExtensionsLower('abc', 'abc') === 0, 'equal names should be equal').toBe(true)
		expect(compareFileExtensionsLower('Z', 'a') > 0, 'Z comes after a').toBe(true)

		// name plus extension comparisons
		expect(compareFileExtensionsLower('file.ext', 'file.ext') === 0, 'equal full filenames should be equal').toBe(true)
		expect(compareFileExtensionsLower('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true)
		expect(compareFileExtensionsLower('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true)
		expect(compareFileExtensionsLower('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first').toBe(true)
		expect(compareFileExtensionsLower('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name').toBe(true)
		expect(compareFileExtensionsLower('a.MD', 'a.md') === compareLocale('MD', 'md'), 'case differences in extensions sort by locale').toBe(true)

		// dotfile comparisons
		expect(compareFileExtensionsLower('.abc', '.abc') === 0, 'equal dotfiles should be equal').toBe(true)
		expect(compareFileExtensionsLower('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case').toBe(true)
		expect(compareFileExtensionsLower('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true)
		expect(compareFileExtensionsLower('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileExtensionsLower(null, '.abc') < 0, 'null should come before dotfiles').toBe(true)
		expect(compareFileExtensionsLower('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true)
		expect(compareFileExtensionsLower('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true)
		expect(compareFileExtensionsLower('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true)
		expect(compareFileExtensionsLower('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true)

		// numeric comparisons
		expect(compareFileExtensionsLower('1', '1') === 0, 'numerically equal full names should be equal').toBe(true)
		expect(compareFileExtensionsLower('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true)
		expect(compareFileExtensionsLower('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsLower('abc2.txt', 'abc10.txt') < 0, 'filenames with numbers should be in numerical order').toBe(true)
		expect(compareFileExtensionsLower('abc02.txt', 'abc010.txt') < 0, 'filenames with numbers that have leading zeros sort numerically').toBe(true)
		expect(compareFileExtensionsLower('abc1.10.txt', 'abc1.2.txt') > 0, 'numbers with dots between them are treated as two separate numbers, not one decimal number').toBe(true)
		expect(compareFileExtensionsLower('abc2.txt2', 'abc1.txt10') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsLower('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal').toBe(true)
		expect(compareFileExtensionsLower('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsLower('txt.abc2', 'txt.abc10') < 0, 'extensions with numbers should be in numerical order even when they are multiple digits long').toBe(true)
		expect(compareFileExtensionsLower('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared').toBe(true)
		expect(compareFileExtensionsLower('abc.txt01', 'abc.txt1') > 0, 'extensions with equal numbers should be in shortest-first order').toBe(true)
		expect(compareFileExtensionsLower('abc02.txt', 'abc002.txt') < 0, 'filenames with equivalent numbers and leading zeros sort shortest string first').toBe(true)
		expect(compareFileExtensionsLower('txt.abc01', 'txt.abc1') > 0, 'extensions with equivalent numbers sort shortest extension first').toBe(true)
		expect(compareFileExtensionsLower('a.ext1', 'b.Ext1') < 0, 'if extensions with numbers are equal except for case, full filenames should be compared').toBe(true)
		expect(compareFileExtensionsLower('a.ext1', 'a.Ext1') === compareLocale('a.ext1', 'a.Ext1'), 'if extensions with numbers are equal except for case, filenames are sorted in locale order').toBe(true)

		//
		// Comparisons with different results than compareFileExtensionsDefault
		//

		// name-only comparisons
		expect(compareFileExtensionsLower('z', 'A') < 0, 'z comes before A').toBe(true)
		expect(compareFileExtensionsLower('a', 'A') < 0, 'the same letter sorts lowercase first').toBe(true)
		expect(compareFileExtensionsLower('â', 'Â') < 0, 'the same accented letter sorts lowercase first').toBe(true)
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensionsLower), ['art', 'artichoke', 'Art', 'Artichoke'], 'names with the same root and different cases sort lowercase names first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsLower), ['email', 'émail', 'Email', 'Émail'], 'the same base characters with different case or accents sort lowercase names first');

		// name plus extension comparisons
		expect(compareFileExtensionsLower('a.md', 'A.md') < 0, 'case differences in names sort lowercase first').toBe(true)
		expect(compareFileExtensionsLower('art01', 'Art01') < 0, 'a numerically equivalent word of a different case sorts lowercase first').toBe(true)
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsLower), ['a10.txt', 'a20.txt', 'A2.txt', 'A100.txt'], 'filenames with number and case differences group by case then sort by number');
		expect(compareFileExtensionsLower('aggregate.go', 'aggregate_repo.go') > 0, 'when extensions are equal, compares full filenames').toBe(true)

	});

	test('compareFileNamesUnicode', () => {

		//
		// Comparisons with the same results as compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNamesUnicode(null, null) === 0, 'null should be equal').toBe(true)
		expect(compareFileNamesUnicode(null, 'abc') < 0, 'null should be come before real values').toBe(true)
		expect(compareFileNamesUnicode('', '') === 0, 'empty should be equal').toBe(true)
		expect(compareFileNamesUnicode('abc', 'abc') === 0, 'equal names should be equal').toBe(true)
		expect(compareFileNamesUnicode('z', 'A') > 0, 'z comes after A').toBe(true)

		// name plus extension comparisons
		expect(compareFileNamesUnicode('file.ext', 'file.ext') === 0, 'equal full names should be equal').toBe(true)
		expect(compareFileNamesUnicode('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true)
		expect(compareFileNamesUnicode('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true)
		expect(compareFileNamesUnicode('bbb.aaa', 'aaa.bbb') > 0, 'files should be compared by names even if extensions compare differently').toBe(true)

		// dotfile comparisons
		expect(compareFileNamesUnicode('.abc', '.abc') === 0, 'equal dotfile names should be equal').toBe(true)
		expect(compareFileNamesUnicode('.env.', '.gitattributes') < 0, 'filenames starting with dots and with extensions should still sort properly').toBe(true)
		expect(compareFileNamesUnicode('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true)
		expect(compareFileNamesUnicode('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileNamesUnicode(null, '.abc') < 0, 'null should come before dotfiles').toBe(true)
		expect(compareFileNamesUnicode('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true)
		expect(compareFileNamesUnicode('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true)
		expect(compareFileNamesUnicode('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true)
		expect(compareFileNamesUnicode('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true)

		// numeric comparisons
		expect(compareFileNamesUnicode('1', '1') === 0, 'numerically equal full names should be equal').toBe(true)
		expect(compareFileNamesUnicode('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true)
		expect(compareFileNamesUnicode('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileNamesUnicode('a.ext1', 'b.Ext1') < 0, 'if names are different and extensions with numbers are equal except for case, filenames are sorted by unicode full filename').toBe(true)
		expect(compareFileNamesUnicode('a.ext1', 'a.Ext1') > 0, 'if names are equal and extensions with numbers are equal except for case, filenames are sorted by unicode full filename').toBe(true)

		//
		// Comparisons with different results than compareFileNamesDefault
		//

		// name-only comparisons
		expect(compareFileNamesUnicode('Z', 'a') < 0, 'Z comes before a').toBe(true)
		expect(compareFileNamesUnicode('a', 'A') > 0, 'the same letter sorts uppercase first').toBe(true)
		expect(compareFileNamesUnicode('â', 'Â') > 0, 'the same accented letter sorts uppercase first').toBe(true)
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileNamesUnicode), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileNamesUnicode), ['Email', 'email', 'Émail', 'émail'], 'the same base characters with different case or accents sort in unicode order');

		// name plus extension comparisons
		expect(compareFileNamesUnicode('aggregate.go', 'aggregate_repo.go') < 0, 'compares the whole name in unicode order, but dot comes before underscore').toBe(true)

		// dotfile comparisons
		expect(compareFileNamesUnicode('.aaa_env', '.aaa.env') > 0, 'an underscore in a dotfile name will sort after a dot').toBe(true)

		// numeric comparisons
		expect(compareFileNamesUnicode('abc2.txt', 'abc10.txt') > 0, 'filenames with numbers should be in unicode order even when they are multiple digits long').toBe(true)
		expect(compareFileNamesUnicode('abc02.txt', 'abc010.txt') > 0, 'filenames with numbers that have leading zeros sort in unicode order').toBe(true)
		expect(compareFileNamesUnicode('abc1.10.txt', 'abc1.2.txt') < 0, 'numbers with dots between them are sorted in unicode order').toBe(true)
		expect(compareFileNamesUnicode('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order').toBe(true)
		expect(compareFileNamesUnicode('abc.txt1', 'abc.txt01') > 0, 'same name plus extensions with equal numbers sort in unicode order').toBe(true)
		expect(compareFileNamesUnicode('art01', 'Art01') > 0, 'a numerically equivalent name of a different case compares uppercase first').toBe(true)
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileNamesUnicode), ['A100.txt', 'A2.txt', 'a10.txt', 'a20.txt'], 'filenames with number and case differences sort in unicode order');

	});

	test('compareFileExtensionsUnicode', () => {

		//
		// Comparisons with the same result as compareFileExtensionsDefault
		//

		// name-only comparisons
		expect(compareFileExtensionsUnicode(null, null) === 0, 'null should be equal').toBe(true)
		expect(compareFileExtensionsUnicode(null, 'abc') < 0, 'null should come before real files without extensions').toBe(true)
		expect(compareFileExtensionsUnicode('', '') === 0, 'empty should be equal').toBe(true)
		expect(compareFileExtensionsUnicode('abc', 'abc') === 0, 'equal names should be equal').toBe(true)
		expect(compareFileExtensionsUnicode('z', 'A') > 0, 'z comes after A').toBe(true)

		// name plus extension comparisons
		expect(compareFileExtensionsUnicode('file.ext', 'file.ext') === 0, 'equal full filenames should be equal').toBe(true)
		expect(compareFileExtensionsUnicode('a.ext', 'b.ext') < 0, 'if equal extensions, filenames should be compared').toBe(true)
		expect(compareFileExtensionsUnicode('file.aaa', 'file.bbb') < 0, 'files with equal names should be compared by extensions').toBe(true)
		expect(compareFileExtensionsUnicode('bbb.aaa', 'aaa.bbb') < 0, 'files should be compared by extension first').toBe(true)
		expect(compareFileExtensionsUnicode('a.md', 'b.MD') < 0, 'when extensions are the same except for case, the files sort by name').toBe(true)
		expect(compareFileExtensionsUnicode('a.MD', 'a.md') < 0, 'case differences in extensions sort in unicode order').toBe(true)

		// dotfile comparisons
		expect(compareFileExtensionsUnicode('.abc', '.abc') === 0, 'equal dotfiles should be equal').toBe(true)
		expect(compareFileExtensionsUnicode('.md', '.Gitattributes') > 0, 'dotfiles sort alphabetically regardless of case').toBe(true)
		expect(compareFileExtensionsUnicode('.env', '.aaa.env') > 0, 'dotfiles sort alphabetically when they contain multiple dots').toBe(true)
		expect(compareFileExtensionsUnicode('.env', '.env.aaa') < 0, 'dotfiles with the same root sort shortest first').toBe(true)

		// dotfile vs non-dotfile comparisons
		expect(compareFileExtensionsUnicode(null, '.abc') < 0, 'null should come before dotfiles').toBe(true)
		expect(compareFileExtensionsUnicode('.env', 'aaa.env') < 0, 'dotfiles come before filenames with extensions').toBe(true)
		expect(compareFileExtensionsUnicode('.MD', 'a.md') < 0, 'dotfiles sort before lowercase files').toBe(true)
		expect(compareFileExtensionsUnicode('.env', 'aaa') < 0, 'dotfiles come before filenames without extensions').toBe(true)
		expect(compareFileExtensionsUnicode('.md', 'A.MD') < 0, 'dotfiles sort before uppercase files').toBe(true)

		// numeric comparisons
		expect(compareFileExtensionsUnicode('1', '1') === 0, 'numerically equal full names should be equal').toBe(true)
		expect(compareFileExtensionsUnicode('abc1.txt', 'abc1.txt') === 0, 'equal filenames with numbers should be equal').toBe(true)
		expect(compareFileExtensionsUnicode('abc1.txt', 'abc2.txt') < 0, 'filenames with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsUnicode('txt.abc1', 'txt.abc1') === 0, 'equal extensions with numbers should be equal').toBe(true)
		expect(compareFileExtensionsUnicode('txt.abc1', 'txt.abc2') < 0, 'extensions with numbers should be in numerical order, not alphabetical order').toBe(true)
		expect(compareFileExtensionsUnicode('a.ext1', 'b.ext1') < 0, 'if equal extensions with numbers, full filenames should be compared').toBe(true)

		//
		// Comparisons with different results than compareFileExtensionsDefault
		//

		// name-only comparisons
		expect(compareFileExtensionsUnicode('Z', 'a') < 0, 'Z comes before a').toBe(true)
		expect(compareFileExtensionsUnicode('a', 'A') > 0, 'the same letter sorts uppercase first').toBe(true)
		expect(compareFileExtensionsUnicode('â', 'Â') > 0, 'the same accented letter sorts uppercase first').toBe(true)
		assert.deepStrictEqual(['artichoke', 'Artichoke', 'art', 'Art'].sort(compareFileExtensionsUnicode), ['Art', 'Artichoke', 'art', 'artichoke'], 'names with the same root and different cases sort uppercase names first');
		assert.deepStrictEqual(['email', 'Email', 'émail', 'Émail'].sort(compareFileExtensionsUnicode), ['Email', 'email', 'Émail', 'émail'], 'the same base characters with different case or accents sort in unicode order');

		// name plus extension comparisons
		expect(compareFileExtensionsUnicode('a.MD', 'a.md') < 0, 'case differences in extensions sort by uppercase extension first').toBe(true)
		expect(compareFileExtensionsUnicode('a.md', 'A.md') > 0, 'case differences in names sort uppercase first').toBe(true)
		expect(compareFileExtensionsUnicode('art01', 'Art01') > 0, 'a numerically equivalent name of a different case sorts uppercase first').toBe(true)
		assert.deepStrictEqual(['a10.txt', 'A2.txt', 'A100.txt', 'a20.txt'].sort(compareFileExtensionsUnicode), ['A100.txt', 'A2.txt', 'a10.txt', 'a20.txt'], 'filenames with number and case differences sort in unicode order');
		expect(compareFileExtensionsUnicode('aggregate.go', 'aggregate_repo.go') < 0, 'when extensions are equal, compares full filenames in unicode order').toBe(true)

		// numeric comparisons
		expect(compareFileExtensionsUnicode('abc2.txt', 'abc10.txt') > 0, 'filenames with numbers should be in unicode order').toBe(true)
		expect(compareFileExtensionsUnicode('abc02.txt', 'abc010.txt') > 0, 'filenames with numbers that have leading zeros sort in unicode order').toBe(true)
		expect(compareFileExtensionsUnicode('abc1.10.txt', 'abc1.2.txt') < 0, 'numbers with dots between them sort in unicode order').toBe(true)
		expect(compareFileExtensionsUnicode('abc2.txt2', 'abc1.txt10') > 0, 'extensions with numbers should be in unicode order').toBe(true)
		expect(compareFileExtensionsUnicode('txt.abc2', 'txt.abc10') > 0, 'extensions with numbers should be in unicode order even when they are multiple digits long').toBe(true)
		expect(compareFileExtensionsUnicode('abc.txt01', 'abc.txt1') < 0, 'extensions with equal numbers should be in unicode order').toBe(true)
		expect(compareFileExtensionsUnicode('abc02.txt', 'abc002.txt') > 0, 'filenames with equivalent numbers and leading zeros sort in unicode order').toBe(true)
		expect(compareFileExtensionsUnicode('txt.abc01', 'txt.abc1') < 0, 'extensions with equivalent numbers sort in unicode order').toBe(true)
		expect(compareFileExtensionsUnicode('a.ext1', 'b.Ext1') < 0, 'if extensions with numbers are equal except for case, unicode full filenames should be compared').toBe(true)
		expect(compareFileExtensionsUnicode('a.ext1', 'a.Ext1') > 0, 'if extensions with numbers are equal except for case, unicode full filenames should be compared').toBe(true)

	});

});
