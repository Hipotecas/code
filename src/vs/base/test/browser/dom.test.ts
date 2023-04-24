/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { $, asCssValueWithDefault, h, multibyteAwareBtoa } from 'vs/base/browser/dom';

describe('dom', () => {
	test('hasClass', () => {

		const element = document.createElement('div');
		element.className = 'foobar boo far';

		expect(element.classList.contains('foobar')).toBe(true)
		expect(element.classList.contains('boo')).toBe(true)
		expect(element.classList.contains('far')).toBe(true)
		expect(!element.classList.contains('bar')).toBe(true)
		expect(!element.classList.contains('foo')).toBe(true)
		expect(!element.classList.contains('')).toBe(true)
	});

	test('removeClass', () => {

		let element = document.createElement('div');
		element.className = 'foobar boo far';

		element.classList.remove('boo');
		expect(element.classList.contains('far')).toBe(true)
		expect(!element.classList.contains('boo')).toBe(true)
		expect(element.classList.contains('foobar')).toBe(true)
		assert.strictEqual(element.className, 'foobar far');

		element = document.createElement('div');
		element.className = 'foobar boo far';

		element.classList.remove('far');
		expect(!element.classList.contains('far')).toBe(true)
		expect(element.classList.contains('boo')).toBe(true)
		expect(element.classList.contains('foobar')).toBe(true)
		assert.strictEqual(element.className, 'foobar boo');

		element.classList.remove('boo');
		expect(!element.classList.contains('far')).toBe(true)
		expect(!element.classList.contains('boo')).toBe(true)
		expect(element.classList.contains('foobar')).toBe(true)
		assert.strictEqual(element.className, 'foobar');

		element.classList.remove('foobar');
		expect(!element.classList.contains('far')).toBe(true)
		expect(!element.classList.contains('boo')).toBe(true)
		expect(!element.classList.contains('foobar')).toBe(true)
		assert.strictEqual(element.className, '');
	});

	test('removeClass should consider hyphens', function () {
		const element = document.createElement('div');

		element.classList.add('foo-bar');
		element.classList.add('bar');

		expect(element.classList.contains('foo-bar')).toBe(true)
		expect(element.classList.contains('bar')).toBe(true)

		element.classList.remove('bar');
		expect(element.classList.contains('foo-bar')).toBe(true)
		expect(!element.classList.contains('bar')).toBe(true)

		element.classList.remove('foo-bar');
		expect(!element.classList.contains('foo-bar')).toBe(true)
		expect(!element.classList.contains('bar')).toBe(true)
	});

	test('multibyteAwareBtoa', () => {
		assert.ok(multibyteAwareBtoa('hello world').length > 0);
		assert.ok(multibyteAwareBtoa('平仮名').length > 0);
		assert.ok(multibyteAwareBtoa(new Array(100000).fill('vs').join('')).length > 0); // https://github.com/microsoft/vscode/issues/112013
	});

	describe('$', () => {
		test('should build simple nodes', () => {
			const div = $('div');
			expect(div).toBeTruthy()
			expect(div instanceof HTMLElement).toBe(true)
			assert.strictEqual(div.tagName, 'DIV');
			expect(!div.firstChild).toBe(true)
		});

		test('should buld nodes with id', () => {
			const div = $('div#foo');
			expect(div).toBeTruthy()
			expect(div instanceof HTMLElement).toBe(true)
			assert.strictEqual(div.tagName, 'DIV');
			assert.strictEqual(div.id, 'foo');
		});

		test('should buld nodes with class-name', () => {
			const div = $('div.foo');
			expect(div).toBeTruthy()
			expect(div instanceof HTMLElement).toBe(true)
			assert.strictEqual(div.tagName, 'DIV');
			assert.strictEqual(div.className, 'foo');
		});

		test('should build nodes with attributes', () => {
			let div = $('div', { class: 'test' });
			assert.strictEqual(div.className, 'test');

			div = $('div', undefined);
			assert.strictEqual(div.className, '');
		});

		test('should build nodes with children', () => {
			let div = $('div', undefined, $('span', { id: 'demospan' }));
			const firstChild = div.firstChild as HTMLElement;
			assert.strictEqual(firstChild.tagName, 'SPAN');
			assert.strictEqual(firstChild.id, 'demospan');

			div = $('div', undefined, 'hello');

			assert.strictEqual(div.firstChild && div.firstChild.textContent, 'hello');
		});

		test('should build nodes with text children', () => {
			const div = $('div', undefined, 'foobar');
			const firstChild = div.firstChild as HTMLElement;
			assert.strictEqual(firstChild.tagName, undefined);
			assert.strictEqual(firstChild.textContent, 'foobar');
		});
	});

	describe('h', () => {
		test('should build simple nodes', () => {
			const div = h('div');
			expect(div.root instanceof HTMLElement).toBe(true)
			assert.strictEqual(div.root.tagName, 'DIV');

			const span = h('span');
			expect(span.root instanceof HTMLElement).toBe(true)
			assert.strictEqual(span.root.tagName, 'SPAN');

			const img = h('img');
			expect(img.root instanceof HTMLElement).toBe(true)
			assert.strictEqual(img.root.tagName, 'IMG');
		});

		test('should handle ids and classes', () => {
			const divId = h('div#myid');
			assert.strictEqual(divId.root.tagName, 'DIV');
			assert.strictEqual(divId.root.id, 'myid');

			const divClass = h('div.a');
			assert.strictEqual(divClass.root.tagName, 'DIV');
			assert.strictEqual(divClass.root.classList.length, 1);
			expect(divClass.root.classList.contains('a')).toBe(true)

			const divClasses = h('div.a.b.c');
			assert.strictEqual(divClasses.root.tagName, 'DIV');
			assert.strictEqual(divClasses.root.classList.length, 3);
			expect(divClasses.root.classList.contains('a')).toBe(true)
			expect(divClasses.root.classList.contains('b')).toBe(true)
			expect(divClasses.root.classList.contains('c')).toBe(true)

			const divAll = h('div#myid.a.b.c');
			assert.strictEqual(divAll.root.tagName, 'DIV');
			assert.strictEqual(divAll.root.id, 'myid');
			assert.strictEqual(divAll.root.classList.length, 3);
			expect(divAll.root.classList.contains('a')).toBe(true)
			expect(divAll.root.classList.contains('b')).toBe(true)
			expect(divAll.root.classList.contains('c')).toBe(true)

			const spanId = h('span#myid');
			assert.strictEqual(spanId.root.tagName, 'SPAN');
			assert.strictEqual(spanId.root.id, 'myid');

			const spanClass = h('span.a');
			assert.strictEqual(spanClass.root.tagName, 'SPAN');
			assert.strictEqual(spanClass.root.classList.length, 1);
			expect(spanClass.root.classList.contains('a')).toBe(true)

			const spanClasses = h('span.a.b.c');
			assert.strictEqual(spanClasses.root.tagName, 'SPAN');
			assert.strictEqual(spanClasses.root.classList.length, 3);
			expect(spanClasses.root.classList.contains('a')).toBe(true)
			expect(spanClasses.root.classList.contains('b')).toBe(true)
			expect(spanClasses.root.classList.contains('c')).toBe(true)

			const spanAll = h('span#myid.a.b.c');
			assert.strictEqual(spanAll.root.tagName, 'SPAN');
			assert.strictEqual(spanAll.root.id, 'myid');
			assert.strictEqual(spanAll.root.classList.length, 3);
			expect(spanAll.root.classList.contains('a')).toBe(true)
			expect(spanAll.root.classList.contains('b')).toBe(true)
			expect(spanAll.root.classList.contains('c')).toBe(true)
		});

		test('should implicitly handle ids and classes', () => {
			const divId = h('#myid');
			assert.strictEqual(divId.root.tagName, 'DIV');
			assert.strictEqual(divId.root.id, 'myid');

			const divClass = h('.a');
			assert.strictEqual(divClass.root.tagName, 'DIV');
			assert.strictEqual(divClass.root.classList.length, 1);
			expect(divClass.root.classList.contains('a')).toBe(true)

			const divClasses = h('.a.b.c');
			assert.strictEqual(divClasses.root.tagName, 'DIV');
			assert.strictEqual(divClasses.root.classList.length, 3);
			expect(divClasses.root.classList.contains('a')).toBe(true)
			expect(divClasses.root.classList.contains('b')).toBe(true)
			expect(divClasses.root.classList.contains('c')).toBe(true)

			const divAll = h('#myid.a.b.c');
			assert.strictEqual(divAll.root.tagName, 'DIV');
			assert.strictEqual(divAll.root.id, 'myid');
			assert.strictEqual(divAll.root.classList.length, 3);
			expect(divAll.root.classList.contains('a')).toBe(true)
			expect(divAll.root.classList.contains('b')).toBe(true)
			expect(divAll.root.classList.contains('c')).toBe(true)
		});

		test('should handle @ identifiers', () => {
			const implicit = h('@el');
			assert.strictEqual(implicit.root, implicit.el);
			assert.strictEqual(implicit.el.tagName, 'DIV');

			const explicit = h('div@el');
			assert.strictEqual(explicit.root, explicit.el);
			assert.strictEqual(explicit.el.tagName, 'DIV');

			const implicitId = h('#myid@el');
			assert.strictEqual(implicitId.root, implicitId.el);
			assert.strictEqual(implicitId.el.tagName, 'DIV');
			assert.strictEqual(implicitId.root.id, 'myid');

			const explicitId = h('div#myid@el');
			assert.strictEqual(explicitId.root, explicitId.el);
			assert.strictEqual(explicitId.el.tagName, 'DIV');
			assert.strictEqual(explicitId.root.id, 'myid');

			const implicitClass = h('.a@el');
			assert.strictEqual(implicitClass.root, implicitClass.el);
			assert.strictEqual(implicitClass.el.tagName, 'DIV');
			assert.strictEqual(implicitClass.root.classList.length, 1);
			expect(implicitClass.root.classList.contains('a')).toBe(true)

			const explicitClass = h('div.a@el');
			assert.strictEqual(explicitClass.root, explicitClass.el);
			assert.strictEqual(explicitClass.el.tagName, 'DIV');
			assert.strictEqual(explicitClass.root.classList.length, 1);
			expect(explicitClass.root.classList.contains('a')).toBe(true)
		});
	});

	test('should recurse', () => {
		const result = h('div.code-view', [
			h('div.title@title'),
			h('div.container', [
				h('div.gutter@gutterDiv'),
				h('span@editor'),
			]),
		]);

		assert.strictEqual(result.root.tagName, 'DIV');
		assert.strictEqual(result.root.className, 'code-view');
		assert.strictEqual(result.root.childElementCount, 2);
		assert.strictEqual(result.root.firstElementChild, result.title);
		assert.strictEqual(result.title.tagName, 'DIV');
		assert.strictEqual(result.title.className, 'title');
		assert.strictEqual(result.title.childElementCount, 0);
		assert.strictEqual(result.gutterDiv.tagName, 'DIV');
		assert.strictEqual(result.gutterDiv.className, 'gutter');
		assert.strictEqual(result.gutterDiv.childElementCount, 0);
		assert.strictEqual(result.editor.tagName, 'SPAN');
		assert.strictEqual(result.editor.className, '');
		assert.strictEqual(result.editor.childElementCount, 0);
	});

	test('cssValueWithDefault', () => {
		assert.strictEqual(asCssValueWithDefault('red', 'blue'), 'red');
		assert.strictEqual(asCssValueWithDefault(undefined, 'blue'), 'blue');
		assert.strictEqual(asCssValueWithDefault('var(--my-var)', 'blue'), 'var(--my-var, blue)');
		assert.strictEqual(asCssValueWithDefault('var(--my-var, red)', 'blue'), 'var(--my-var, red)');
		assert.strictEqual(asCssValueWithDefault('var(--my-var, var(--my-var2))', 'blue'), 'var(--my-var, var(--my-var2, blue))');
	});


});
