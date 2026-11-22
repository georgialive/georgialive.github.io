/** A bounded Fibonacci tiling: pure geometry, separate from DOM controls. */
export function fibonacciTiling(count = 7) {
  if (!Number.isInteger(count) || count < 2 || count > 10) {
    throw new RangeError('Choose 2–10 terms.');
  }
  const tiles = [{ x: 0, y: 0, size: 1, end: [1, 1] }];
  let left = 0, top = 0, right = 1, bottom = 1;
  for (let i = 1; i < count; i++) {
    const size = i === 1 ? 1 : tiles[i - 1].size + tiles[i - 2].size;
    let x, y, end;
    switch ((i - 1) % 4) {
      case 0: x = right; y = top; right += size; end = [right, top]; break;
      case 1: x = left; y = top - size; top = y; end = [left, top]; break;
      case 2: x = left - size; y = top; left = x; end = [left, bottom]; break;
      default: x = left; y = bottom; bottom += size; end = [right, bottom];
    }
    tiles.push({ x, y, size, end });
  }
  return { tiles, left, top, width: right - left, height: bottom - top };
}

export function renderRecursion(svg, count, create) {
  const model = fibonacciTiling(count);
  const scale = Math.min(510 / model.width, 300 / model.height);
  const x = n => 300 + (n - model.left - model.width / 2) * scale;
  const y = n => 192 + (n - model.top - model.height / 2) * scale;
  const colors = ['#ede4f8', '#dce5f5', '#e5d6f4', '#d5e9e6'];
  model.tiles.forEach((tile, i) => {
    const side = tile.size * scale;
    svg.append(create('rect', {
      x: x(tile.x), y: y(tile.y), width: side, height: side,
      fill: i === count - 1 ? '#c6addf' : colors[i % colors.length],
      stroke: '#fff', 'stroke-width': 1.5,
    }));
    if (side > 25) {
      const label = create('text', {
        x: x(tile.x + tile.size / 2), y: y(tile.y + tile.size / 2),
        'text-anchor': 'middle', 'dominant-baseline': 'central',
        fill: '#4e356f', 'font-size': Math.min(34, side / 4),
        'font-family': 'Manrope, sans-serif', 'font-weight': 600,
      });
      label.textContent = tile.size;
      svg.append(label);
    }
  });
  let path = `M ${x(0)} ${y(0)}`;
  for (const tile of model.tiles) {
    const radius = tile.size * scale;
    path += ` A ${radius} ${radius} 0 0 0 ${x(tile.end[0])} ${y(tile.end[1])}`;
  }
  svg.append(create('path', {
    d: path, fill: 'none', stroke: '#7650ad', 'stroke-width': 3,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }));
  const values = model.tiles.map(tile => tile.size);
  const [a, b, current] = count > 2 ? values.slice(-3) : [0, 1, 1];
  const equation = count === 2 ? 'F₁ = 1 · F₂ = 1: our two starting values.' : `${a} + ${b} = ${current}.`;
  const ratio = (values.at(-1) / values.at(-2)).toFixed(5);
  return `${equation} ${count} squares · successive-term ratio ${ratio} (approaching φ ≈ 1.61803). Quarter-circle guide, not an exact golden spiral.`;
}

export function initRecursionControls(root, render) {
  const input = root.querySelector('#recursion-step');
  const terms = root.querySelector('#recursion-terms');
  const back = root.querySelector('#recursion-back');
  const next = root.querySelector('#recursion-next');
  const values = fibonacciTiling(10).tiles.map(tile => tile.size);
  // Each button selects a complete recurrence step, including its two seed terms.
  for (let i = 1; i < values.length; i++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.term = i + 1;
    button.textContent = values[i];
    button.setAttribute('aria-label', `Build through term ${i + 1}: ${values[i]}`);
    terms.append(button);
  }
  function sync() {
    const count = Number(input.value);
    root.querySelector('#recursion-step-value').textContent = `${count} / 10`;
    back.disabled = count === 2;
    next.disabled = count === 10;
    for (const button of terms.children) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.term) === count));
    }
  }
  function select(count) {
    input.value = Math.max(2, Math.min(10, count));
    sync();
    render();
  }
  input.addEventListener('input', sync);
  terms.addEventListener('click', event => {
    const button = event.target.closest('button[data-term]');
    if (button) select(Number(button.dataset.term));
  });
  back.addEventListener('click', () => select(Number(input.value) - 1));
  next.addEventListener('click', () => select(Number(input.value) + 1));
  sync();
}
