
# Code Editor Units


> Please read the page for more information about [Instantiation Service](../../services/platform/instantiation.md) and [Dependency Injection](#../../services/base/dependency-injection.md).

## Introduction

I will introduce `testCodeEditor` and `testCommand` in this article, which is used to test the code editor and command. It supplys a set of functions to create collections to use in the code editor.

## createCodeEditorServices

This function create an instance of a `TestInstantiationService` by defining and setting up various using the provided `ServiceCollection`
and adding them to a `DisposableStore`. The function takes two arguments - a `DisposableStore` to keep track of disposables, and an optional `ServiceCollection` that can be used to add or override services.

Within the function, the `define` and `defineInstance` functions are defined to register services and their implementations. These are then called
to define various services.

- IAccessibilityService
- IClipboardService
- IEditorWorkerService
- IOpenerService
- INotificationService
- IDialogService
- IUndoRedoService
- ILanguageService
- ILanguageConfigurationService
- ITextResourcePropertiesService
- IThemeService
- ILogService
- IModelService
- ICodeEditorService
- IContextKeyService
- ICommandService
- ITelemetryService
- ILanguageFeatureDebounceService
- ILanguageFeaturesService

Finally, the function creates an instance of `TestInstantiationService` using the defined services and adds a disposable function to the `DisposableStore` to dispose of any registered services when the store is disposed, then returns it.


```typescript
const define = <T>(id: ServiceIdentifier<T>, ctor: new (...args: any[]) => T) => {
  // the services is a map
  // this is check the service is already defined or not
  // if not, then set the ctor to the map
  // the push the id to the serviceIdentifiers
  if (!services.has(id)) {
    services.set(id, new SyncDescriptor(ctor));
  }
  serviceIdentifiers.push(id);
};
const defineInstance = <T>(id: ServiceIdentifier<T>, instance: T) => {
	if (!services.has(id)) {
		services.set(id, instance);
	}
	serviceIdentifiers.push(id);
};

```

## instantiateTestCodeEditor

The **instantiateTestCodeEditor** function takes three arguments - an `IInstantiationService`, an optional `ITextModel` and an optional `TestCodeEditorCreationOptions` object. The function creates an instance of `TestCodeEditor` using the provided `IInstantiationService` and `TestCodeEditorCreationOptions` object, then sets the model and focus of the editor. Finally, the function returns the editor.

Basically, the editor is created by instatiation service, which equal to new instance of `TestCodeEditor`. `TestCodeEditor` accpet three arguments, the first is the dom element, the second is the options, the third is the code editor widget options. Then set the model and focus of the editor.

```ts
export function instantiateTestCodeEditor(instantiationService: IInstantiationService, model: ITextModel | null, options: TestCodeEditorCreationOptions = {}): ITestCodeEditor {
	const codeEditorWidgetOptions: ICodeEditorWidgetOptions = {
		contributions: []
	};
	const editor = instantiationService.createInstance(
		TestCodeEditor,
		<HTMLElement><any>new TestEditorDomElement(),
		options,
		codeEditorWidgetOptions
	);
	if (typeof options.hasTextFocus === 'undefined') {
		options.hasTextFocus = true;
	}
	editor.setHasTextFocus(options.hasTextFocus);
	editor.setModel(model);
	const viewModel = editor.getViewModel();
	viewModel?.setHasFocus(options.hasTextFocus);
	return <ITestCodeEditor>editor;
}
```

## instatiateTextModel

The **instantiateTextModel** function is same with the **instatiateTestCodeEditor** function, which use the instatiation service to create a new instance of `TestTextModel`.


## testCommand

The **testCommand** function is for testing editor commands. It creates a disposable store and instantiates a text model and a test code editor with the given parameters. It then sets the view model's selections, execute the command.

```ts
export function testCommand(
  lines: string[],
  languageId: string | null,
  selection: Selection,
  commandFactory: (accessor: ServicesAccessor, selection: Selection) => ICommand,
  expectedLines: string[],
  expectedSelection: Selection,
  forceTokenization?: boolean,
  prepare?: (accessor: ServicesAccessor, disposables: DisposableStore) => void
): void {
  const disposables = new DisposableStore();
  const instantiationService = createCodeEditorServices(disposables);
  if (prepare) {
    instantiationService.invokeFunction(prepare, disposables);
  }
  const model = disposables.add(instantiateTextModel(instantiationService, lines.join('\n'), languageId));
  const editor = disposables.add(instantiateTestCodeEditor(instantiationService, model));
  const viewModel = editor.getViewModel()!;

  if (forceTokenization) {
    model.tokenization.forceTokenization(model.getLineCount());
  }

  viewModel.setSelections('tests', [selection]);

  const command = instantiationService.invokeFunction((accessor) => commandFactory(accessor, viewModel.getSelection()));
  viewModel.executeCommand(command, 'tests');

  expect(model.getLinesContent()).toStrictEqual(expectedLines)
  const actualSelection = viewModel.getSelection();

  expect(actualSelection.toString()).toStrictEqual(expectedSelection.toString());

  disposables.dispose();
}

```
