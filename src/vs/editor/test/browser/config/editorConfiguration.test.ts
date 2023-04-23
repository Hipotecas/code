/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { describe, test, expect } from 'vitest'
import { IEnvConfiguration } from 'vs/editor/browser/config/editorConfiguration';
import { migrateOptions } from 'vs/editor/browser/config/migrateOptions';
import { ConfigurationChangedEvent, EditorOption, IEditorHoverOptions, IQuickSuggestionsOptions } from 'vs/editor/common/config/editorOptions';
import { EditorZoom } from 'vs/editor/common/config/editorZoom';
import { TestConfiguration } from 'vs/editor/test/browser/config/testConfiguration';
import { AccessibilitySupport } from 'vs/platform/accessibility/common/accessibility';

describe('Common Editor Config', () => {
	test('Zoom Level', () => {

		//Zoom levels are defined to go between -5, 20 inclusive
		const zoom = EditorZoom;

		zoom.setZoomLevel(0);
    expect(zoom.getZoomLevel()).toBe(0)
		zoom.setZoomLevel(-0);
    expect(zoom.getZoomLevel()).toBe(0)
		zoom.setZoomLevel(5);
    expect(zoom.getZoomLevel()).toBe(5)
		zoom.setZoomLevel(-1);
    expect(zoom.getZoomLevel()).toBe(-1)

		zoom.setZoomLevel(9);
		expect(zoom.getZoomLevel()).toBe(9)

		zoom.setZoomLevel(-9);
		expect(zoom.getZoomLevel()).toBe(-5)

		zoom.setZoomLevel(20);
    expect(zoom.getZoomLevel()).toBe(20)

		zoom.setZoomLevel(-10);
    expect(zoom.getZoomLevel()).toBe(-5)

		zoom.setZoomLevel(9.1);
    expect(zoom.getZoomLevel()).toBe(9.1)

		zoom.setZoomLevel(-9.1);
		assert.strictEqual(zoom.getZoomLevel(), -5);

		zoom.setZoomLevel(Infinity);
    expect(zoom.getZoomLevel()).toBe(20)

		zoom.setZoomLevel(Number.NEGATIVE_INFINITY);
    expect(zoom.getZoomLevel()).toBe(-5)
	});

	class TestWrappingConfiguration extends TestConfiguration {
		protected override _readEnvConfiguration(): IEnvConfiguration {
			return {
				extraEditorClassName: '',
				outerWidth: 1000,
				outerHeight: 100,
				emptySelectionClipboard: true,
				pixelRatio: 1,
				accessibilitySupport: AccessibilitySupport.Unknown
			};
		}
	}

	function assertWrapping(config: TestConfiguration, isViewportWrapping: boolean, wrappingColumn: number): void {
		const options = config.options;
		const wrappingInfo = options.get(EditorOption.wrappingInfo);
    expect(wrappingInfo.isViewportWrapping).toBe(isViewportWrapping)
    expect(wrappingInfo.wrappingColumn).toBe(wrappingColumn)
	}

	test('wordWrap default', () => {
		const config = new TestWrappingConfiguration({});
		assertWrapping(config, false, -1);
	});

	test('wordWrap compat false', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: <any>false
		});
		assertWrapping(config, false, -1);
	});

	test('wordWrap compat true', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: <any>true
		});
		assertWrapping(config, true, 80);
	});

	test('wordWrap on', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'on'
		});
		assertWrapping(config, true, 80);
	});

	test('wordWrap on without minimap', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'on',
			minimap: {
				enabled: false
			}
		});
		assertWrapping(config, true, 88);
	});

	test('wordWrap on does not use wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'on',
			wordWrapColumn: 10
		});
		assertWrapping(config, true, 80);
	});

	test('wordWrap off', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'off'
		});
		assertWrapping(config, false, -1);
	});

	test('wordWrap off does not use wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'off',
			wordWrapColumn: 10
		});
		assertWrapping(config, false, -1);
	});

	test('wordWrap wordWrapColumn uses default wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'wordWrapColumn'
		});
		assertWrapping(config, false, 80);
	});

	test('wordWrap wordWrapColumn uses wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'wordWrapColumn',
			wordWrapColumn: 100
		});
		assertWrapping(config, false, 100);
	});

	test('wordWrap wordWrapColumn validates wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'wordWrapColumn',
			wordWrapColumn: -1
		});
		assertWrapping(config, false, 1);
	});

	test('wordWrap bounded uses default wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'bounded'
		});
		assertWrapping(config, true, 80);
	});

	test('wordWrap bounded uses wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'bounded',
			wordWrapColumn: 40
		});
		assertWrapping(config, true, 40);
	});

	test('wordWrap bounded validates wordWrapColumn', () => {
		const config = new TestWrappingConfiguration({
			wordWrap: 'bounded',
			wordWrapColumn: -1
		});
		assertWrapping(config, true, 1);
	});

	test('issue #53152: Cannot assign to read only property \'enabled\' of object', () => {
		const hoverOptions: IEditorHoverOptions = {};
		Object.defineProperty(hoverOptions, 'enabled', {
			writable: false,
			value: true
		});
		const config = new TestConfiguration({ hover: hoverOptions });

    expect(config.options.get(EditorOption.hover).enabled).toBe(true)
		config.updateOptions({ hover: { enabled: false } });
    expect(config.options.get(EditorOption.hover).enabled).toBe(false)
	});

	test('does not emit event when nothing changes', () => {
		const config = new TestConfiguration({ glyphMargin: true, roundedSelection: false });
		let event: ConfigurationChangedEvent | null = null;
		config.onDidChange(e => event = e);
    expect(config.options.get(EditorOption.glyphMargin)).toBe(true)
		config.updateOptions({ glyphMargin: true });
		config.updateOptions({ roundedSelection: false });
    expect(event).toBeNull()
	});

	test('issue #94931: Unable to open source file', () => {
		const config = new TestConfiguration({ quickSuggestions: null! });
		const actual = <Readonly<Required<IQuickSuggestionsOptions>>>config.options.get(EditorOption.quickSuggestions);
    expect(actual).toStrictEqual({
			other: 'on',
			comments: 'off',
			strings: 'off'
		})
	});

	test('issue #102920: Can\'t snap or split view with JSON files', () => {
		const config = new TestConfiguration({ quickSuggestions: null! });
		config.updateOptions({ quickSuggestions: { strings: true } });
		const actual = <Readonly<Required<IQuickSuggestionsOptions>>>config.options.get(EditorOption.quickSuggestions);
    expect(actual).toStrictEqual({
			other: 'on',
			comments: 'off',
			strings: 'on'
		})
	});

	test('issue #151926: Untyped editor options apply', () => {
		const config = new TestConfiguration({});
		config.updateOptions({ unicodeHighlight: { allowedCharacters: { 'x': true } } });
		const actual = config.options.get(EditorOption.unicodeHighlighting);
    expect(actual).toStrictEqual({
      nonBasicASCII: "inUntrustedWorkspace",
      invisibleCharacters: true,
      ambiguousCharacters: true,
      includeComments: "inUntrustedWorkspace",
      includeStrings: "inUntrustedWorkspace",
      allowedCharacters: { "x": true },
      allowedLocales: { "_os": true, "_vscode": true }
    })
	});
});

