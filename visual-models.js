/** Deterministic geometry shared by the math playground and course miniatures. */
export function kochPoints(depth = 3) {
  if (!Number.isInteger(depth) || depth < 0 || depth > 5) throw new RangeError("Depth must be 0–5.");
  let points = [{x:60,y:280},{x:540,y:280}];
  for (let n=0;n<depth;n++) {
    const next=[points[0]];
    for(let i=1;i<points.length;i++) {
      const a=points[i-1],b=points[i], dx=(b.x-a.x)/3,dy=(b.y-a.y)/3;
      next.push({x:a.x+dx,y:a.y+dy},{x:a.x+1.5*dx+Math.sqrt(3)/2*dy,y:a.y+1.5*dy-Math.sqrt(3)/2*dx},{x:a.x+2*dx,y:a.y+2*dy},b);
    }
    points=next;
  }
  return points;
}
export function binaryTree(depth = 3) {
  if (!Number.isInteger(depth) || depth < 1 || depth > 5) throw new RangeError("Depth must be 1–5.");
  const nodes=[];
  function visit(level,slot,parent) {
    const id=nodes.length;
    nodes.push({id,parent,x:(slot+.5)*560/2**level+20,y:45+level*65,level});
    if(level<depth) {visit(level+1,slot*2,id);visit(level+1,slot*2+1,id);}
  }
  visit(0,0,null);
  return nodes;
}
export function revolutionRadius(profile,x) {
  if(profile==='sphere') return Math.sqrt(Math.max(0,1-x*x));
  return profile==='paraboloid' ? Math.sqrt(Math.max(0,x)) : x;
}
export function revolutionVolume(profile,sweep=360) {
  return ({sphere:4*Math.PI/3,paraboloid:Math.PI/2,cone:Math.PI/3}[profile] ?? Math.PI/3)*sweep/360;
}
export function revolutionLines(profile='paraboloid',sweep=360,rotation=25) {
  const project=(x,y,z)=>{
    const r=rotation*Math.PI/180,e=.35;
    const centered=x-(profile==='sphere'?0:.5);
    const horizontal=centered*Math.cos(r)+z*Math.sin(r);
    const depth=-centered*Math.sin(r)+z*Math.cos(r);
    const vertical=y*Math.cos(e)-depth*Math.sin(e);
    return {x:300+horizontal*145,y:200-vertical*145};
  };
  const start=profile==='sphere'?-1:0,lines=[];
  for(let i=0;i<=16;i++) {
    const x=start+(1-start)*i/16,r=revolutionRadius(profile,x);
    lines.push(Array.from({length:65},(_,j)=>{const t=j/64*sweep*Math.PI/180;return project(x,r*Math.cos(t),r*Math.sin(t));}));
  }
  for(let j=0;j<=12;j++) {
    const t=j/12*sweep*Math.PI/180;
    lines.push(Array.from({length:41},(_,i)=>{const x=start+(1-start)*i/40,r=revolutionRadius(profile,x);return project(x,r*Math.cos(t),r*Math.sin(t));}));
  }
  return lines;
}
