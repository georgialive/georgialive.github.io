import { renderRecursion, initRecursionControls } from './recursion-lab.js';
import { binaryTree, revolutionLines, revolutionVolume } from './visual-models.js';

const NS = 'http://www.w3.org/2000/svg';
const PROFILE_LABELS = { cone: 'y = x', paraboloid: 'y = √x', sphere: 'y = √(1 − x²)' };
const coordinates = points => points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

function element(tag, attributes = {}) {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
}

function renderSolid(root, svg) {
  const profile = root.querySelector('#solid-profile').value;
  const sweep = Number(root.querySelector('#solid-sweep').value);
  const rotation = Number(root.querySelector('#solid-rotation').value);
  for (const [i, line] of revolutionLines(profile, sweep, rotation).entries()) {
    svg.append(element('polyline', {
      points: coordinates(line), fill: 'none', stroke: i < 17 ? '#8055b5' : '#5572a5',
      'stroke-width': i < 17 ? 1.1 : 1.5, opacity: .78,
    }));
  }
  root.querySelector('#solid-sweep-value').textContent = `${sweep}°`;
  root.querySelector('#solid-rotation-value').textContent = `${rotation}°`;
  return {
    title: `Wireframe ${profile}, swept ${sweep} degrees. Rotate the view or change the sweep below.`,
    description: `${PROFILE_LABELS[profile]} · Volume at ${sweep}°: ${revolutionVolume(profile, sweep).toFixed(3)} cubic units. V = π ∫ y² dx for a full turn.`,
  };
}

function renderTree(root, svg) {
  const depth = Number(root.querySelector('#tree-depth').value);
  const visit = Number(root.querySelector('#tree-visit').value);
  const nodes = binaryTree(depth);
  const active = Math.min(nodes.length - 1, Math.round(visit / 100 * (nodes.length - 1)));
  const path = new Set();
  for (let node = nodes[active]; node; node = node.parent === null ? null : nodes[node.parent]) path.add(node.id);
  for (const node of nodes) {
    if (node.parent !== null) {
      const parent = nodes[node.parent];
      svg.append(element('path', {
        d: `M${parent.x} ${parent.y} L${node.x} ${node.y}`,
        stroke: path.has(node.id) ? '#7650b4' : '#c7b8dc',
        'stroke-width': path.has(node.id) ? 3 : 1.5,
      }));
    }
    svg.append(element('circle', {
      cx: node.x, cy: node.y, r: depth > 3 ? 6 : 11,
      fill: node.id === active ? '#6844af' : path.has(node.id) ? '#c6b0e1' : '#ece5f4',
      stroke: '#8e70b5', 'stroke-width': 1.5,
    }));
  }
  root.querySelector('#tree-depth-value').textContent = depth;
  root.querySelector('#tree-visit-value').textContent = `${active + 1}/${nodes.length}`;
  return {
    title: `Binary tree with ${nodes.length} nodes. Use the traversal control to explore root-to-node paths.`,
    description: `Binary tree · ${nodes.length} nodes · depth ${depth} · Preorder visit ${active + 1}. The highlighted route connects this node to the root.`,
  };
}

export function initAdvancedLab() {
  const root = document.querySelector('#advanced-lab');
  if (!root) return;
  const svg = root.querySelector('svg');
  const output = root.querySelector('[role=status]');
  const panels = [...root.querySelectorAll('[data-advanced-panel]')];
  const group = document.querySelector('#math-mode-switch');
  const wavePanel = document.querySelector('#lissajous-panel');
  const waveEquations = document.querySelector('#wave-equations');
  const animateCurve = document.querySelector('#animate-curve');
  let selected = 'revolution';

  function render() {
    svg.replaceChildren();
    const title = element('title');
    svg.append(title);
    if (selected !== 'recursion') svg.append(element('path', {
      d: 'M 25 320 H 575 M 300 25 V 365', stroke: '#d8cde8', 'stroke-width': 1,
    }));
    if (selected === 'recursion') {
      const count = Number(root.querySelector('#recursion-step').value);
      output.textContent = renderRecursion(svg, count, element);
      title.textContent = `Fibonacci square tiling through term ${count}. Each square’s side is the sum of the previous two.`;
    } else {
      const result = selected === 'revolution' ? renderSolid(root, svg) : renderTree(root, svg);
      title.textContent = result.title;
      output.textContent = result.description;
    }
    svg.setAttribute('aria-label', title.textContent);
  }

  initRecursionControls(root, render);
  root.addEventListener('input', render);
  root.querySelector('#solid-profile').addEventListener('change', render);
  group.hidden = false;
  group.addEventListener('click', event => {
    const button = event.target.closest('[data-math-mode]');
    if (!button) return;
    for (const item of group.querySelectorAll('button')) item.setAttribute('aria-pressed', String(item === button));
    const waves = button.dataset.mathMode === 'waves';
    wavePanel.hidden = !waves;
    waveEquations.hidden = !waves;
    root.hidden = waves;
    if (animateCurve.getAttribute('aria-pressed') === 'true') animateCurve.click();
    if (!waves) {
      selected = button.dataset.mathMode;
      for (const panel of panels) panel.hidden = panel.dataset.advancedPanel !== selected;
      render();
    }
  });
  render();
}
