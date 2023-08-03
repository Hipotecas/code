
# Editor Configuration

The configuration for control the editor is very important. It contains the basic editor configuration, like the settings.


### Editor Options

- `inDiffEditor`: The editor is used inside in diff editor.
- `ariaLabel`: The aria label for the editor's textarea when it is focused.
- `screenReaderAnnounceInlineSuggestion`: Control whether a screen reader announces inline suggestion content immediately.
- `tabIndex`: The tab index property of the editor's textarea.
- `rulers`: render vertical lines at the specified columns. Defaults to empty array.
- `wordSeparators`: A string containing the word separators used when doing word navigation. Defaults to **`~!@#$%^&*()-=+[{]}\|;:'",.<>/?**.
- `selectionClipboard`: Enable linux primary clipboard. Defaults to true.
- `lineNumbers`: Control the rendering of line numbers. If it is a function, it will be invoked when rendering a line number and the return value will be rendered. Otherwise, if it is truthy, line numbers will be rendered normally (equivalent of using an identity function). Otherwise, line numbers will not be renderer. Defaults to on.
- `cursorSurroundingLines`: Controls the minimal number of visible leading and trailing lines surrounding the cursor, Defaults to 0.
- `cursorSurroundingLinesStyle`: Controls when cursorSurroundingLines should be enforced Defaults to default, cursorSurroundingLines is not enforced when cursor position is changed by mouse.
- `renderFinalNewline`: Render last line number when the file ends with a newline. Defaults to 'on' for Windows and macOS and 'dimmed' for Linux.
- `unusualLineTerminators`: Remove unusual line terminators line LINE SEPARATOR (LS), PARAGRAPH SEPARATOR (PS). Defaults to 'prompt'.
- `selectOnLineNumbers`: Should the corresponding line be selected when clicking on the line number. Defaults to true.
- `lineNumbersMinChars`: Control the width of line numbers, by reversing horizontal space for rendering at least an amount of digits. Defaults to 5.
- `glyphMargin`: Enable the rendering of the glyph margin. Defaults to true in vscode and to false in monaco-editor.
- `lineDecorationsWidth`: The width reserved for line decorations (in px). Line decorations are placed between line numbers and the editor content . You can pass in a string in the format floating point followed by "ch". e.g. 1.3ch. Defaults to 10.
- `revealHorizontalRightPadding`: When revealing the cursor, a virtual padding (px) is added to the cursor, turning it into a rectangle. This virtual padding ensures that the cursor gets revealed before hitting the edge of the viewport. Defaults to 30 (px).
- `roundedSelection`: Render the editor selection with rounded borders. Defaults to true.
- `extraEditorClassName`: Class name to be added to the editor.
- `readOnly`: Should the editor be read only. See also domReadOnly. Defaults to false.
- `domReadOnly`: Should the textarea used for input use the DOM readonly attribute. Defaults to false.
- `linkedEditing`: Enable linked editing. Defaults to false.
- `renameOnType`: deprecated, use linkedEditing instead.
- `renderValidationDecorations`: Should the editor render validation decorations. Defaults to editable.
- `Scrollbar`: Control the behavior and rendering of the scrollbars.
- `stickyScroll`: Control the behavior of sticky scroll options.
- `minimap`: Control the behavior and rendering of the minimap.
- `find`: Control the behavior of the find widget.
- `fixedOverflowWidgets`: Display overflow widgets as fixed. Defaults to false.
- `overviewRulerLanes`: The number of vertical lanes the overview ruler should render. Defaults to 3.
- `overviewRulerBorder`: Controls if a border should be drawn around the overview ruler. Defaults to true.
- `cursorBlinking`: Control the cursor animation style, possible values are 'blink', 'smooth', 'phase', 'expand' and 'solid'. Defaults to 'blink'.
- `mouseWheelZoom`: Zoom the font in the editor when using the mouse wheel in combination with holding Ctrl. Defaults to false.
- `mouseStyle`: Control the mouse pointer style, either 'text' or 'default' or 'copy'. Defaults to 'text'.
- `cursorSmoothCaretAnimation`: Enable smooth caret animation. Defaults to 'off'.
- `cursorStyle`: Control the cursor style, either 'block' or 'line'. Defaults to 'line'.
- `cursorWidth`: Control the width of the cursor when cursorStyle is set to 'line'.
- `fontLigatures`: Enable font ligatures. Defaults to false.
- `fontVariations`: Enable font variations. Defaults to false.
- `defaultColorDecorators`: Controls whether to use default colour decorations or using the default document color provider.
- `disableLayerHinting`: Disable the use of transform: translate3d(0px, 0px, 0px) for the editor margin and lines layers. The usage of transform: translate3d(0px, 0px, 0px) acts as a hint for browsers to create an extra layer. Defaults to false.
- `disableMonospaceOptimizations`: Disable the optimizations for monospace fonts. Defaults to false.
- `hideCursorInOverviewRuler`: Should the cursor be hidden in the overview ruler. Defaults to false.
- `scrollBeyondLastLine`: Enable that scrolling can go one screen size after the last line. Defaults to true.
- `scrollBeyondLastColumn`: Enable the scrolling can go beyond the last column by a number of columns. Defaults to 5.
- `smoothScrolling`: Enable that the editor animates scrolling to a position. Defaults to fasle.
- `automaticLayout`: Enable that the editor will install a ResizeObserver to check if its container dom node size has changed. Defaults to false.
- `wordWrap`: Control the wrapping of the editor. When wordWrap = "off", the lines will never wrap. When wordWrap = "on", the lines will wrap at the viewport width. When wordWrap = "wordWrapColumn", the lines will wrap at wordWrapColumn. When wordWrap = "bounded", the lines will wrap at min(viewport width, wordWrapColumn). Defaults to "off".
- `wordWrapOverride1`: Override the wordWrap setting.
- `wordWrapOverride2`: Override the wordWrapOverride1 setting.
- `wordWrapColumn`: Control the wrapping of the editor. When wordWrap = "off", the lines will never wrap. When wordWrap = "on", the lines will wrap at the viewport width. When wordWrap = "wordWrapColumn", the lines will wrap at wordWrapColumn. When wordWrap = "bounded", the lines will wrap at min(viewport width, wordWrapColumn). Defaults to 80.
- `wrappingIndent`: Control indentation of wrapped lines. Can be: 'none', 'same', 'indent' or 'deepIndent'. Defaults to 'same' in vscode and to 'none' in Monaco-editor.
- `wrappingStrategy`: Controls the wrapping strategy to use. Defaults to 'simple'.
- `wordWrapBreakBeforeCharacters`: Configure word wrapping characters. A break will be introduced before these characters.
- `wordWrapBreakAfterCharacters`:  Configure word wrapping characters. A break will be introduced after these characters.
- `wordBreak`: Sets whether line breaks appear wherever the text would otherwise overflow its content box. When wordBreak = 'normal', Use the default line break rule. When wordBreak = 'keepAll', Word breaks should not be used for Chinese/Japanese/Korean (CJK) text. Non-CJK text behavior is the same as for normal.
- `stopRenderingLineAfter`: Performance guard: Stop rendering a line after x characters. Defaults to 10000. Use -1 to never stop rendering.
- `hover`: Configure the editor's hover.
- `links`: Enable detecting links and marking them clickable. Defaults to true.
- `colorDecorators`: Enable inline color decorators and color picker rendering.
- `colorDecoratorsLimit`: Controls the max number of color decorators that can be rendered in an editor at once.
- `comments`: Control the behavior of comments in the editor
- `contextmenu`: Enable custom contextmenu. Defaults to true.
- `mouseWheelScrollSensitivity`: A multiplier to be used on the deltaX and deltaY of mouse wheel scroll events. Defaults to 1.
- `fastScrollSensitivity`: FastScrolling multiplier speed when pressing Alt. Defaults to 5.
- `scrollPredominantAxis`: Enable that the editor scrolls only the predominant axis. Prevents horizontal drift when scrolling vertically on a trackpad. Defaults to true.
- `columnSelection`: Enable that the selection with the mouse and keys is doing column selection. Defaults to false.
- `multiCursorModifier`: The modifier to be used to add multiple cursors with the mouse. Defaults to 'alt'.
- `multiCursorMergeOverlapping`: Merge overlapping selections. Defaults to true.
- `multiCursorPaste`: Configure the behavior when passing a text with the line count equal to the cursor count. Defaults to 'spread'.
- `multiCursorLimit`: Controls the max number of text cursors that can be in an active editor at once.
- `accessibilitySupport`: Configure the editor's accessibility support. Defaults to 'auto'. It is best to leave this to 'auto'.
- `accessibilityPageSize`: Controls the number of lines in the editor that can be read out by a screen reader.
- `suggest`: Suggest options.
- `inlineSuggest`: Inline suggest options.
- `smartSelect`: Smart select options.
- `gotoLocation`: go to the location options.
- `quickSuggestions`: Enable quick suggestions(shadow suggestions). Defaults to true.
- `quickSuggestionsDelay`: Quick suggestions show delay(in ms). Defaults to 10 (ms).
- `padding`: Controls the spacing around the editor.
- `parameterHints`: Parameter hint options.
- `autoClosingBrackets`: Options for auto closing brackets. Defaults to language defined behavior.
- `autoClosingQuotes`: Options for auto closing quotes. Defaults to language defined behavior.
- `autoClosingDelete`: Options for pressing backspace near quotes or bracket pairs.
- `autoClosingOvertype`: Options for typing over closing quotes or brackets.
- `autoSurround`: Options for auto surrounding.Defaults to always allowing auto surrounding.
- `stickyTabStops`: Emulate selection behaviour of tab characters when using spaces for indentation. This means selection will stick to tab stops.
- `formatOnType`: Enable format on type. Defaults to false.
- `formatOnPaste`: Enable format on paste. Defaults to false.
- `dragAndDrop`: Controls if the editor should allow to move selections via drag and drop. Defaults to false.
- `suggestOnTriggerCharacters`: Enable this suggestion box to pop-up on trigger characters. Defaults to true.
- `acceptSuggestionOnEnter`: Accept suggestions on ENTER. Defaults for 'on'
- `acceptSuggestionOnCommitCharacter`: Accept suggestions on provider defined characters. Defaults to true.
- `snippetsSuggestions`: Enable snippet suggestions. Defaults to 'true'
- `emptySelectionClipboard`: Copying without a selection copies the current line.
- `copyWithSyntaxHighlighting`: Syntax highlighting is copied.
- `suggestSelection`: The history mode for suggestions.
- `suggestFontSize`: The font size for the suggest widget. Defaults to the editor font size.
- `suggestLineHeight`: The line height for the suggest widget. Defaults to the editor line height.
- `tabSelection`: Enable tab selection.
- `selectionHighlight`: Enable selection highlight. Defaults to true.
- `occurrencesHighlight`: Enable semantic occurrences highlight. Defaults to true.
- `codeLens`: Show code lens. Defaults to true.
- `codeLensFontFamily`: Code lens font family. Defaults to editor font family.
- `codeLensFontSize`: Code lens font size. Defaults to 90% of the editor font size.
- `lightbulb`: Controls the behaviour and rendering of the code action lightbulb.
- `codeActionsOnSaveTimeout`: Timeout for running code actions on save.
- `folding`: Enable code folding. Defaults to true.
- `foldingStrategy`: Select the folding strategy. 'auto' uses the strategies contributed for the current document, 'indentation' uses the indentation based folding strategy. Defaults to 'auto'.
- `foldingHighlight`: Enable highlight for folded regions. Defaults to true.
- `foldingImportsByDefault`: Auto fold imports folding regions. Defaults to true.
- `foldingMaximumRegions`: Maximum number of foldable regions. Defaults to 5000.
- `showFoldingControls`: Controls whether the fold action in the gutter stay always visible or hide unless the mouse is over the gutter. Defaults to 'mouseover'.
- `unfoldOnClickAfterEndOfLine`: Controls whether clicking on the empty content after a folded line will unfold the line.  Defaults to false.
- `matchBrackets`: Enable highlighting of matching brackets. Defaults to 'always'.
- `experimentalWhitespaceRendering`: Enable experimental whitespace rendering. Defaults to 'svg'.
- `renderWhitespace`: Enable rendering of whitespace. Defaults to 'selection'.
- `renderControlCharacters`: Enable rendering of control characters. Defaults to true.
- `renderLineHighlightOnlyWhenFocus`: Control if the current line highlight should be rendered only the editor is focused. Defaults to false.
- `useTabStops`: Inserting and deleting whitespace follows tab stops.
- `fontFamily`: The font family.
- `fontWeight`: The font weight.
- `fontSize`: The font size.
- `lineHeight`: The line height.
- `letterSpacing`: The letter spacing.
- `showUnused`: Controls fading out of unused variables.
- `peekWidgetDefaultFocus`: Controls whether to focus the inline editor in the peek widget by default. Defaults to false.
- `definitionLinkOpensInPeek`: Controls whether the definition link opens element in the peek widget. Defaults to false.
- `showDeprecated`: Controls strikethrough deprecated variables.
- `matchOnWordStartOnly`: Control whether suggestions allow matches in the middle of the word instead of only at the beginning.
- `inlayHints`: Control the behaviour and rendering of the line hints.
- `useShadowDOM`: Control if the editor should use shadow DOM.
- `guides`: Controls the behaviour of editor guides.
- `unicodeHighlight`: Controls the behaviour of the unicode highlight feature(by default, ambiguous and invisible characters are highlighted).
- `bracketPairColorization`: Configures bracket pair colorization (disabled by default).
- `dropIntoEditor`: Controls dropping into the editor from an external source. When enabled, this shows a preview of the drop location and triggers on onDropIntoEditor event.
- `tabFocusMode`: Controls whether the editor receives tabs or defers them to the workbench for navigation.

## Constructor



```js

		this.isSimpleWidget = isSimpleWidget;
		this._containerObserver = this._register(new ElementSizeObserver(container, options.dimension));

		this._rawOptions = deepCloneAndMigrateOptions(options);
		this._validatedOptions = EditorOptionsUtil.validateOptions(this._rawOptions);
		this.options = this._computeOptions();

		if (this.options.get(EditorOption.automaticLayout)) {
			this._containerObserver.startObserving();
		}

		this._register(EditorZoom.onDidChangeZoomLevel(() => this._recomputeOptions()));
		this._register(TabFocus.onDidChangeTabFocus(() => this._recomputeOptions()));
		this._register(this._containerObserver.onDidChange(() => this._recomputeOptions()));
		this._register(FontMeasurements.onDidChange(() => this._recomputeOptions()));
		this._register(browser.PixelRatio.onDidChange(() => this._recomputeOptions()));
		this._register(this._accessibilityService.onDidChangeScreenReaderOptimized(() => this._recomputeOptions()));
