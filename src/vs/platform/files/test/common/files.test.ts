/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as assert from 'assert';
import { isEqual, isEqualOrParent } from 'vs/base/common/extpath';
import { isLinux, isMacintosh, isWindows } from 'vs/base/common/platform';
import { URI } from 'vs/base/common/uri';
import { toResource } from 'vs/base/test/common/utils';
import { FileChangeType, FileChangesEvent, isParent } from 'vs/platform/files/common/files';

describe('Files', () => {

	test.skip('FileChangesEvent - basics', function () {
		const changes = [
			{ resource: toResource('/foo/updated.txt'), type: FileChangeType.UPDATED },
			{ resource: toResource('/foo/otherupdated.txt'), type: FileChangeType.UPDATED },
			{ resource: toResource('/added.txt'), type: FileChangeType.ADDED },
			{ resource: toResource('/bar/deleted.txt'), type: FileChangeType.DELETED },
			{ resource: toResource('/bar/folder'), type: FileChangeType.DELETED },
			{ resource: toResource('/BAR/FOLDER'), type: FileChangeType.DELETED }
		];

		for (const ignorePathCasing of [false, true]) {
			const event = new FileChangesEvent(changes, ignorePathCasing);

			expect(!event.contains(toResource('/foo'), FileChangeType.UPDATED)).toBe(true);
			expect(event.affects(toResource('/foo'), FileChangeType.UPDATED));
			expect(event.contains(toResource('/foo/updated.txt'), FileChangeType.UPDATED));
			expect(event.affects(toResource('/foo/updated.txt'), FileChangeType.UPDATED));
			expect(event.contains(toResource('/foo/updated.txt'), FileChangeType.UPDATED, FileChangeType.ADDED));
			expect(event.affects(toResource('/foo/updated.txt'), FileChangeType.UPDATED, FileChangeType.ADDED));
			expect(event.contains(toResource('/foo/updated.txt'), FileChangeType.UPDATED, FileChangeType.ADDED, FileChangeType.DELETED));
			expect(!event.contains(toResource('/foo/updated.txt'), FileChangeType.ADDED, FileChangeType.DELETED));
			expect(!event.contains(toResource('/foo/updated.txt'), FileChangeType.ADDED));
			expect(!event.contains(toResource('/foo/updated.txt'), FileChangeType.DELETED));
			expect(!event.affects(toResource('/foo/updated.txt'), FileChangeType.DELETED));

			expect(event.contains(toResource('/bar/folder'), FileChangeType.DELETED));
			expect(event.contains(toResource('/BAR/FOLDER'), FileChangeType.DELETED));
			expect(event.affects(toResource('/BAR'), FileChangeType.DELETED));
			if (ignorePathCasing) {
				expect(event.contains(toResource('/BAR/folder'), FileChangeType.DELETED));
				expect(event.affects(toResource('/bar'), FileChangeType.DELETED));
			} else {
				expect(!event.contains(toResource('/BAR/folder'), FileChangeType.DELETED));
				expect(event.affects(toResource('/bar'), FileChangeType.DELETED));
			}
			expect(event.contains(toResource('/bar/folder/somefile'), FileChangeType.DELETED));
			expect(event.contains(toResource('/bar/folder/somefile/test.txt'), FileChangeType.DELETED));
			expect(event.contains(toResource('/BAR/FOLDER/somefile/test.txt'), FileChangeType.DELETED));
			if (ignorePathCasing) {
				expect(event.contains(toResource('/BAR/folder/somefile/test.txt'), FileChangeType.DELETED));
			} else {
				expect(!event.contains(toResource('/BAR/folder/somefile/test.txt'), FileChangeType.DELETED));
			}
			expect(!event.contains(toResource('/bar/folder2/somefile'), FileChangeType.DELETED));

			assert.strictEqual(1, event.rawAdded.length);
			assert.strictEqual(2, event.rawUpdated.length);
			assert.strictEqual(3, event.rawDeleted.length);
			assert.strictEqual(true, event.gotAdded());
			assert.strictEqual(true, event.gotUpdated());
			assert.strictEqual(true, event.gotDeleted());
		}
	});

	test.skip('FileChangesEvent - supports multiple changes on file tree', function () {
		for (const type of [FileChangeType.ADDED, FileChangeType.UPDATED, FileChangeType.DELETED]) {
			const changes = [
				{ resource: toResource('/foo/bar/updated.txt'), type },
				{ resource: toResource('/foo/bar/otherupdated.txt'), type },
				{ resource: toResource('/foo/bar'), type },
				{ resource: toResource('/foo'), type },
				{ resource: toResource('/bar'), type },
				{ resource: toResource('/bar/foo'), type },
				{ resource: toResource('/bar/foo/updated.txt'), type },
				{ resource: toResource('/bar/foo/otherupdated.txt'), type }
			];

			for (const ignorePathCasing of [false, true]) {
				const event = new FileChangesEvent(changes, ignorePathCasing);

				for (const change of changes) {
					expect(event.contains(change.resource, type));
					expect(event.affects(change.resource, type));
				}

				expect(event.affects(toResource('/foo'), type));
				expect(event.affects(toResource('/bar'), type));
				expect(event.affects(toResource('/'), type));
				expect(!event.affects(toResource('/foobar'), type));

				expect(!event.contains(toResource('/some/foo/bar'), type));
				expect(!event.affects(toResource('/some/foo/bar'), type));
				expect(!event.contains(toResource('/some/bar'), type));
				expect(!event.affects(toResource('/some/bar'), type));

				switch (type) {
					case FileChangeType.ADDED:
						assert.strictEqual(8, event.rawAdded.length);
						break;
					case FileChangeType.DELETED:
						assert.strictEqual(8, event.rawDeleted.length);
						break;
				}
			}
		}
	});

	function testIsEqual(testMethod: (pA: string, pB: string, ignoreCase: boolean) => boolean): void {

		// corner cases
		expect(testMethod('', '', true));
		expect(!testMethod(null!, '', true));
		expect(!testMethod(undefined!, '', true));

		// basics (string)
		expect(testMethod('/', '/', true));
		expect(testMethod('/some', '/some', true));
		expect(testMethod('/some/path', '/some/path', true));

		expect(testMethod('c:\\', 'c:\\', true));
		expect(testMethod('c:\\some', 'c:\\some', true));
		expect(testMethod('c:\\some\\path', 'c:\\some\\path', true));

		expect(testMethod('/someöäü/path', '/someöäü/path', true));
		expect(testMethod('c:\\someöäü\\path', 'c:\\someöäü\\path', true));

		expect(!testMethod('/some/path', '/some/other/path', true));
		expect(!testMethod('c:\\some\\path', 'c:\\some\\other\\path', true));
		expect(!testMethod('c:\\some\\path', 'd:\\some\\path', true));

		expect(testMethod('/some/path', '/some/PATH', true));
		expect(testMethod('/someöäü/path', '/someÖÄÜ/PATH', true));
		expect(testMethod('c:\\some\\path', 'c:\\some\\PATH', true));
		expect(testMethod('c:\\someöäü\\path', 'c:\\someÖÄÜ\\PATH', true));
		expect(testMethod('c:\\some\\path', 'C:\\some\\PATH', true));
	}

	test('isEqual (ignoreCase)', function () {
		testIsEqual(isEqual);

		// basics (uris)
		expect(isEqual(URI.file('/some/path').fsPath, URI.file('/some/path').fsPath, true));
		expect(isEqual(URI.file('c:\\some\\path').fsPath, URI.file('c:\\some\\path').fsPath, true));

		expect(isEqual(URI.file('/someöäü/path').fsPath, URI.file('/someöäü/path').fsPath, true));
		expect(isEqual(URI.file('c:\\someöäü\\path').fsPath, URI.file('c:\\someöäü\\path').fsPath, true));

		expect(!isEqual(URI.file('/some/path').fsPath, URI.file('/some/other/path').fsPath, true));
		expect(!isEqual(URI.file('c:\\some\\path').fsPath, URI.file('c:\\some\\other\\path').fsPath, true));

		expect(isEqual(URI.file('/some/path').fsPath, URI.file('/some/PATH').fsPath, true));
		expect(isEqual(URI.file('/someöäü/path').fsPath, URI.file('/someÖÄÜ/PATH').fsPath, true));
		expect(isEqual(URI.file('c:\\some\\path').fsPath, URI.file('c:\\some\\PATH').fsPath, true));
		expect(isEqual(URI.file('c:\\someöäü\\path').fsPath, URI.file('c:\\someÖÄÜ\\PATH').fsPath, true));
		expect(isEqual(URI.file('c:\\some\\path').fsPath, URI.file('C:\\some\\PATH').fsPath, true));
	});

	test('isParent (ignorecase)', function () {
		if (isWindows) {
			expect(isParent('c:\\some\\path', 'c:\\', true));
			expect(isParent('c:\\some\\path', 'c:\\some', true));
			expect(isParent('c:\\some\\path', 'c:\\some\\', true));
			expect(isParent('c:\\someöäü\\path', 'c:\\someöäü', true));
			expect(isParent('c:\\someöäü\\path', 'c:\\someöäü\\', true));
			expect(isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar', true));
			expect(isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\', true));

			expect(isParent('c:\\some\\path', 'C:\\', true));
			expect(isParent('c:\\some\\path', 'c:\\SOME', true));
			expect(isParent('c:\\some\\path', 'c:\\SOME\\', true));

			expect(!isParent('c:\\some\\path', 'd:\\', true));
			expect(!isParent('c:\\some\\path', 'c:\\some\\path', true));
			expect(!isParent('c:\\some\\path', 'd:\\some\\path', true));
			expect(!isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\barr', true));
			expect(!isParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test', true));
		}

		if (isMacintosh || isLinux) {
			expect(isParent('/some/path', '/', true));
			expect(isParent('/some/path', '/some', true));
			expect(isParent('/some/path', '/some/', true));
			expect(isParent('/someöäü/path', '/someöäü', true));
			expect(isParent('/someöäü/path', '/someöäü/', true));
			expect(isParent('/foo/bar/test.ts', '/foo/bar', true));
			expect(isParent('/foo/bar/test.ts', '/foo/bar/', true));

			expect(isParent('/some/path', '/SOME', true));
			expect(isParent('/some/path', '/SOME/', true));
			expect(isParent('/someöäü/path', '/SOMEÖÄÜ', true));
			expect(isParent('/someöäü/path', '/SOMEÖÄÜ/', true));

			expect(!isParent('/some/path', '/some/path', true));
			expect(!isParent('/foo/bar/test.ts', '/foo/barr', true));
			expect(!isParent('/foo/bar/test.ts', '/foo/bar/test', true));
		}
	});

	test('isEqualOrParent (ignorecase)', function () {

		// same assertions apply as with isEqual()
		testIsEqual(isEqualOrParent); //

		if (isWindows) {
			expect(isEqualOrParent('c:\\some\\path', 'c:\\', true));
			expect(isEqualOrParent('c:\\some\\path', 'c:\\some', true));
			expect(isEqualOrParent('c:\\some\\path', 'c:\\some\\', true));
			expect(isEqualOrParent('c:\\someöäü\\path', 'c:\\someöäü', true));
			expect(isEqualOrParent('c:\\someöäü\\path', 'c:\\someöäü\\', true));
			expect(isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar', true));
			expect(isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\', true));
			expect(isEqualOrParent('c:\\some\\path', 'c:\\some\\path', true));
			expect(isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test.ts', true));

			expect(isEqualOrParent('c:\\some\\path', 'C:\\', true));
			expect(isEqualOrParent('c:\\some\\path', 'c:\\SOME', true));
			expect(isEqualOrParent('c:\\some\\path', 'c:\\SOME\\', true));

			expect(!isEqualOrParent('c:\\some\\path', 'd:\\', true));
			expect(!isEqualOrParent('c:\\some\\path', 'd:\\some\\path', true));
			expect(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\barr', true));
			expect(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test', true));
			expect(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\bar\\test.', true));
			expect(!isEqualOrParent('c:\\foo\\bar\\test.ts', 'c:\\foo\\BAR\\test.', true));
		}

		if (isMacintosh || isLinux) {
			expect(isEqualOrParent('/some/path', '/', true));
			expect(isEqualOrParent('/some/path', '/some', true));
			expect(isEqualOrParent('/some/path', '/some/', true));
			expect(isEqualOrParent('/someöäü/path', '/someöäü', true));
			expect(isEqualOrParent('/someöäü/path', '/someöäü/', true));
			expect(isEqualOrParent('/foo/bar/test.ts', '/foo/bar', true));
			expect(isEqualOrParent('/foo/bar/test.ts', '/foo/bar/', true));
			expect(isEqualOrParent('/some/path', '/some/path', true));

			expect(isEqualOrParent('/some/path', '/SOME', true));
			expect(isEqualOrParent('/some/path', '/SOME/', true));
			expect(isEqualOrParent('/someöäü/path', '/SOMEÖÄÜ', true));
			expect(isEqualOrParent('/someöäü/path', '/SOMEÖÄÜ/', true));

			expect(!isEqualOrParent('/foo/bar/test.ts', '/foo/barr', true));
			expect(!isEqualOrParent('/foo/bar/test.ts', '/foo/bar/test', true));
			expect(!isEqualOrParent('foo/bar/test.ts', 'foo/bar/test.', true));
			expect(!isEqualOrParent('foo/bar/test.ts', 'foo/BAR/test.', true));
		}
	});
});
