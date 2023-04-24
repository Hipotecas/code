/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { writeUInt16LE } from 'vs/base/common/buffer';
import { CharCode } from 'vs/base/common/charCode';
import { decodeUTF16LE, StringBuilder } from 'vs/editor/common/core/stringBuilder';

describe('decodeUTF16LE', () => {

	test('issue #118041: unicode character undo bug 1', () => {
		const buff = new Uint8Array(2);
		writeUInt16LE(buff, '﻿'.charCodeAt(0), 0);
		const actual = decodeUTF16LE(buff, 0, 1);
		expect(actual).toStrictEqual('﻿')
	});

	test('issue #118041: unicode character undo bug 2', () => {
		const buff = new Uint8Array(4);
		writeUInt16LE(buff, 'a﻿'.charCodeAt(0), 0);
		writeUInt16LE(buff, 'a﻿'.charCodeAt(1), 2);
		const actual = decodeUTF16LE(buff, 0, 2);
		expect(actual).toStrictEqual('a﻿')
	});

	test('issue #118041: unicode character undo bug 3', () => {
		const buff = new Uint8Array(6);
		writeUInt16LE(buff, 'a﻿b'.charCodeAt(0), 0);
		writeUInt16LE(buff, 'a﻿b'.charCodeAt(1), 2);
		writeUInt16LE(buff, 'a﻿b'.charCodeAt(2), 4);
		const actual = decodeUTF16LE(buff, 0, 3);
		expect(actual).toStrictEqual('a﻿b')
	});

});

describe('StringBuilder', () => {
	test('basic', () => {
		const sb = new StringBuilder(100);
		sb.appendASCIICharCode(CharCode.A);
		sb.appendASCIICharCode(CharCode.Space);
		sb.appendString('😊');
		expect(sb.build()).toStrictEqual('A 😊')
	});
});