```



- Observer the container size and register the event
- use [migrationOptions](#migrateOptions) to Deep clone and migrate options from the parameter options
- use [validateOptions](#validateOptions) to  get the validated options
- use [_computeOptions](#computeOptions) to re compute options
- register essential editor config change event



## migrateOptions {#migrateOptions}

The function is used to migrate the specifier key to migrated values for default editor config setting.

The EditorConfigMigration will register some config key and property before migration.

- registerSimpleEditorSettingMigration

  It is used for simple key like "workWrap", "lineNumbers", which is likely the values is more specific such as array list.

- registerEditorSettingMigration

  The function accept the key and migrate function.  Migrate function can be useful for different situation, like `autoClosingBrackets` migration.



```ts
registerSimpleEditorSettingMigration('wordWrap', [[true, 'on'], [false, 'off']]);
registerSimpleEditorSettingMigration('lineNumbers', [[true, 'on'], [false, 'off']]);

registerEditorSettingMigration('autoClosingBrackets', (value, read, write) => {
	if (value === false) {
		write('autoClosingBrackets', 'never');
		if (typeof read('autoClosingQuotes') === 'undefined') {
			write('autoClosingQuotes', 'never');
		}
		if (typeof read('autoSurround') === 'undefined') {
			write('autoSurround', 'never');
		}
	}
});
function registerEditorSettingMigration(key: string, migrate: (value: any, read: 	ISettingsReader, write: ISettingsWriter) => void): void {
	EditorSettingMigration.items.push(new EditorSettingMigration(key, migrate));
}

