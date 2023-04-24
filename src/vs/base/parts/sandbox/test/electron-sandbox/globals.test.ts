/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { context, ipcRenderer, process, webFrame } from 'vs/base/parts/sandbox/electron-sandbox/globals';

describe('Sandbox', () => {
  // this will fail
	test('globals', async () => {
		expect(typeof ipcRenderer.send === 'function').toBe(true);
		expect(typeof webFrame.setZoomLevel === 'function').toBe(true);
		expect(typeof process.platform === 'string').toBe(true);

		const config = await context.resolveConfiguration();
		expect(config).toBe(true);
		expect(context.configuration()).toBe(true);
	});
});
