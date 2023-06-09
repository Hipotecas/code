/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { IBoundarySashes } from 'vs/base/browser/ui/sash/sash';
import { isFunction } from 'vs/base/common/types';
import { Registry } from 'vs/platform/registry/common/platform';
import { Extensions, PaneComposite, PaneCompositeDescriptor, PaneCompositeRegistry } from 'vs/workbench/browser/panecomposite';

describe('Viewlets', () => {

	class TestViewlet extends PaneComposite {

		constructor() {
			super('id', null!, null!, null!, null!, null!, null!, null!);
		}

		override layout(dimension: any): void {
			throw new Error('Method not implemented.');
		}

		override setBoundarySashes(sashes: IBoundarySashes): void {
			throw new Error('Method not implemented.');
		}

		protected override createViewPaneContainer() { return null!; }
	}

	test('ViewletDescriptor API', function () {
		const d = PaneCompositeDescriptor.create(TestViewlet, 'id', 'name', 'class', 5);
		assert.strictEqual(d.id, 'id');
		assert.strictEqual(d.name, 'name');
		assert.strictEqual(d.cssClass, 'class');
		assert.strictEqual(d.order, 5);
	});

	test('Editor Aware ViewletDescriptor API', function () {
		let d = PaneCompositeDescriptor.create(TestViewlet, 'id', 'name', 'class', 5);
		assert.strictEqual(d.id, 'id');
		assert.strictEqual(d.name, 'name');

		d = PaneCompositeDescriptor.create(TestViewlet, 'id', 'name', 'class', 5);
		assert.strictEqual(d.id, 'id');
		assert.strictEqual(d.name, 'name');
	});

	test('Viewlet extension point and registration', function () {
		expect(isFunction(Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).registerPaneComposite)).toBe(true);
		expect(isFunction(Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposite)).toBe(true);
		expect(isFunction(Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposites)).toBe(true);

		const oldCount = Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposites().length;
		const d = PaneCompositeDescriptor.create(TestViewlet, 'reg-test-id', 'name');
		Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).registerPaneComposite(d);

		expect(d === Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposite('reg-test-id')).toBe(true);
		assert.strictEqual(oldCount + 1, Registry.as<PaneCompositeRegistry>(Extensions.Viewlets).getPaneComposites().length);
	});
});