function registerSimpleEditorSettingMigration(key: string, values: [any, any][]): void {
	registerEditorSettingMigration(key, (value, read, write) => {
		if (typeof value !== 'undefined') {
			for (const [oldValue, newValue] of values) {
				if (value === oldValue) {
					write(key, newValue);
					return;
				}
			}
		}
	});
}

function migrateOptions(options: IEditorOptions) {
  EditorSettingMigration.items.forEach(migration => migration.apply(options))
}
```



## validateOptions {#validateOptions}

This is used to validate the editor options.

First map the `editorOptionsRegistry` which is [IEditorOption](#IEditorOption) type list, then get the options by the specifier name in the editorOption and write the id and value to the `ValidatedEditorOptions` values.

It will look up the array index and store the value to the specifier index.  each editorOption's validate method is different, it will compute the value and return it.

```ts
class ValidatedEditorOptions implements IValidatedEditorOptions {
	private readonly _values: any[] = [];
	public _read<T>(option: EditorOption): T {
		return this._values[option];
	}
	public get<T extends EditorOption>(id: T): FindComputedEditorOptionValueById<T> {
		return this._values[id];
	}
	public _write<T>(option: EditorOption, value: T): void {
		this._values[option] = value;
	}
}

function validateOptions(options: IEditorOptions): ValidatedEditorOptions {
		const result = new ValidatedEditorOptions();
		for (const editorOption of editorOptionsRegistry) {
			const value = (editorOption.name === '_never_' ? undefined : (options as any)[editorOption.name]);
			result._write(editorOption.id, editorOption.validate(value));
		}
		return result;
	}
