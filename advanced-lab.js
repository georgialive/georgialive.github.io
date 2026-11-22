import { binaryTree, kochPoints, revolutionLines, revolutionVolume } from "./visual-models.js";
const NS="http://www.w3.org/2000/svg";
function element(tag,attrs={}) {const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;}
const coords=ps=>ps.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
export function initAdvancedLab() {
  const root=document.querySelector('#advanced-lab');if(!root)return;
  const svg=root.querySelector('svg'),output=root.querySelector('[role=status]');
  const panels=[...root.querySelectorAll('[data-advanced-panel]')];
  let selected='revolution';
  function render() {
    svg.replaceChildren();
    const grid=element('path',{d:'M 25 320 H 575 M 300 25 V 365',stroke:'#d8cde8','stroke-width':1});svg.append(grid);
    const title=element('title');svg.append(title);
    if(selected==='revolution') {
      const profile=root.querySelector('#solid-profile').value,sweep=Number(root.querySelector('#solid-sweep').value),rotation=Number(root.querySelector('#solid-rotation').value);
      for(const [i,line]of revolutionLines(profile,sweep,rotation).entries())svg.append(element('polyline',{points:coords(line),fill:'none',stroke:i<17?'#8055b5':'#5572a5','stroke-width':i<17?1.1:1.5,opacity:.78}));
      root.querySelector('#solid-sweep-value').textContent=`${sweep}°`;root.querySelector('#solid-rotation-value').textContent=`${rotation}°`;
      output.textContent=`${{cone:'y = x',paraboloid:'y = √x',sphere:'y = √(1 − x²)'}[profile]} · Volume at ${sweep}°: ${revolutionVolume(profile,sweep).toFixed(3)} cubic units. V = π ∫ y² dx for a full turn.`;
      title.textContent=`Wireframe ${profile}, swept ${sweep} degrees. Rotate the view or change the sweep below.`;
    } else if(selected==='fractal') {
      const depth=Number(root.querySelector('#fractal-depth').value);
      svg.append(element('polyline',{points:coords(kochPoints(depth)),fill:'none',stroke:'#7853b0','stroke-width':2,'stroke-linejoin':'round'}));
      root.querySelector('#fractal-depth-value').textContent=depth;
      output.textContent=`Koch curve · ${4**depth} segments · Length multiplier (4/3)^${depth} = ${((4/3)**depth).toFixed(3)}. Self-similarity links recursion with limits.`;
      title.textContent=`Koch fractal at recursion depth ${depth}.`;
    } else {
      const depth=Number(root.querySelector('#tree-depth').value),visit=Number(root.querySelector('#tree-visit').value),nodes=binaryTree(depth);
      root.querySelector('#tree-depth-value').textContent=depth;
      const active=Math.min(nodes.length-1,Math.round(visit/100*(nodes.length-1)));
      const path=new Set();for(let n=nodes[active];n;n=n.parent===null?null:nodes[n.parent])path.add(n.id);
      for(const n of nodes)if(n.parent!==null){const p=nodes[n.parent];svg.append(element('path',{d:`M${p.x} ${p.y} L${n.x} ${n.y}`,stroke:path.has(n.id)?'#7650b4':'#c7b8dc','stroke-width':path.has(n.id)?3:1.5}));}
      for(const n of nodes){svg.append(element('circle',{cx:n.x,cy:n.y,r:depth>3?6:11,fill:n.id===active?'#6844af':path.has(n.id)?'#c6b0e1':'#ece5f4',stroke:'#8e70b5','stroke-width':1.5}));}
      root.querySelector('#tree-visit-value').textContent=`${active+1}/${nodes.length}`;
      output.textContent=`Binary tree · ${nodes.length} nodes · depth ${depth} · Preorder visit ${active+1}. The highlighted route connects this node to the root.`;
      title.textContent=`Binary tree with ${nodes.length} nodes. Use the traversal control to explore root-to-node paths.`;
    }
  }
  root.addEventListener('input',render);root.querySelector('#solid-profile').addEventListener('change',render);
  const group=document.querySelector('#math-mode-switch');
  group.hidden=false;
  group.addEventListener('click',event=>{const b=event.target.closest('[data-math-mode]');if(!b)return;group.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const waves=b.dataset.mathMode==='waves';document.querySelector('#lissajous-panel').hidden=!waves;root.hidden=waves;if(document.querySelector('#animate-curve').getAttribute('aria-pressed')==='true') document.querySelector('#animate-curve').click(); document.querySelector('#wave-equations').hidden=!waves; if(!waves){selected=b.dataset.mathMode;panels.forEach(p=>p.hidden=p.dataset.advancedPanel!==selected);render();}});
  render();
}
