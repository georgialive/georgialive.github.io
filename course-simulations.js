/** Small, bounded teaching models — neither hardware emulators nor security assessments. */
export function fullAdder(a,b,carry){const total=a+b+carry;return {sum:total%2,carry:Math.floor(total/2)};}
export function searchTrace(target){const values=[8,4,12,2,6,10,14],path=[];let i=0;while(i<values.length){path.push(i);if(values[i]===target)return {values,path,found:true};i=2*i+(target<values[i]?1:2);}return {values,path,found:false};}
export function roundRobin(quantum){if(!Number.isInteger(quantum)||quantum<1||quantum>8)throw new RangeError('Quantum must be 1–8.');const remaining=[5,3,4],queue=[0,1,2],segments=[];let time=0;while(queue.length){const task=queue.shift(),length=Math.min(quantum,remaining[task]);segments.push({task,start:time,length});time+=length;remaining[task]-=length;if(remaining[task])queue.push(task);}return segments;}
export function bufferState(step){const operations=['Produce A','Produce B','Consume A','Produce C','Consume B','Consume C','Produce D','Consume D'];let items=[];for(let i=0;i<Math.min(step,8);i++){if(operations[i].startsWith('Produce'))items.push(operations[i].at(-1));else items.shift();}return {items,operation:operations[step-1]};}
export function boundaryTests(count){return [-1,0,1,9,10,11,4,7].slice(0,count).map(value=>({value,expected:value>=0&&value<=10,actual:value>=0&&value<10}));}
export const detailedConcepts={
'SYSC 1006':['memory','Function calls need memory','Call depth','Explore activation frames on the call stack, alongside separately allocated heap data.'],
'SYSC 2004':['inheritance','One interface, different behaviour','Object type','A polymorphic Shape reference dispatches to the object’s own area method.'],
'SYSC 2310':['adder','A full adder from three input bits','Input bits','Choose A, B and carry-in; compare the sum and carry-out.'],
'SYSC 2100':['search','Follow a binary-search-tree lookup','Search target','A balanced example shows how comparisons choose a path through stored keys.'],
'SYSC 2320':['cpu','Fetch. Decode. Execute.','Clock step','Step through a small teaching instruction sequence and inspect its registers.'],
'SYSC 3101':['paradigms','Different languages, the same result','List length','Compare procedural accumulation, a functional fold, and a logic-style relation.'],
'SYSC 3310':['events','Polling versus interrupts','Event time','Move an input event and compare polling detection with a one-unit interrupt response.'],
'SYSC 4001':['scheduler','Sharing the CPU in time slices','Quantum','Change the round-robin time quantum for three ready tasks.'],
'SYSC 3303':['buffer','Two processes coordinate through a buffer','Event step','Step through producer and consumer actions on a bounded shared buffer.'],
'ECOR 2050':['factorial','Separate the effects of two factors','Replicates','A 2×2 experiment varies two factors; replication adds evidence for comparison.'],
'SYSC 3120':['trace','A requirement needs evidence','Requirement','Follow a stakeholder need through a model to a validating test.'],
'SYSC 4120':['architecture','The same system can have different structures','Pattern','Compare layers, model–view–controller, and an event-driven arrangement.'],
'SYSC 4106':['earned','Compare cost with delivered value','Actual cost','Earned-value measures compare planned work, completed work, and spending.'],
'SYSC 4101':['boundary','Tests reveal a boundary defect','Test cases','The intended range includes 10, but this buggy implementation rejects it. Add boundary tests.'],
'SYSC 4810':['controls','Match a threat with a control','Scenario','Explore representative access, input, transport, and privilege controls.'],
'CHEM 1101':['ph','Concentration changes acidity','pH','Explore hydrogen and hydroxide ion concentrations using an ideal aqueous model at 25°C.'],
};
export function renderDetailedConcept(course,v,h){
 const type=detailedConcepts[course.code]?.[0];if(!type)return null;
 const {svg,create,line,circle,rect,caption,poly}=h;
 if(type==='adder'){
  const state=v-1,a=(state>>2)&1,b=(state>>1)&1,c=state&1,r=fullAdder(a,b,c);
  rect(215,75,170,210);caption(300,170,'Full adder',22);caption(300,202,'A + B + Cᵢₙ',18);
  [a,b,c].forEach((bit,i)=>{const y=110+i*70;line(95,y,215,y);circle(95,y,19,bit?'#b99bd8':'#f8f4fb');caption(95,y+6,String(bit));caption(60,y-25,['A','B','Cᵢₙ'][i],15);});
  [r.sum,r.carry].forEach((bit,i)=>{const y=135+i*105;line(385,y,500,y);circle(500,y,21,bit?'#b99bd8':'#f8f4fb');caption(500,y+6,String(bit));caption(500,y-32,['Sum','Carry'][i],16);});return `${a} + ${b} + ${c} = ${r.carry}${r.sum}₂ (${a+b+c} in decimal)`;
 }
 if(type==='search'){
  const target=[2,4,6,8,10,12,14,7][v-1],r=searchTrace(target),ps=[{x:300,y:60},{x:170,y:150},{x:430,y:150},{x:100,y:260},{x:235,y:260},{x:365,y:260},{x:500,y:260}];
  ps.forEach((p,i)=>{if(i){const q=ps[Math.floor((i-1)/2)];line(q.x,q.y,p.x,p.y,r.path.includes(i)?'#7650ad':'#d0c0df',r.path.includes(i)?4:2);}});
  ps.forEach((p,i)=>{circle(p.x,p.y,24,r.path.includes(i)?'#b99bd8':'#f3edf8');caption(p.x,p.y+7,String(r.values[i]),20);});return `Find ${target}: ${r.path.map(i=>r.values[i]).join(' → ')} · ${r.path.length} comparisons · ${r.found?'found':'not present'}`;
 }
 if(type==='memory'){
  const d=Math.min(v,6);caption(175,30,'Call stack',18);caption(440,30,'Heap allocation',18);rect(65,45,220,270,'#f8f4fc');rect(330,75,220,180,'#f8f4fc');
  for(let i=0;i<d;i++){rect(85,275-i*36,180,30);caption(175,296-i*36,`call(${d-i}) · local n`,14);}rect(355,120,170,70,'#d8c7e9');caption(440,148,'dynamic array',16);caption(440,175,'separate lifetime',14);line(285,150,355,150);return `${d} active call frames; returning removes a frame. Heap data is managed separately.`;
 }
 if(type==='inheritance'){
  const kinds=['Circle','Square','Triangle','Rectangle'],kind=kinds[(v-1)%4];rect(200,30,200,85);caption(300,60,'Shape',20);caption(300,91,'area() interface',16);line(300,115,300,170);poly('290,138 300,120 310,138');rect(200,170,200,85,'#dccbed');caption(300,205,kind,22);caption(300,235,'overrides area()',16);caption(300,315,`Shape reference → ${kind}.area()`,19);return `Shared interface, type-specific implementation: ${kind}.area()`;
 }
 if(type==='cpu'){
  const step=Math.min(v,12),idx=Math.floor((step-1)/3),phase=(step-1)%3,program=['LOAD 3','ADD 4','STORE [0]','HALT'],acc=step>=6?7:step>=3?3:0;
  ['Fetch','Decode','Execute'].forEach((s,i)=>{rect(40+i*185,45,155,55,i===phase?'#c6acdf':'#f3edf8');caption(118+i*185,80,s,18);if(i<2)line(195+i*185,73,225+i*185,73);});
  rect(60,145,220,155);caption(170,177,'Program memory',17);program.forEach((s,i)=>caption(170,205+i*24,`${i}: ${s}`,15));rect(340,145,200,155);caption(440,180,`PC: ${idx}`,19);caption(440,216,`IR: ${phase===0?'fetching…':program[idx]}`,16);caption(440,250,`ACC: ${acc}`,21);caption(440,280,`[0]: ${step>=9?7:0}`,17);return `Step ${step}/12 · ${program[idx]} · ${['fetch instruction','decode operation','execute operation'][phase]}`;
 }
 if(type==='paradigms'){
  const total=v*(v+1)/2;['Procedural','Functional','Logic-style'].forEach((s,i)=>{rect(45,25+i*103,510,85);caption(300,52+i*103,s,17);caption(300,82+i*103,[`for n in 1…${v}: sum += n`,`fold(+, 0, [1…${v}])`,`sum([1…${v}], Result)`][i],19);});return `Three representations · sum of [1…${v}] = ${total}`;
 }
 if(type==='events'){
  const poll=4*Math.ceil(v/4),irq=v+1;['Polling','Interrupt'].forEach((s,row)=>{const y=100+row*130;caption(80,y,s,17);line(155,y,555,y);for(let t=0;t<=12;t+=4){line(155+t*31,y-15,155+t*31,y+15);caption(155+t*31,y+38,String(t),14);}circle(155+v*31,y,9,'#bda2d8');circle(155+(row?irq:poll)*31,y-35,10,'#9ebcae');});return `Event at ${v}; polling detects at ${poll} (delay ${poll-v}); model interrupt at ${irq} (delay 1).`;
 }
 if(type==='scheduler'){
  const q=v,segments=roundRobin(q),colors=['#bba0d6','#9eb7d3','#a5c3af'];caption(300,50,'Round-robin ready queue: T1, T2, T3',18);
  segments.forEach(s=>{rect(45+s.start*42,110,s.length*42-3,70,colors[s.task]);caption(45+(s.start+s.length/2)*42,152,`T${s.task+1}`,16);});for(let i=0;i<=12;i++)caption(45+i*42,215,String(i),13);return `Quantum ${q} · work: T1=5, T2=3, T3=4 · ${segments.length} CPU slices, 12 total time units.`;
 }
 if(type==='buffer'){
  const r=bufferState(v);rect(20,100,130,110);caption(85,148,'Producer',18);line(150,155,210,155);line(390,155,450,155);rect(450,100,130,110);caption(515,148,'Consumer',18);for(let i=0;i<3;i++){rect(205+i*65,125,55,60,r.items[i]?'#bea2d7':'#f5f0fa');caption(232+i*65,162,r.items[i]||'—',20);}caption(300,280,r.operation,22);return `Step ${v}: ${r.operation} · ${r.items.length}/3 slots occupied · coordinated access prevents races.`;
 }
 if(type==='factorial'){
  const r=Math.min(v,6);caption(300,30,'Factor A: low / high × Factor B: low / high',17);for(let i=0;i<4;i++){const x=70+(i%2)*250,y=65+Math.floor(i/2)*140;rect(x,y,210,115);caption(x+105,y+28,`A${i%2?'high':'low'} · B${i>1?'high':'low'}`,16);for(let j=0;j<r;j++)circle(x+25+j*31,y+75,8,'#b69acf');}return `2² factorial design · ${r} replicates per treatment · ${4*r} observations. Randomise run order to reduce bias.`;
 }
 if(type==='trace'){
  const i=(v-1)%3,rows=[['User can sign in','Authentication model','Valid/invalid login tests'],['Data remains private','Access-control model','Unauthorised-read tests'],['Service responds promptly','Timing requirement','Response-time tests']];
  ['Stakeholder need','Analysis model','Validation evidence'].forEach((s,j)=>{rect(45,25+j*110,510,85,j===1?'#ddcfed':'#f6f1fa');caption(300,53+j*110,s,16);caption(300,85+j*110,rows[i][j],18);if(j<2)line(300,110+j*110,300,135+j*110);});return `Traceability: a stated need is linked to a model and a way to validate it.`;
 }
 if(type==='architecture'){
  const pattern=(v-1)%3,names=[['Presentation','Domain logic','Data access'],['View','Controller','Model'],['Publisher','Event bus','Subscriber']][pattern];
  names.forEach((name,i)=>{rect(135,25+i*110,330,75,i===1?'#ccb5e2':'#eee5f7');caption(300,70+i*110,name,22);if(i<2)line(300,100+i*110,300,135+i*110);});return ['Layered architecture: responsibilities are separated into levels.','MVC: user input, displayed information, and application state have separate roles.','Event-driven architecture: publishers and subscribers communicate through events.'][pattern];
 }
 if(type==='earned'){
  const actual=20+v*10,values=[100,80,actual];['Planned value','Earned value','Actual cost'].forEach((name,i)=>{caption(95,65+i*95,name,16);rect(190,35+i*95,values[i]*3.2,45,['#cbb6e1','#a4c4af','#a7b9d3'][i]);caption(215+values[i]*3.2,64+i*95,String(values[i]),17);});return `PV=100, EV=80, AC=${actual} · schedule index=0.80 · cost index=${(80/actual).toFixed(2)}. Values use the same cost units.`;
 }
 if(type==='boundary'){
  const rows=boundaryTests(v);caption(300,35,'Specification: 0 ≤ x ≤ 10 · bug: 0 ≤ x < 10',18);rows.forEach((r,i)=>{const x=65+(i%4)*135,y=85+Math.floor(i/4)*120,pass=r.expected===r.actual;rect(x,y,115,90,pass?'#dcebe0':'#f1d7df');caption(x+57,y+32,`x = ${r.value}`,19);caption(x+57,y+63,pass?'matches':'defect found',14);});return `${v} test cases · ${rows.filter(r=>r.expected!==r.actual).length} detected mismatch(es). Testing selected inputs is not a proof of correctness.`;
 }
 if(type==='controls'){
  const i=(v-1)%4,scenarios=[['Unauthorised admin request','Access control','Deny privileged operation'],['Untrusted database input','Parameterised query','Separate data from commands'],['Data crosses a network','Transport encryption','Protect data in transit'],['One component is compromised','Least privilege','Limit accessible resources']];
  ['Client','Service boundary','Application','Data'].forEach((name,j)=>{rect(35+j*145,95,125,90,j===1?'#c5addd':'#ede5f5');caption(97+j*145,146,name,15);if(j<3)line(160+j*145,140,180+j*145,140);});caption(300,55,scenarios[i][0],19);caption(300,245,scenarios[i][1],24);caption(300,285,scenarios[i][2],18);return 'A conceptual threat–control match; real security requires layered controls and validation.';
 }
 if(type==='ph'){
  const ph=v,acid=ph<7,base=ph>7;poly('205,65 205,290 395,290 395,65');rect(210,150,180,135,acid?'#edc8d6':base?'#b8cddd':'#c8decf');caption(300,120,`pH ${ph}`,28);caption(300,330,acid?'Acidic':base?'Basic':'Neutral',21);return `[H⁺] = ${(10**-ph).toExponential(1)} M; [OH⁻] = ${(10**(ph-14)).toExponential(1)} M at 25°C.`;
 }
 return null;
}