```
## _computeOptions {#computeOptions}

- Read the env configuration it will override by env
- Get the font setting from options and create a new font info instance
- Read font info and it can override the default font info
- computeOptions and it same as validateOptions store the value to result

```ts

function computeOptions(options: ValidatedEditorOptions, env: IEnvironmentalOptions): ComputedEditorOptions {
		const result = new ComputedEditorOptions();
		for (const editorOption of editorOptionsRegistry) {
			result._write(editorOption.id, editorOption.compute(env, result, options._read(editorOption.id)));
		}
		return result;
	}
```

## EditorOptionsRegistry

This is very useful and important for interpreted configuration. It is a list of `IEditorOption` type. Each property is created extends from `SimpleEditorOption`. Below is the list of editor option

- `EditorStringEnumOption` :  used for string enum type setting configuration

  ```ts
  if (typeof schema !== 'undefined') {
  	schema.type = 'string';
    schema.enum = <any>allowedValues;
    schema.default = defaultValue;
  }
  super(id, name, defaultValue, schema);
  this._allowedValues = allowedValues;
  ```


- `EditorAccessibilitySupport`: Controls if the UI should run in a mode where it is optimized for screen readers. Accept `auto`, `on`, `off`. Defaults to `auto`.
- `EditorComments`: used for comments type setting configuration.
  - `editor.comments.insertSpace`: Controls whether a space character is inserted when commenting.
  - `editor.comments.ignoreEmptyLines`: Controls if empty lines should be ignored with toggle, add or remove actions for line comments.

- `EditorClassName`:  used for editor class name extends from `ComputedEditorOption` which is used for computed editor option

- `EditorEmptySelectionClipboard`: Controls whether copying without a selection copies the current line. Defaults to true.

- `EditorDropIntoEditor`: used for drop into editor operation setting configuration.
  - `editor.dropIntoEditor.showDropSelector`: Controls if a widget is shown when dropping files into the editor. This widget lets you control how the file is dropped. Accept `never`, `afterDrop`. Defaults to `afterDrop`.
  - `editor.dropIntoEditor.enabled`: Controls whether you can drag and drop a file into a text editor by holding down `shift` (instead of opening the file in an editor). Defaults to `true`.
- `EditorWrappingInfoComputer`: wrapping info config
- `WrappingIndentOption`: Controls the indentation of wrapped lines. Can be: 'none', 'same', 'indent' or 'deepIndent'. Defaults to `same`.
- `SmartSelect`: Whether leading and trailing whitespace should always be selected.
- `EditorSuggest`: The basic editor suggest config setting.
- `GuideOptions`: Configuration options for inline suggestions.
  - `editor.guides.brackets`: accept enum list of `[true, 'active', false]`
  - `editor.guides.bracketPairsHorizontal`: same as above
  - `editor.guides.highlightActiveBracketPair`: true or false to active bracket pair highlight, defaults to true
  - `editor.guides.indention`: Enable rendering of indent guides. Defaults to true.
  - `edtior.guides.hightlightActiveIndentation`: Enable highlighting of the active indent guide. Defaults to true. Accepts `true`, `always` and `false`.
- `BracketPairColorization`: Bracket pair colorization config setting.
  - `editor.bracketPairColorization.independentColorPoolPerBracketType`: Controls whether each bracket type has its own independent color pool.
  - `editor.bracketPairColorization.enabled`: Controls whether bracket pair colorization is enabled or not. Use workbench.colorCustomizations to override the bracket highlight colors.
- `InlineEditorSuggest`: Inline editor suggest config setting.
  ```ts
  constructor() {
		const defaults: InternalInlineSuggestOptions = {
			enabled: true,
			mode: 'subwordSmart',
			showToolbar: 'onHover',
			suppressSuggestions: false,
			keepOnBlur: false,
		};

		super(
			EditorOption.inlineSuggest, 'inlineSuggest', defaults,
			{
				'editor.inlineSuggest.enabled': {
					type: 'boolean',
					default: defaults.enabled,
					description: nls.localize('inlineSuggest.enabled', "Controls whether to automatically show inline suggestions in the editor.")
				},
				'editor.inlineSuggest.showToolbar': {
					type: 'string',
					default: defaults.showToolbar,
					enum: ['always', 'onHover'],
					enumDescriptions: [
						nls.localize('inlineSuggest.showToolbar.always', "Show the inline suggestion toolbar whenever an inline suggestion is shown."),
						nls.localize('inlineSuggest.showToolbar.onHover', "Show the inline suggestion toolbar when hovering over an inline suggestion."),
					],
					description: nls.localize('inlineSuggest.showToolbar', "Controls when to show the inline suggestion toolbar."),
				},
				'editor.inlineSuggest.suppressSuggestions': {
					type: 'boolean',
					default: defaults.suppressSuggestions,
					description: nls.localize('inlineSuggest.suppressSuggestions', "Controls how inline suggestions interact with the suggest widget. If enabled, the suggest widget is not shown automatically when inline suggestions are available.")
				},
			}
		);
	}
  ```
- `UnicodeHighlight`: Unicode highlight config setting.
  - `editor.unicodeHighlight.nonBasicASCII`: Controls whether all non-basic ASCII characters are highlighted. Only characters between U+0020 and U+007E, tab, line-feed and carriage-return are considered basic ASCII. Accept `true` or `false` or `inUntrustedWorkspace`.
  - `editor.unicodeHighlight.invisibleCharacters`: Controls whether characters that just reserve space or have no width at all are highlighted.
  - `editor.unicodeHighlight.allowedCharacters`:
  - `editor.unicodeHighlight.ambiguousCharacters`: Controls whether characters are highlighted that can be confused with basic ASCII characters, except those that are common in the current user locale.
  - `editor.unicodeHighlight.includeComments`: Controls whether characters in comments should also be subject to unicode highlighting.
  - `editor.unicodeHighlight.allowedLocales`: Controls whether characters in comments should also be subject to unicode highlighting.
  - `editor.unicodeHighlight.includeStrings`: Controls whether characters in comments should also be subject to unicode highlighting. Accept `true` or `false` or `inUntrustedWorkspace`.
- `EditorScrollbar`: Editor scroll bar config setting
  - `editor.scrollbar.vertical`: Controls visibility of the vertical scrollbar. Accept `auto`, `visible`, `hidden`.
  - `editor.scrollbar.horizontal`: Controls visibility of the horizontal scrollbar. Accept `auto`, `visible`, `hidden`.
  - `editor.scrollbar.verticalScrollbarSize`: The size in pixels the vertical scrollbar should be. Accept `number`. Defaults to `14`.
  - `editor.scrollbar.horizontalScrollbarSize`: The size in pixels the horizontal scrollbar should be. Accept `number`. Defaults to `12`.
  - `editor.scrollbar.scrollByPage`: Controls if scrolling should scroll by page or jump to click position. Accept `true` or `false`. Defaults to `false`.
- `EditorRulers`: Editor rulers config setting.
- `EditorRenderLineNumbersOption`: Controls the display of line numbers. Accept `on`, `off`, `relative`, `interval`. Defaults to `on`.
- `EditorQuickSuggestions`: Controls whether suggestions should automatically show up while typing. This can be controlled for typing in comments, strings, and other code. Quick suggestion can be configured to show as ghost text or with the sugges widget. Also be aware of the '{0}'-setting which controls if suggestions are triggered by special characters.", `#editor.suggestOnTriggerCharacters#`. The types include `on`, `off`, `inline` or bool type. For `other` defaults to `on`, for others defaults to `off`.
- `EditorParameterHints`: Controls parameter hints.
  - `editor.parameterHints.enabled`: Enables a pop-up that shows parameter documentation and type information as you type. Defaults to `true`.
  - `editor.parameterHints.cycle`: Controls whether the parameter hints menu cycles or closes when reaching the end of the list. Defaults to `false`.
