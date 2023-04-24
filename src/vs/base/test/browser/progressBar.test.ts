/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ProgressBar } from 'vs/base/browser/ui/progressbar/progressbar';

describe('ProgressBar', () => {
	let fixture: HTMLElement;

	beforeEach(() => {
		fixture = document.createElement('div');
		document.body.appendChild(fixture);
	});

	afterEach(() => {
		document.body.removeChild(fixture);
	});

	test('Progress Bar', function () {
		const bar = new ProgressBar(fixture);
		expect(bar.infinite()).toBeTruthy()
		expect(bar.total(100)).toBeTruthy()
		expect(bar.worked(50)).toBeTruthy()
		expect(bar.setWorked(70)).toBeTruthy()
		expect(bar.worked(30)).toBeTruthy()
		expect(bar.done()).toBeTruthy()

		bar.dispose();
	});
});
