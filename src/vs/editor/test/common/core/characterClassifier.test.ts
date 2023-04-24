/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { CharCode } from 'vs/base/common/charCode';
import { CharacterClassifier } from 'vs/editor/common/core/characterClassifier';

describe('CharacterClassifier', () => {

	test('works', () => {
		const classifier = new CharacterClassifier<number>(0);

		expect(classifier.get(-1)).toStrictEqual(0)
		expect(classifier.get(0)).toStrictEqual(0)
		expect(classifier.get(CharCode.a)).toStrictEqual(0)
		expect(classifier.get(CharCode.b)).toStrictEqual(0)
		expect(classifier.get(CharCode.z)).toStrictEqual(0)
		expect(classifier.get(255)).toStrictEqual(0)
		expect(classifier.get(1000)).toStrictEqual(0)
		expect(classifier.get(2000)).toStrictEqual(0)

		classifier.set(CharCode.a, 1);
		classifier.set(CharCode.z, 2);
		classifier.set(1000, 3);

		expect(classifier.get(-1)).toStrictEqual(0)
		expect(classifier.get(0)).toStrictEqual(0)
		expect(classifier.get(CharCode.a)).toStrictEqual(1)
		expect(classifier.get(CharCode.b)).toStrictEqual(0)
		expect(classifier.get(CharCode.z)).toStrictEqual(2)
		expect(classifier.get(255)).toStrictEqual(0)
		expect(classifier.get(1000)).toStrictEqual(3)
		expect(classifier.get(2000)).toStrictEqual(0)
	});

});
