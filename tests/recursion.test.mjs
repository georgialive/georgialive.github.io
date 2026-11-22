import test from 'node:test';
import assert from 'node:assert/strict';
import { fibonacciTiling } from '../recursion-lab.js';

test('recursive square tiling preserves sequence, area and non-overlap at every step', () => {
  for (let count = 2; count <= 10; count++) {
    const {tiles, width, height} = fibonacciTiling(count);
    assert.equal(tiles.length, count);
    assert.deepEqual(tiles.slice(0, 2).map(t => t.size), [1, 1]);
    for (let i = 2; i < count; i++) assert.equal(tiles[i].size, tiles[i-1].size + tiles[i-2].size);
    assert.equal(tiles.reduce((area, t) => area + t.size ** 2, 0), width * height);
    for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) {
      const a = tiles[i], b = tiles[j];
      assert.ok(a.x + a.size <= b.x || b.x + b.size <= a.x || a.y + a.size <= b.y || b.y + b.size <= a.y);
    }
  }
  assert.equal(fibonacciTiling(10).tiles.at(-1).size, 55);
  for (const count of [0, 1, 11, 2.5, NaN]) assert.throws(() => fibonacciTiling(count), RangeError);
});
