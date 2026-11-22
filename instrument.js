// Pure mappings used by the visual instrument, not an entropy estimator.
const SCALE = [62, 65, 67, 69, 72, 74, 77, 79];
const NAMES = ["D4", "F4", "G4", "A4", "C5", "D5", "F5", "G5"];

export function makePattern(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 64) {
    throw new TypeError("A pattern requires exactly 64 bytes.");
  }
  return Array.from({ length: 16 }, (_, index) => {
    const offset = index * 4;
    const scaleIndex = bytes[offset] % SCALE.length;
    const midi = SCALE[scaleIndex];
    return {
      name: NAMES[scaleIndex],
      frequency: 440 * 2 ** ((midi - 69) / 12),
      level: bytes[offset + 1] / 255,
      angle: (bytes[offset + 2] / 255) * Math.PI * 2,
      spread: bytes[offset + 3] / 255,
    };
  });
}

export function positionNotes(pattern, width, height, scatter, view) {
  const amount = Math.min(1, Math.max(0, scatter / 100));
  const radius = Math.max(0, Math.min(width * 0.39, height * 0.37));
  return pattern.map((note, index) => {
    if (view === "wave") {
      return {
        x: width * .08 + (index / 15) * width * .84,
        y: height * .46 + (note.level - .5) * radius * 1.65 * amount,
      };
    }
    const orderedAngle = (index / 16) * Math.PI * 2 - Math.PI / 2;
    const angle = orderedAngle + Math.sin(note.angle) * amount * .65;
    const distance = radius * (1 - amount * .6 + note.spread * amount * .6);
    return { x: width / 2 + Math.cos(angle) * distance, y: height * .46 + Math.sin(angle) * distance };
  });
}
