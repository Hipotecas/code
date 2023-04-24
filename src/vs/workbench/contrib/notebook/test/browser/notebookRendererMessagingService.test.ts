/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { stub } from 'sinon';
import { timeout } from 'vs/base/common/async';
import { NotebookRendererMessagingService } from 'vs/workbench/contrib/notebook/browser/services/notebookRendererMessagingServiceImpl';
import { NullExtensionService } from 'vs/workbench/services/extensions/common/extensions';

describe('NotebookRendererMessaging', () => {
	let extService: NullExtensionService;
	let m: NotebookRendererMessagingService;
	let sent: unknown[] = [];

	beforeEach(() => {
		sent = [];
		extService = new NullExtensionService();
		m = new NotebookRendererMessagingService(extService);
		m.onShouldPostMessage(e => sent.push(e));
	});

	test('activates on prepare', () => {
		const activate = stub(extService, 'activateByEvent').returns(Promise.resolve());
		m.prepare('foo');
		m.prepare('foo');
		m.prepare('foo');

		assert.deepStrictEqual(activate.args, [['onRenderer:foo']]);
	});

	test('buffers and then plays events', async () => {
		stub(extService, 'activateByEvent').returns(Promise.resolve());

		const scoped = m.getScoped('some-editor');
		scoped.postMessage('foo', 1);
		scoped.postMessage('foo', 2);
		assert.deepStrictEqual(sent, []);

		await timeout(0);

		const expected = [
			{ editorId: 'some-editor', rendererId: 'foo', message: 1 },
			{ editorId: 'some-editor', rendererId: 'foo', message: 2 }
		];

		assert.deepStrictEqual(sent, expected);

		scoped.postMessage('foo', 3);

		assert.deepStrictEqual(sent, [
			...expected,
			{ editorId: 'some-editor', rendererId: 'foo', message: 3 }
		]);
	});
});
