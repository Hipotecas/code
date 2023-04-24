/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { URI } from 'vs/base/common/uri';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { TextFileContentProvider } from 'vs/workbench/contrib/files/common/files';
import { snapshotToString } from 'vs/workbench/services/textfile/common/textfiles';
import { TestServiceAccessor, workbenchInstantiationService } from 'vs/workbench/test/browser/workbenchTestServices';

describe('Files - FileOnDiskContentProvider', () => {

	let disposables: DisposableStore;
	let instantiationService: IInstantiationService;
	let accessor: TestServiceAccessor;

	beforeEach(() => {
		disposables = new DisposableStore();
		instantiationService = workbenchInstantiationService(undefined, disposables);
		accessor = instantiationService.createInstance(TestServiceAccessor);
	});

	afterEach(() => {
		disposables.dispose();
	});

	test('provideTextContent', async () => {
		const provider = instantiationService.createInstance(TextFileContentProvider);
		const uri = URI.parse('testFileOnDiskContentProvider://foo');

		const content = await provider.provideTextContent(uri.with({ scheme: 'conflictResolution', query: JSON.stringify({ scheme: uri.scheme }) }));

		assert.ok(content);
		assert.strictEqual(snapshotToString(content!.createSnapshot()), 'Hello Html');
		assert.strictEqual(accessor.fileService.getLastReadFileUri().scheme, uri.scheme);
		assert.strictEqual(accessor.fileService.getLastReadFileUri().path, uri.path);
	});
});
