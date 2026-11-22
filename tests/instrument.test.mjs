import test from "node:test";
import assert from "node:assert/strict";
import { makePattern, positionNotes } from "../instrument.js";

test("patterns reject incomplete or incorrectly typed randomness", () => {
  assert.throws(() => makePattern(new Uint8Array(63)), TypeError);
  assert.throws(() => makePattern(Array(64).fill(0)), TypeError);
});

test("all possible byte values map to audible pentatonic notes", () => {
  const names = new Set(["D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5"]);
  for (let value = 0; value < 256; value++) {
    const pattern = makePattern(new Uint8Array(64).fill(value));
    assert.equal(pattern.length, 16);
    for (const note of pattern) {
      assert.ok(names.has(note.name));
      assert.ok(note.frequency >= 290 && note.frequency <= 790);
      assert.ok(note.level >= 0 && note.level <= 1);
    }
  }
});

test("each view stays inside phone and desktop canvases at extreme scatter values", () => {
  for (let seed = 0; seed < 20; seed++) {
    const pattern = makePattern(Uint8Array.from({ length: 64 }, (_, i) => (seed * 31 + i * 19) % 256));
    for (const [width, height] of [[230, 256], [360, 272], [560, 360]]) {
      for (const view of ["orbit", "wave"]) {
        for (const scatter of [-20, 0, 65, 100, 150]) {
          for (const point of positionNotes(pattern, width, height, scatter, view)) {
            assert.ok(point.x >= 0 && point.x <= width);
            assert.ok(point.y >= 0 && point.y <= height);
          }
        }
      }
    }
  }
});

test("scatter and view changes produce distinct geometry without changing the melody", () => {
  const pattern = makePattern(Uint8Array.from({ length: 64 }, (_, i) => (i * 37) % 256));
  const before = structuredClone(pattern);
  assert.notDeepEqual(positionNotes(pattern, 400, 300, 0, "orbit"), positionNotes(pattern, 400, 300, 100, "orbit"));
  assert.notDeepEqual(positionNotes(pattern, 400, 300, 65, "orbit"), positionNotes(pattern, 400, 300, 65, "wave"));
  assert.deepEqual(pattern, before);
});
