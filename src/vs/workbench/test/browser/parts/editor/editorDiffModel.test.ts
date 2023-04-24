/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { URI } from 'vs/base/common/uri';
import { ITextModel } from 'vs/editor/common/model';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { DiffEditorInput } from 'vs/workbench/common/editor/diffEditorInput';
import { TextDiffEditorModel } from 'vs/workbench/common/editor/textDiffEditorModel';
import { TextResourceEditorInput } from 'vs/workbench/common/editor/textResourceEditorInput';
import { TestServiceAccessor, workbenchInstantiationService } from 'vs/workbench/test/browser/workbenchTestServices';

describe('TextDiffEditorModel', () => {

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

	test('basics', async () => {
		const dispose = accessor.textModelResolverService.registerTextModelContentProvider('test', {
			provideTextContent: async function (resource: URI): Promise<ITextModel | null> {
				if (resource.scheme === 'test') {
					const modelContent = 'Hello Test';
					const languageSelection = accessor.languageService.createById('json');

					return accessor.modelService.createModel(modelContent, languageSelection, resource);
				}

				return null;
			}
		});

		const input = instantiationService.createInstance(TextResourceEditorInput, URI.from({ scheme: 'test', authority: null!, path: 'thePath' }), 'name', 'description', undefined, undefined);
		const otherInput = instantiationService.createInstance(TextResourceEditorInput, URI.from({ scheme: 'test', authority: null!, path: 'thePath' }), 'name2', 'description', undefined, undefined);
		const diffInput = instantiationService.createInstance(DiffEditorInput, 'name', 'description', input, otherInput, undefined);

		let model = await diffInput.resolve() as TextDiffEditorModel;

		assert(model);
		assert(model instanceof TextDiffEditorModel);

		const diffEditorModel = model.textDiffEditorModel!;
		assert(diffEditorModel.original);
		assert(diffEditorModel.modified);

		model = await diffInput.resolve() as TextDiffEditorModel;
		assert(model.isResolved());

		assert(diffEditorModel !== model.textDiffEditorModel);
		diffInput.dispose();
		assert(!model.textDiffEditorModel);

		dispose.dispose();
	});
});