- `EditorPadding`: Controls the editor padding style. It include `top`, `bottom` property. Both of them defaults to `0` which range from 0 to 1000.
- `EditorMinimap`: Controls the display of the minimap.
- `EditorLineHeight`: Controls the line height. Use 0 to automatically compute the line height from the font size. Values between 0 and 8 will be used as a multiplier with the font size. Values greater than or equal to 8 will be used as effective values. Defaults to `0`.
- `EditorLineDecorationsWidth`: Controls the width of line decorations. Defaults to `10`.
- `EditorInlayHints`: Controls the inlay hints config setting.
- `EditorStickyScroll`: Controls the editor sticky scroll config setting.
  - `editor.stickyScroll.enabled`: Shows the nested current scopes during the scroll at the top of the editor. Defaults to `false`.
  - `editor.stickyScroll.maxLineCount`: Defines the maximum number of sticky lines to show. Defaults to `5` range from `1` to `10`.
  - `editor.stickyScroll.defaultModel`: Defines the model to use for determining which lines to stick. If the outline model does not exist, it will fall back on the folding provider model which falls back on the indentation model. This order is respected in all three cases. Accept one of `outlineModel`, `foldingProviderModel`, `indentationModel`, defaults to `outlineModel`.
- `EditorLightbulb`: Enables the Code Action lightbulb in the editor. Defaults to `true`.
- `WrappingStrategy`: Controls the algorithm that computes wrapping points. Note that when in accessibility mode, advanced will be used for the best experience. Defaults to `simple`.
  - `simple`: Assumes that all characters are of the same width. This is a fast algorithm that works correctly for monospace fonts and certain scripts (like Latin characters) where glyphs are of equal width.
  - `advanced`: Delegates wrapping points computation to the browser. This is a slow algorithm, that might cause freezes for large files, but it works correctly in all cases.
