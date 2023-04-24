/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @vitest-environment node
import * as assert from 'assert';
import * as types from 'vs/base/common/types';

describe('Types', () => {

	test('isFunction', () => {
		expect(!types.isFunction(undefined)).toBe(true)
		expect(!types.isFunction(null)).toBe(true)
		expect(!types.isFunction('foo')).toBe(true)
		expect(!types.isFunction(5)).toBe(true)
		expect(!types.isFunction(true)).toBe(true)
		expect(!types.isFunction([])).toBe(true)
		expect(!types.isFunction([1, 2, '3'])).toBe(true)
		expect(!types.isFunction({})).toBe(true)
		expect(!types.isFunction({ foo: 'bar' })).toBe(true)
		expect(!types.isFunction(/test/)).toBe(true)
		expect(!types.isFunction(new RegExp(''))).toBe(true)
		expect(!types.isFunction(new Date())).toBe(true)


		expect(types.isFunction(function foo() { /**/ })).toBe(true)
	});

	test('areFunctions', () => {
		expect(!types.areFunctions()).toBe(true)
		expect(!types.areFunctions(null)).toBe(true)
		expect(!types.areFunctions('foo')).toBe(true)
		expect(!types.areFunctions(5)).toBe(true)
		expect(!types.areFunctions(true)).toBe(true)
		expect(!types.areFunctions([])).toBe(true)
		expect(!types.areFunctions([1, 2, '3'])).toBe(true)
		expect(!types.areFunctions({})).toBe(true)
		expect(!types.areFunctions({ foo: 'bar' })).toBe(true)
		expect(!types.areFunctions(/test/)).toBe(true)
		expect(!types.areFunctions(new RegExp(''))).toBe(true)
		expect(!types.areFunctions(new Date())).toBe(true)
		expect(!types.areFunctions(assert, '')).toBe(true)


		expect(types.areFunctions(function foo() { /**/ })).toBe(true)
	});

	test('isObject', () => {
		expect(!types.isObject(undefined)).toBe(true)
		expect(!types.isObject(null)).toBe(true)
		expect(!types.isObject('foo')).toBe(true)
		expect(!types.isObject(5)).toBe(true)
		expect(!types.isObject(true)).toBe(true)
		expect(!types.isObject([])).toBe(true)
		expect(!types.isObject([1, 2, '3'])).toBe(true)
		expect(!types.isObject(/test/)).toBe(true)
		expect(!types.isObject(new RegExp(''))).toBe(true)
		expect(!types.isFunction(new Date())).toBe(true)

		expect(!types.isObject(function foo() { })).toBe(true)

		expect(types.isObject({})).toBe(true)
		expect(types.isObject({ foo: 'bar' })).toBe(true)
	});

	test('isEmptyObject', () => {
		expect(!types.isEmptyObject(undefined)).toBe(true)
		expect(!types.isEmptyObject(null)).toBe(true)
		expect(!types.isEmptyObject('foo')).toBe(true)
		expect(!types.isEmptyObject(5)).toBe(true)
		expect(!types.isEmptyObject(true)).toBe(true)
		expect(!types.isEmptyObject([])).toBe(true)
		expect(!types.isEmptyObject([1, 2, '3'])).toBe(true)
		expect(!types.isEmptyObject(/test/)).toBe(true)
		expect(!types.isEmptyObject(new RegExp(''))).toBe(true)
		expect(!types.isEmptyObject(new Date())).toBe(true)
		assert.strictEqual(types.isEmptyObject(assert), false);
		expect(!types.isEmptyObject(function foo() { /**/ })).toBe(true)
		expect(!types.isEmptyObject({ foo: 'bar' })).toBe(true)

		expect(types.isEmptyObject({})).toBe(true)
	});

	test('isString', () => {
		expect(!types.isString(undefined)).toBe(true)
		expect(!types.isString(null)).toBe(true)
		expect(!types.isString(5)).toBe(true)
		expect(!types.isString([])).toBe(true)
		expect(!types.isString([1, 2, '3'])).toBe(true)
		expect(!types.isString(true)).toBe(true)
		expect(!types.isString({})).toBe(true)
		expect(!types.isString(/test/)).toBe(true)
		expect(!types.isString(new RegExp(''))).toBe(true)
		expect(!types.isString(new Date())).toBe(true)
		expect(!types.isString(assert)).toBe(true)
		expect(!types.isString(function foo() { /**/ })).toBe(true)
		expect(!types.isString({ foo: 'bar' })).toBe(true)

		expect(types.isString('foo')).toBe(true)
	});

	test('isNumber', () => {
		expect(!types.isNumber(undefined)).toBe(true)
		expect(!types.isNumber(null)).toBe(true)
		expect(!types.isNumber('foo')).toBe(true)
		expect(!types.isNumber([])).toBe(true)
		expect(!types.isNumber([1, 2, '3'])).toBe(true)
		expect(!types.isNumber(true)).toBe(true)
		expect(!types.isNumber({})).toBe(true)
		expect(!types.isNumber(/test/)).toBe(true)
		expect(!types.isNumber(new RegExp(''))).toBe(true)
		expect(!types.isNumber(new Date())).toBe(true)
		expect(!types.isNumber(assert)).toBe(true)
		expect(!types.isNumber(function foo() { /**/ })).toBe(true)
		expect(!types.isNumber({ foo: 'bar' })).toBe(true)
		expect(!types.isNumber(parseInt('A', 10))).toBe(true)

		expect(types.isNumber(5)).toBe(true)
	});

	test('isUndefined', () => {
		expect(!types.isUndefined(null)).toBe(true)
		expect(!types.isUndefined('foo')).toBe(true)
		expect(!types.isUndefined([])).toBe(true)
		expect(!types.isUndefined([1, 2, '3'])).toBe(true)
		expect(!types.isUndefined(true)).toBe(true)
		expect(!types.isUndefined({})).toBe(true)
		expect(!types.isUndefined(/test/)).toBe(true)
		expect(!types.isUndefined(new RegExp(''))).toBe(true)
		expect(!types.isUndefined(new Date())).toBe(true)
		expect(!types.isUndefined(assert)).toBe(true)
		expect(!types.isUndefined(function foo() { /**/ })).toBe(true)
		expect(!types.isUndefined({ foo: 'bar' })).toBe(true)

		expect(types.isUndefined(undefined)).toBe(true)
	});

	test('isUndefinedOrNull', () => {
		expect(!types.isUndefinedOrNull('foo')).toBe(true)
		expect(!types.isUndefinedOrNull([])).toBe(true)
		expect(!types.isUndefinedOrNull([1, 2, '3'])).toBe(true)
		expect(!types.isUndefinedOrNull(true)).toBe(true)
		expect(!types.isUndefinedOrNull({})).toBe(true)
		expect(!types.isUndefinedOrNull(/test/)).toBe(true)
		expect(!types.isUndefinedOrNull(new RegExp(''))).toBe(true)
		expect(!types.isUndefinedOrNull(new Date())).toBe(true)
		expect(!types.isUndefinedOrNull(assert)).toBe(true)
		expect(!types.isUndefinedOrNull(function foo() { /**/ })).toBe(true)
		expect(!types.isUndefinedOrNull({ foo: 'bar' })).toBe(true)

		expect(types.isUndefinedOrNull(undefined)).toBe(true)
		expect(types.isUndefinedOrNull(null)).toBe(true)
	});

	test('assertIsDefined / assertAreDefined', () => {
		assert.throws(() => types.assertIsDefined(undefined));
		assert.throws(() => types.assertIsDefined(null));
		assert.throws(() => types.assertAllDefined(null, undefined));
		assert.throws(() => types.assertAllDefined(true, undefined));
		assert.throws(() => types.assertAllDefined(undefined, false));

		assert.strictEqual(types.assertIsDefined(true), true);
		assert.strictEqual(types.assertIsDefined(false), false);
		assert.strictEqual(types.assertIsDefined('Hello'), 'Hello');
		assert.strictEqual(types.assertIsDefined(''), '');

		const res = types.assertAllDefined(1, true, 'Hello');
		assert.strictEqual(res[0], 1);
		assert.strictEqual(res[1], true);
		assert.strictEqual(res[2], 'Hello');
	});

	test('validateConstraints', () => {
		types.validateConstraints([1, 'test', true], [Number, String, Boolean]);
		types.validateConstraints([1, 'test', true], ['number', 'string', 'boolean']);
		types.validateConstraints([console.log], [Function]);
		types.validateConstraints([undefined], [types.isUndefined]);
		types.validateConstraints([1], [types.isNumber]);

		class Foo { }
		types.validateConstraints([new Foo()], [Foo]);

		function isFoo(f: any) { }
		assert.throws(() => types.validateConstraints([new Foo()], [isFoo]));

		function isFoo2(f: any) { return true; }
		types.validateConstraints([new Foo()], [isFoo2]);

		assert.throws(() => types.validateConstraints([1, true], [types.isNumber, types.isString]));
		assert.throws(() => types.validateConstraints(['2'], [types.isNumber]));
		assert.throws(() => types.validateConstraints([1, 'test', true], [Number, String, Number]));
	});
});
