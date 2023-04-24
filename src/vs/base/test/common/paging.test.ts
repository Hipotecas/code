/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { CancellationToken, CancellationTokenSource } from 'vs/base/common/cancellation';
import { canceled, isCancellationError } from 'vs/base/common/errors';
import { IPager, PagedModel } from 'vs/base/common/paging';

function getPage(pageIndex: number, cancellationToken: CancellationToken): Promise<number[]> {
	if (cancellationToken.isCancellationRequested) {
		return Promise.reject(canceled());
	}

	return Promise.resolve([0, 1, 2, 3, 4].map(i => i + (pageIndex * 5)));
}

class TestPager implements IPager<number> {

	readonly firstPage = [0, 1, 2, 3, 4];
	readonly pageSize = 5;
	readonly total = 100;
	readonly getPage: (pageIndex: number, cancellationToken: CancellationToken) => Promise<number[]>;

	constructor(getPageFn?: (pageIndex: number, cancellationToken: CancellationToken) => Promise<number[]>) {
		this.getPage = getPageFn || getPage;
	}
}

describe('PagedModel', () => {

	test('isResolved', () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		expect(model.isResolved(0)).toBe(true);
		expect(model.isResolved(1)).toBe(true);
		expect(model.isResolved(2)).toBe(true);
		expect(model.isResolved(3)).toBe(true);
		expect(model.isResolved(4)).toBe(true);
		expect(!model.isResolved(5)).toBe(true);
		expect(!model.isResolved(6)).toBe(true);
		expect(!model.isResolved(7)).toBe(true);
		expect(!model.isResolved(8)).toBe(true);
		expect(!model.isResolved(9)).toBe(true);
		expect(!model.isResolved(10)).toBe(true);
		expect(!model.isResolved(99)).toBe(true);
	});

	test('resolve single', async () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		expect(!model.isResolved(5)).toBe(true);

		await model.resolve(5, CancellationToken.None);
		expect(model.isResolved(5)).toBe(true);
	});

	test('resolve page', async () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		expect(!model.isResolved(5)).toBe(true);
		expect(!model.isResolved(6)).toBe(true);
		expect(!model.isResolved(7)).toBe(true);
		expect(!model.isResolved(8)).toBe(true);
		expect(!model.isResolved(9)).toBe(true);
		expect(!model.isResolved(10)).toBe(true);

		await model.resolve(5, CancellationToken.None);
		expect(model.isResolved(5)).toBe(true);
		expect(model.isResolved(6)).toBe(true);
		expect(model.isResolved(7)).toBe(true);
		expect(model.isResolved(8)).toBe(true);
		expect(model.isResolved(9)).toBe(true);
		expect(!model.isResolved(10)).toBe(true);
	});

	test('resolve page 2', async () => {
		const pager = new TestPager();
		const model = new PagedModel(pager);

		expect(!model.isResolved(5)).toBe(true);
		expect(!model.isResolved(6)).toBe(true);
		expect(!model.isResolved(7)).toBe(true);
		expect(!model.isResolved(8)).toBe(true);
		expect(!model.isResolved(9)).toBe(true);
		expect(!model.isResolved(10)).toBe(true);

		await model.resolve(10, CancellationToken.None);
		expect(!model.isResolved(5)).toBe(true);
		expect(!model.isResolved(6)).toBe(true);
		expect(!model.isResolved(7)).toBe(true);
		expect(!model.isResolved(8)).toBe(true);
		expect(!model.isResolved(9)).toBe(true);
		expect(model.isResolved(10)).toBe(true);
	});

	test('preemptive cancellation works', async function () {
		const pager = new TestPager(() => {
      return Promise.resolve([])
		});

		const model = new PagedModel(pager);

		try {
			await model.resolve(5, CancellationToken.Cancelled);
			return (false);
		}
		catch (err) {
			return (isCancellationError(err));
		}
	});

	test('cancellation works', function () {
		const pager = new TestPager((_, token) => new Promise((_, e) => {
			token.onCancellationRequested(() => e(canceled()));
		}));

		const model = new PagedModel(pager);
		const tokenSource = new CancellationTokenSource();

		const promise = model.resolve(5, tokenSource.token).then(
			() => console.log(false),
			err => console.log(isCancellationError(err))
		);

		setTimeout(() => tokenSource.cancel(), 10);

		return promise;
	});

	test('same page cancellation works', function () {
		let state = 'idle';

		const pager = new TestPager((pageIndex, token) => {
			state = 'resolving';

			return new Promise((_, e) => {
				token.onCancellationRequested(() => {
					state = 'idle';
					e(canceled());
				});
			});
		});

		const model = new PagedModel(pager);

		assert.strictEqual(state, 'idle');

		const tokenSource1 = new CancellationTokenSource();
		const promise1 = model.resolve(5, tokenSource1.token).then(
			() => console.log(false),
			err => console.log(isCancellationError(err))
		);

		assert.strictEqual(state, 'resolving');

		const tokenSource2 = new CancellationTokenSource();
		const promise2 = model.resolve(6, tokenSource2.token).then(
			() => console.log(false),
			err => console.log(isCancellationError(err))
		);

		assert.strictEqual(state, 'resolving');

		setTimeout(() => {
			assert.strictEqual(state, 'resolving');
			tokenSource1.cancel();
			assert.strictEqual(state, 'resolving');

			setTimeout(() => {
				assert.strictEqual(state, 'resolving');
				tokenSource2.cancel();
				assert.strictEqual(state, 'idle');
			}, 10);
		}, 10);

		return Promise.all([promise1, promise2]);
	});
});
