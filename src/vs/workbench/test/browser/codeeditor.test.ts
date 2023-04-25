/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { DisposableStore } from 'vs/base/common/lifecycle';
import { URI } from 'vs/base/common/uri';
import { CoreNavigationCommands } from 'vs/editor/browser/coreCommands';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { Position } from 'vs/editor/common/core/position';
import { IRange, Range } from 'vs/editor/common/core/range';
import { ILanguageService } from 'vs/editor/common/languages/language';
import { TextModel } from 'vs/editor/common/model/textModel';
import { LanguageService } from 'vs/editor/common/services/languageService';
import { IModelService } from 'vs/editor/common/services/model';
import { ModelService } from 'vs/editor/common/services/modelService';
import { createTestCodeEditor } from 'vs/editor/test/browser/testCodeEditor';
import { createTextModel } from 'vs/editor/test/common/testTextModel';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { TestConfigurationService } from 'vs/platform/configuration/test/common/testConfigurationService';
import { TestInstantiationService } from 'vs/platform/instantiation/test/common/instantiationServiceMock';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { TestThemeService } from 'vs/platform/theme/test/common/testThemeService';
import { RangeHighlightDecorations } from 'vs/workbench/browser/codeeditor';
import { IEditorService } from 'vs/workbench/services/editor/common/editorService';
import { TestEditorService, workbenchInstantiationService } from 'vs/workbench/test/browser/workbenchTestServices';
// error
describe('Editor - Range decorations', () => {

	let disposables: DisposableStore;
	let instantiationService: TestInstantiationService;
	let codeEditor: ICodeEditor;
	let model: TextModel;
	let text: string;
	let testObject: RangeHighlightDecorations;
	const modelsToDispose: TextModel[] = [];

	beforeEach(() => {
		disposables = new DisposableStore();
		instantiationService = <TestInstantiationService>workbenchInstantiationService(undefined, disposables);
		instantiationService.stub(IEditorService, new TestEditorService());
		instantiationService.stub(ILanguageService, LanguageService);
		instantiationService.stub(IModelService, stubModelService(instantiationService));
		text = 'LINE1' + '\n' + 'LINE2' + '\n' + 'LINE3' + '\n' + 'LINE4' + '\r\n' + 'LINE5';
		model = aModel(URI.file('some_file'));
		codeEditor = createTestCodeEditor(model);

		instantiationService.stub(IEditorService, 'activeEditor', { get resource() { return codeEditor.getModel()!.uri; } });
		instantiationService.stub(IEditorService, 'activeTextEditorControl', codeEditor);

		testObject = instantiationService.createInstance(RangeHighlightDecorations);
	});

	afterEach(() => {
		codeEditor.dispose();
		modelsToDispose.forEach(model => model.dispose());
		disposables.dispose();
	});

	test('highlight range for the resource if it is an active editor', function () {
		const range: IRange = new Range(1, 1, 1, 1);
		testObject.highlightRange({ resource: model.uri, range });

		const actuals = rangeHighlightDecorations(model);

		assert.deepStrictEqual(actuals, [range]);
	});

	test('remove highlight range', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		testObject.removeHighlightRange();

		const actuals = rangeHighlightDecorations(model);

		assert.deepStrictEqual(actuals, []);
	});

	test('highlight range for the resource removes previous highlight', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		const range: IRange = new Range(2, 2, 4, 3);
		testObject.highlightRange({ resource: model.uri, range });

		const actuals = rangeHighlightDecorations(model);

		assert.deepStrictEqual(actuals, [range]);
	});

	test('highlight range for a new resource removes highlight of previous resource', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });

		const anotherModel = prepareActiveEditor('anotherModel');
		const range: IRange = new Range(2, 2, 4, 3);
		testObject.highlightRange({ resource: anotherModel.uri, range });

		let actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
		actuals = rangeHighlightDecorations(anotherModel);
		assert.deepStrictEqual(actuals, [range]);
	});

	test('highlight is removed on model change', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		prepareActiveEditor('anotherModel');

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
	});

	test('highlight is removed on cursor position change', function () {
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });
		codeEditor.trigger('mouse', CoreNavigationCommands.MoveTo.id, {
			position: new Position(2, 1)
		});

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
	});

	test('range is not highlight if not active editor', function () {
		const model = aModel(URI.file('some model'));
		testObject.highlightRange({ resource: model.uri, range: { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 } });

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, []);
	});

	test('previous highlight is not removed if not active editor', function () {
		const range = new Range(1, 1, 1, 1);
		testObject.highlightRange({ resource: model.uri, range });

		const model1 = aModel(URI.file('some model'));
		testObject.highlightRange({ resource: model1.uri, range: { startLineNumber: 2, startColumn: 1, endLineNumber: 2, endColumn: 1 } });

		const actuals = rangeHighlightDecorations(model);
		assert.deepStrictEqual(actuals, [range]);
	});

	function prepareActiveEditor(resource: string): TextModel {
		const model = aModel(URI.file(resource));
		codeEditor.setModel(model);
		return model;
	}

	function aModel(resource: URI, content: string = text): TextModel {
		const model = createTextModel(content, undefined, undefined, resource);
		modelsToDispose.push(model);
		return model;
	}

	function rangeHighlightDecorations(m: TextModel): IRange[] {
		const rangeHighlights: IRange[] = [];

		for (const dec of m.getAllDecorations()) {
			if (dec.options.className === 'rangeHighlight') {
				rangeHighlights.push(dec.range);
			}
		}

		rangeHighlights.sort(Range.compareRangesUsingStarts);
		return rangeHighlights;
	}

	function stubModelService(instantiationService: TestInstantiationService): IModelService {
		instantiationService.stub(IConfigurationService, new TestConfigurationService());
		instantiationService.stub(IThemeService, new TestThemeService());
		return instantiationService.createInstance(ModelService);
	}
});
