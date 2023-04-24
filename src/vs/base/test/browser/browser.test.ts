/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { isMacintosh, isWindows } from 'vs/base/common/platform';

describe('Browsers', () => {
	test('all', () => {
		expect(!(isWindows && isMacintosh)).toBe(true);
	});
});