describe('migrateOptions', () => {
	function migrate(options: any): any {
		migrateOptions(options);
		return options;
	}

	test('wordWrap', () => {
    expect(migrate({ wordWrap: true })).toStrictEqual({ wordWrap: 'on' })
    expect(migrate({ wordWrap: false })).toStrictEqual({ wordWrap: 'off' })
	});
	test('lineNumbers', () => {
    expect(migrate({ lineNumbers: true })).toStrictEqual({ lineNumbers: 'on' })
    expect(migrate({ lineNumbers: false })).toStrictEqual({ lineNumbers: 'off' })
	});
	test('autoClosingBrackets', () => {
    expect(migrate({ autoClosingBrackets: false })).toStrictEqual({ autoClosingBrackets: 'never', autoClosingQuotes: 'never', autoSurround: 'never' })
	});
	test('cursorBlinking', () => {
    expect(migrate({ cursorBlinking: 'visible' })).toStrictEqual({ cursorBlinking: 'solid' })
	});
	test('renderWhitespace', () => {
    expect(migrate({ renderWhitespace: true })).toStrictEqual({ renderWhitespace: 'boundary' })
    expect(migrate({ renderWhitespace: false })).toStrictEqual({ renderWhitespace: 'none' })
	});
	test('renderLineHighlight', () => {
    expect(migrate({ renderLineHighlight: true })).toStrictEqual({ renderLineHighlight: 'line' })
    expect(migrate({ renderLineHighlight: false })).toStrictEqual({ renderLineHighlight: 'none' })
	});
	test('acceptSuggestionOnEnter', () => {
    expect(migrate({ acceptSuggestionOnEnter: true })).toStrictEqual({ acceptSuggestionOnEnter: 'on' })
    expect(migrate({ acceptSuggestionOnEnter: false })).toStrictEqual({ acceptSuggestionOnEnter: 'off' })
	});
	test('tabCompletion', () => {
    expect(migrate({ tabCompletion: true })).toStrictEqual({ tabCompletion: 'onlySnippets' })
    expect(migrate({ tabCompletion: false })).toStrictEqual({ tabCompletion: 'off' })
	});
	test('suggest.filteredTypes', () => {
    expect(migrate({
      suggest: {
        filteredTypes: {
          method: false,
          function: false,
          constructor: false,
          deprecated: false,
          field: false,
          variable: false,
          class: false,
          struct: false,
          interface: false,
          module: false,
          property: false,
          event: false,
          operator: false,
          unit: false,
          value: false,
          constant: false,
          enum: false,
          enumMember: false,
          keyword: false,
          text: false,
          color: false,
          file: false,
          reference: false,
          folder: false,
          typeParameter: false,
          snippet: false,
        }
      }
    })).toStrictEqual({suggest:{
      filteredTypes: undefined,
      showMethods: false,
      showFunctions: false,
      showConstructors: false,
      showDeprecated: false,
      showFields: false,
      showVariables: false,
      showClasses: false,
      showStructs: false,
      showInterfaces: false,
      showModules: false,
      showProperties: false,
      showEvents: false,
      showOperators: false,
      showUnits: false,
      showValues: false,
      showConstants: false,
      showEnums: false,
      showEnumMembers: false,
      showKeywords: false,
      showWords: false,
      showColors: false,
      showFiles: false,
      showReferences: false,
      showFolders: false,
      showTypeParameters: false,
      showSnippets: false,
    }})
	});
	test('quickSuggestions', () => {
    expect(migrate({ quickSuggestions: true })).toStrictEqual({ quickSuggestions: { comments: 'on', strings: 'on', other: 'on' } })
    expect(migrate({ quickSuggestions: false })).toStrictEqual({ quickSuggestions: { comments: 'off', strings: 'off', other: 'off' } })
    expect(migrate({ quickSuggestions: { comments: 'on', strings: 'off' } })).toStrictEqual({ quickSuggestions: { comments: 'on', strings: 'off' } })
	});
	test('hover', () => {
    expect(migrate({ hover: false })).toStrictEqual({ hover: { enabled: false } })
    expect(migrate({ hover: true })).toStrictEqual({ hover: { enabled: true } })
	});
	test('parameterHints', () => {
    expect(migrate({ parameterHints: true })).toStrictEqual({ parameterHints: { enabled: true } })
    expect(migrate({ parameterHints: false })).toStrictEqual({ parameterHints: { enabled: false } })
	});
	test('autoIndent', () => {
    expect(migrate({ autoIndent: true })).toStrictEqual({ autoIndent: 'full' })
    expect(migrate({ autoIndent: false })).toStrictEqual({ autoIndent: 'advanced' })
	});
	test('matchBrackets', () => {
    expect(migrate({ matchBrackets: true })).toStrictEqual({ matchBrackets: 'always' })
    expect(migrate({ matchBrackets: false })).toStrictEqual({ matchBrackets: 'never' })
	});
	test('renderIndentGuides, highlightActiveIndentGuide', () => {
    expect(migrate({ renderIndentGuides: true })).toStrictEqual({ renderIndentGuides: undefined, guides: { indentation: true } })
    expect(migrate({ renderIndentGuides: false })).toStrictEqual({ renderIndentGuides: undefined, guides: { indentation: false } })
    expect(migrate({ highlightActiveIndentGuide: true })).toStrictEqual({ highlightActiveIndentGuide: undefined, guides: { highlightActiveIndentation: true } })
    expect(migrate({ highlightActiveIndentGuide: false })).toStrictEqual({ highlightActiveIndentGuide: undefined, guides: { highlightActiveIndentation: false } })
	});

	test('migration does not overwrite new setting', () => {
    expect(migrate({ renderIndentGuides: true, guides: { indentation: false } })).toStrictEqual({ renderIndentGuides: undefined, guides: { indentation: false } })
    expect(migrate({ highlightActiveIndentGuide: true, guides: { highlightActiveIndentation: false } })).toStrictEqual({ highlightActiveIndentGuide: undefined, guides: { highlightActiveIndentation: false } })
	});
});