- `EditorLayoutInfoComputer`: Controls the layout info computer config setting.
- `EditorHover`: Controls the hover config setting.
  - `editor.hover.enabled`: Controls whether the hover is enabled or not. Defaults to `true`.
  - `editor.hover.delay`: Controls the delay in milliseconds after which the hover is shown. Defaults to `300`.
  - `editor.hover.sticky`: Controls whether the hover should remain visible when mouse is moved over it. Defaults to `true`.
  - `editor.hover.above`: Prefer showing hovers above the line, if there's space. Defaults to `true`.
- `EditorGoToLocation`: Controls the go to location config setting.
  - `editor.gotoLocation.multipleDefinitions`: Controls the behavior the 'Go to Definition'-command when multiple target locations exist. Accept `goto`, `peek`, `gotoAndPeek`. Defaults to `peek`.
  - `editor.gotoLocation.multipleTypeDefinitions`: Controls the behavior the 'Go to Type Definition'-command when multiple target locations exist. Accept `goto`, `peek`, `gotoAndPeek`. Defaults to `peek`.
  - `editor.gotoLocation.multipleDeclarations`: Controls the behavior the 'Go to Declaration'-command when multiple target locations exist. Accept `goto`, `peek`, `gotoAndPeek`. Defaults to `peek`.
  - `editor.gotoLocation.multipleImplementations`: Controls the behavior the 'Go to Implementations'-command when multiple target locations exist. Accept `goto`, `peek`, `gotoAndPeek`. Defaults to `peek`.
  - `editor.gotoLocation.multipleReferences`: Controls the behavior the 'Go to References'-command when multiple target locations exist. Accept `goto`, `peek`, `gotoAndPeek`. Defaults to `peek`.
  - `editor.gotoLocation.alternativeDefinitionCommand`: Alternative command id that is being executed when the result of 'Go to Definition' is the current location.
  - `editor.gotoLocation.alternativeTypeDefinitionCommand`: Alternative command id that is being executed when the result of 'Go to Type Definition' is the current location.
  - `editor.gotoLocation.alternativeDeclarationCommand`: Alternative command id that is being executed when the result of 'Go to Declaration' is the current location.
  - `editor.gotoLocation.alternativeImplementationCommand`: Alternative command id that is being executed when the result of 'Go to Implementation' is the current location.
  - `editor.gotoLocation.alternativeReferenceCommand`: Alternative command id that is being executed when the result of 'Go to Reference' is the current location.
