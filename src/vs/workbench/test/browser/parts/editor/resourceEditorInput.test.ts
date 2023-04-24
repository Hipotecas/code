/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { URI } from 'vs/base/common/uri';
import { IFileService } from 'vs/platform/files/common/files';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ILabelService } from 'vs/platform/label/common/label';
import { EditorInputCapabilities, Verbosity } from 'vs/workbench/common/editor';
import { AbstractResourceEditorInput } from 'vs/workbench/common/editor/resourceEditorInput';
import { workbenchInstantiationService } from 'vs/workbench/test/browser/workbenchTestServices';

describe('ResourceEditorInput', () => {

	let disposables: DisposableStore;
	let instantiationService: IInstantiationService;

	class TestResourceEditorInput extends AbstractResourceEditorInput {

		readonly typeId = 'test.typeId';

		constructor(
			resource: URI,
			@ILabelService labelService: ILabelService,
			@IFileService fileService: IFileService
		) {
			super(resource, resource, labelService, fileService);
		}
	}

	beforeEach(() => {
		disposables = new DisposableStore();
		instantiationService = workbenchInstantiationService(undefined, disposables);
	});

	afterEach(() => {
		disposables.dispose();
	});

	test('basics', async () => {
		const resource = URI.from({ scheme: 'testResource', path: 'thePath/of/the/resource.txt' });

		const input = instantiationService.createInstance(TestResourceEditorInput, resource);

		assert.ok(input.getName().length > 0);

		assert.ok(input.getDescription(Verbosity.SHORT)!.length > 0);
		assert.ok(input.getDescription(Verbosity.MEDIUM)!.length > 0);
		assert.ok(input.getDescription(Verbosity.LONG)!.length > 0);

		assert.ok(input.getTitle(Verbosity.SHORT).length > 0);
		assert.ok(input.getTitle(Verbosity.MEDIUM).length > 0);
		assert.ok(input.getTitle(Verbosity.LONG).length > 0);

		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Readonly), false);
		assert.strictEqual(input.hasCapability(EditorInputCapabilities.Untitled), true);
	});
});
