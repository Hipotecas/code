// @vitest-environment node
import * as assert from 'assert';
import * as uuid from 'vs/base/common/uuid';

describe('UUID', () => {
	test('generation', () => {
		const asHex = uuid.generateUuid();
		assert.strictEqual(asHex.length, 36);
		assert.strictEqual(asHex[14], '4');
		expect(asHex[19] === '8' || asHex[19] === '9' || asHex[19] === 'a' || asHex[19] === 'b').toBe(true);
	});

	test('self-check', function () {
		const t1 = Date.now();
		while (Date.now() - t1 < 50) {
			const value = uuid.generateUuid();
			expect(uuid.isUUID(value)).toBe(true);
		}
	});
});