- `EditorFontWeight`: Controls the font weight. Accept `normal`, `bold`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`. Defaults `normal`.
- `EditorFontSize`: Controls the font size in pixels. Defaults to `12`px.
- `EditorFontInfo`: The font info.
- `EditorFontVariations`: Configure font variations. Can be either a boolean to enable/disable the translation from font-weight to font-variation-settings or a string for the value of the CSS 'font-variation-settings' property. Defaults to `normal`.
- `EditorFontLigatures`: Configures font ligatures or font features. Can be either a boolean to enable/disable ligatures or a string for the value of the CSS 'font-feature-settings' property.
- `EditorFind`: Configure the editor find options.
  - `editor.find.seedSearchStringFromSelection`: Controls whether the search string in the Find Widget is seeded from the editor selection. Accept `never`, `always`, `selection`. Defaults to `always`.
  - `editor.find.cursorMoveOnType`: Controls whether the cursor should move to find matches while typing in the editor. Defaults to `true`.
  - `editor.find.autoFindInSelection`: Controls the condition for turning on Find in Selection automatically. Accept `never`, `always`, `multiline`. Defaults to `never`.
  - `editor.find.globalFindClipboard`: Controls whether the Find Widget should read or modify the shared find clipboard on macOS. Defaults to `false`.
  - `editor.find.addExtraSpaceOnTop`: Controls whether the Find Widget should add extra space on top of the editor. When true, you can scroll beyond the first line when the Find Widget is visible. Defaults to `true`.
  - `editor.find.loop`: Controls whether the search automatically restarts from the beginning (or the end) when no further matches can be found. Defaults to `true`.
  - `EditorEmptySelectionClipboard`: Controls whether copying without a selection copies the current line. Defaults to `true`.
  -
### IEditorOptions {#IEditorOptions}

```ts
export interface IEditorOption<K extends EditorOption, V> {
	readonly id: K;
	readonly name: string;
	defaultValue: V;
	/**
	 * @internal
	 */
	readonly schema: IConfigurationPropertySchema | { [path: string]: IConfigurationPropertySchema } | undefined;
	/**
	 * @internal
	 */
	validate(input: any): V;
	/**
	 * @internal
	 */
	compute(env: IEnvironmentalOptions, options: IComputedEditorOptions, value: V): V;

	/**
	 * Might modify `value`.
	*/
	applyUpdate(value: V | undefined, update: V): ApplyUpdateResult<V>;
}
```
