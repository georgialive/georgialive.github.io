import { detailedConcepts, renderDetailedConcept } from "./course-simulations.js";
import { binaryTree } from "./visual-models.js";
const NS="http://www.w3.org/2000/svg";
const create=(tag,attrs={})=>{const n=document.createElementNS(NS,tag);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
const topics={
'MATH 1004':['integral','An integral accumulates area','Upper limit','Explore how the accumulated area under y = x² grows.'],
'MATH 1104':['matrix','A transformation in motion','Shear','See a matrix shear a square while preserving its area.'],
'MATH 1005':['wave','Oscillation and decay','Damping','Compare oscillation with exponential decay in a model response.'],
'CHEM 1101':['molecule','From atoms to structure','Bond angle','Change the geometry of a simple molecule model.'],
'PHYS 1004':['wave','A wave carries a pattern','Frequency','Increase the frequency and compare the number of oscillations.'],
'ECOR 1031':['code','A loop, step by step','Iterations','A loop adds the next integer to a running total.'],
'SYSC 1006':['tree','Recursion leaves a trail','Depth','Explore a recursive structure one level at a time.'],
'ECOR 1032':['circuit','A simple circuit responds','Voltage','For a fixed resistance, current follows Ohm’s law.'],
'ECOR 1033':['force','Finding the balance','Load position','Move a load and compare the support reactions.'],
'ECOR 1034':['motion','Following a trajectory','Launch angle','Change the angle of a projectile under constant gravity.'],
'SYSC 2004':['objects','Objects with a shared contract','Instances','Explore several objects sharing the same interface.'],
'SYSC 2310':['logic','Two inputs. One decision.','Input state','Change the two binary inputs and inspect an AND gate.'],
'SYSC 2100':['tree','A tree is a way to organise','Depth','Grow a binary tree and compare its size with its depth.'],
'COMP 1805':['sets','Logic becomes structure','Overlap','Explore how sets can share elements.'],
'COMP 2804':['probability','Counting possible outcomes','Trials','Explore the symmetry of a fair-coin binomial distribution.'],
'ECOR 2050':['probability','Patterns in repeated trials','Trials','Compare the distribution of a simple repeated experiment.'],
'CCDP 2100':['process','An idea finds its audience','Detail','Move from a core message to supporting detail.'],
'SYSC 3110':['process','A design grows through feedback','Iteration','Follow a small software design and review cycle.'],
'SYSC 2320':['code','A processor follows instructions','Steps','A small instruction sequence updates a register.'],
'SYSC 3101':['code','One problem, many expressions','Iterations','Compare a loop with the structure of its accumulated result.'],
'SYSC 3120':['process','From a need to a requirement','Detail','Explore how a need branches into testable requirements.'],
'SYSC 3310':['timeline','The deadline is part of the answer','Workload','Compare execution time with a fixed deadline.'],
'SYSC 4001':['timeline','Sharing a processor','Time slice','Explore how tasks alternate on a simple scheduler.'],
'COMP 3005':['database','Tables become relationships','Rows','Add records and follow the relationship between two tables.'],
'SYSC 4120':['process','A system has a shape','Modules','Explore a modular system with a shared central interface.'],
'SYSC 3303':['timeline','Many tasks, one timeline','Time slice','Change a scheduler’s time slice and observe interleaving.'],
'SYSC 4106':['process','A plan connects the work','Milestones','Break a software project into connected milestones.'],
'SYSC 4130':['interface','Design changes what people notice','Target size','Compare a small interaction target with a larger one.'],
'SYSC 4806':['process','Build, review, improve','Iteration','Follow an iterative software engineering workflow.'],
'SYSC 4907 / ECOR 4907':['process','From problem to prototype','Milestones','Explore the stages of a team engineering design project.'],
'SYSC 4101':['tests','Evidence that software behaves','Test cases','Add checks to a representative validation model.'],
'SYSC 4810':['security','A key changes the message','Shift','Explore a Caesar cipher as a historical teaching example—not modern security.'],
'ECOR 4995':['process','Decisions have consequences','Stakeholders','Explore the people connected to a professional decision.'],
'ECOR 2995':['process','Learning leaves evidence','Evidence','Connect learning experiences to a reflective portfolio.'],
'ECOR 1055':['process','Engineering has many paths','Disciplines','Explore connections between engineering disciplines.'],
'ECOR 1056':['process','Connecting the disciplines','Disciplines','Explore how engineering fields meet around a problem.'],
'ECOR 1057':['process','Engineering serves people','Stakeholders','A professional decision connects several responsibilities.'],
};
export function conceptFor(course) {
 const fallback=course.code.startsWith('CSE')?['sets','Ideas across disciplines','Connections','Explore how different fields can share ideas.']:course.code.startsWith('BSE')?['wave','A scientific question to explore','Frequency','A representative wave model; the elective has not yet been selected.']:['process','A direction still to choose','Connections','Explore a representative technical pathway; the elective has not yet been selected.'];
 const [type,title,label,description]=detailedConcepts[course.code]||topics[course.code]||fallback;return {type,title,label,description};
}
export function mountCourseConcept(container,course) {
 const concept=conceptFor(course);container.replaceChildren();
 const heading=document.createElement('h3');heading.textContent=concept.title;
 const svg=create('svg',{viewBox:'0 0 600 360',role:'img','aria-label':concept.description});
 const text=document.createElement('p');text.textContent=concept.description;
 const row=document.createElement('div');row.className='concept-control';
 const label=document.createElement('label');label.htmlFor='concept-value';label.textContent=concept.label;
 const input=document.createElement('input');Object.assign(input,{type:'range',min:'1',max:'8',value:'4',id:'concept-value'});
 const output=document.createElement('output');output.htmlFor='concept-value';output.setAttribute('role','status');
 if(concept.type==='logic') input.max='4';
 if(concept.type==='cpu') input.max='12';
 if(['inheritance','controls','scheduler'].includes(concept.type)) input.max='4';
 if(['memory','factorial'].includes(concept.type)) input.max='6';
 if(['architecture','trace'].includes(concept.type)) input.max='3';
 if(concept.type==='ph'){input.max='14';input.value='7';}
 if(Number(input.value)>Number(input.max)) input.value=input.max;
 row.append(label,input,output);container.append(heading,svg,text,row);
 function draw(){
  const v=Number(input.value);svg.replaceChildren();
  const line=(x1,y1,x2,y2,color='#bda8d6',width=2)=>svg.append(create('line',{x1,y1,x2,y2,stroke:color,'stroke-width':width}));
  const circle=(x,y,r=15,fill='#ded0ee')=>svg.append(create('circle',{cx:x,cy:y,r,fill,stroke:'#7654a0','stroke-width':2}));
  const rect=(x,y,w,h,fill='#e9dff3')=>svg.append(create('rect',{x,y,width:w,height:h,rx:8,fill,stroke:'#9273b6','stroke-width':1.5}));
  const caption=(x,y,value,size=18)=>{const n=create('text',{x,y,fill:'#624781','font-size':size,'text-anchor':'middle','font-family':'system-ui,sans-serif'});n.textContent=value;svg.append(n);};
  const poly=(points,fill='none')=>svg.append(create('polyline',{points,fill,stroke:'#7853b0','stroke-width':2.5,'stroke-linejoin':'round'}));
  output.textContent=String(v);
  const detailed=renderDetailedConcept(course,v,{svg,create,line,circle,rect,caption,poly});
  if(detailed!==null){output.textContent=detailed;input.setAttribute('aria-valuetext',detailed);return;}
  if(concept.type==='integral'){
   line(65,295,545,295);line(65,295,65,35);const end=v/8;let ps='65,295 ';
   for(let i=0;i<=80;i++){const x=i/80*end;ps+=`${65+450*x},${295-235*x*x} `;}poly(ps+`${65+450*end},295`,'#e4d6f1');output.textContent=`∫₀^${end.toFixed(2)} x² dx = ${(end**3/3).toFixed(3)}`;
  }else if(concept.type==='matrix'){
   const sh=(v-4)/4;poly('165,245 345,245 345,65 165,65 165,245');poly(`165,245 345,245 ${345+sh*160},65 ${165+sh*160},65 165,245`,'#dfd0ee88');output.textContent=`[1 ${sh.toFixed(2)}; 0 1]`;
  }else if(concept.type==='wave'){
   line(35,180,565,180);let ps='';for(let i=0;i<=300;i++){let t=i/300;let y=course.code==='MATH 1005'?Math.exp(-v*t/3)*Math.sin(20*t):Math.sin(v*t*Math.PI*2);ps+=`${35+t*530},${180-y*115} `;}poly(ps);output.textContent=course.code==='MATH 1005'?`Decay factor ${v}/3`:`${v} cycles`;
  }else if(concept.type==='molecule'){
   const a=v*Math.PI/12;const x=300+140*Math.cos(a),y=170+140*Math.sin(a);line(300,170,160,170);line(300,170,x,y);circle(300,170,30,'#ad8ed0');circle(160,170,22);circle(x,y,22);caption(300,175,'O');caption(160,176,'H');caption(x,y+6,'H');output.textContent=`Model angle ${Math.round((Math.PI-a)*180/Math.PI)}°`;
  }else if(concept.type==='tree'){
   const depth=Math.min(4,Math.ceil(v/2));const ns=binaryTree(depth);for(const n of ns){if(n.parent!==null){const p=ns[n.parent];line(p.x,p.y,n.x,n.y);}circle(n.x,n.y,depth>3?6:11);}output.textContent=`Depth ${depth} · ${ns.length} nodes`;
  }else if(concept.type==='force'){
   line(85,235,515,235,'#70508f',8);poly('65,270 85,238 105,270','none');poly('495,270 515,238 535,270','none');const x=85+v/9*430;line(x,65,x,220,'#8659b5',5);poly(`${x-10},203 ${x},220 ${x+10},203`);caption(300,315,`R₁ = ${(1-v/9).toFixed(2)}F   ·   R₂ = ${(v/9).toFixed(2)}F`);output.textContent=`Load ${(v/9*100).toFixed(0)}% along beam`;
  }else if(concept.type==='motion'){
   const angle=(15+v*7)*Math.PI/180;let ps='';const flight=2*Math.sin(angle);for(let i=0;i<=100;i++){const t=i/100*flight;ps+=`${50+Math.cos(angle)*t*450},${300-(Math.sin(angle)*t-.5*t*t)*420} `;}line(35,300,565,300);poly(ps);output.textContent=`Launch angle ${15+v*7}°`;
  }else if(concept.type==='circuit'){
   poly('140,160 140,100 450,100 450,260 140,260 140,180');rect(250,80,110,40);line(115,160,165,160,'#7654a0',4);line(125,180,155,180,'#7654a0',4);caption(300,70,'R = 100 Ω');caption(300,320,`I = V / R = ${(v/100).toFixed(2)} A`);output.textContent=`${v} volts`;
  }else if(concept.type==='logic'){
   const a=Math.floor((v-1)/2)%2,b=(v-1)%2;line(90,130,245,130);line(90,230,245,230);rect(245,95,130,170);caption(310,190,'AND');line(375,180,480,180);circle(500,180,22,a&&b?'#b39bd2':'#f5f0f9');caption(90,110,String(a));caption(90,215,String(b));output.textContent=`${a} AND ${b} = ${a&&b?1:0}`;
  }else if(concept.type==='sets'){
   svg.append(create('circle',{cx:220,cy:170,r:90,fill:'#bba0da66',stroke:'#9273b6','stroke-width':2}),create('circle',{cx:400-v*16,cy:170,r:90,fill:'#9db2d466',stroke:'#7794ba','stroke-width':2}));caption(180,175,'A');caption(440-v*16,175,'B');output.textContent=`Shared structure · overlap ${v}`;
  }else if(concept.type==='probability'){
   let choose=1,max=0;const values=[];for(let k=0;k<=v;k++){if(k)choose=choose*(v-k+1)/k;values.push(choose/2**v);max=Math.max(max,values[k]);}values.forEach((p,k)=>{const w=480/(v+1);rect(60+k*w,285-p/max*210,w-8,p/max*210);caption(60+k*w+(w-8)/2,315,String(k));});output.textContent=`${v} fair-coin trials · ${2**v} outcomes`;
  }else if(concept.type==='security'){
   caption(300,100,'M A T H',32);caption(300,190,'+ '+v+' letter shift',18);caption(300,275,[...'MATH'].map(c=>String.fromCharCode((c.charCodeAt(0)-65+v)%26+65)).join(' '),32);output.textContent='Historical cipher · not secure encryption';
  }else if(concept.type==='database'){
   rect(70,55,170,250);rect(360,55,170,250);caption(155,90,'Students');caption(445,90,'Enrolments');line(240,160,360,160);for(let i=0;i<Math.min(v,6);i++){caption(155,125+i*28,`ID ${i+1}`,16);caption(445,125+i*28,`ID ${i+1} · Course`,16);}output.textContent=`${v} related records (first six shown)`;
  }else if(concept.type==='timeline'){
   const limit=course.code==='SYSC 3310';for(let row=0;row<3;row++){caption(45,85+row*75,`T${row+1}`,16);for(let i=0;i<7;i++){if((i+row)%3===0)rect(90+i*65,55+row*75,Math.min(60,v*7),35);}}if(limit)line(90+v*50,40,90+v*50,290,'#a35f7a',3);output.textContent=limit?`Execution budget ${v} units`:`Time slice ${v} units`;
  }else if(concept.type==='interface'){
   rect(145,45,310,265,'#f7f2fb');rect(190,90,220,22);rect(190,130,160,14);rect(300-v*9,235-v*4,v*18,v*8,'#b79bd7');output.textContent=`Target ${v*8}px tall · larger is easier to acquire`;
  }else if(concept.type==='objects'||concept.type==='tests'){
   for(let i=0;i<v;i++){const x=80+(i%4)*125,y=70+Math.floor(i/4)*130;rect(x,y,100,80);caption(x+50,y+35,concept.type==='tests'?'✓':`Object ${i+1}`,16);caption(x+50,y+60,concept.type==='tests'?`Case ${i+1}`:'shared API',14);}output.textContent=concept.type==='tests'?`${v} model checks · passing checks do not prove absence of bugs`:`${v} instances · one interface`;
  }else if(concept.type==='code'){
   caption(300,95,'sum = 0',24);caption(300,160,`for i in 1…${v}: sum += i`,22);caption(300,250,`sum = ${v*(v+1)/2}`,32);output.textContent=`${v} steps · triangular number ${v*(v+1)/2}`;
  }else{
   const n=Math.min(v,7);
   const names=({
    'CCDP 2100':['Audience','Purpose','Evidence','Structure','Clarity','Review','Delivery'],
    'SYSC 3110':['Needs','Design','Code','Test','Review','Refine','Release'],
    'SYSC 3120':['Stakeholder','Need','Constraint','Scenario','Criteria','Trace','Review'],
    'SYSC 4120':['Interface','Service','Storage','Client','Security','Testing','Deploy'],
    'SYSC 4106':['Scope','People','Cost','Risk','Schedule','Quality','Delivery'],
    'SYSC 4806':['Plan','Build','Review','Test','Integrate','Present','Improve'],
    'SYSC 4907 / ECOR 4907':['Problem','Research','Design','Prototype','Test','Evaluate','Present'],
    'ECOR 4995':['Public','Ethics','Safety','Law','Evidence','Peers','Duty'],
    'ECOR 2995':['Design','Evidence','Skills','Reflection','Feedback','Growth','Practice'],
    'ECOR 1055':['Software','Electrical','Mechanical','Civil','Biomedical','Systems','Design'],
    'ECOR 1056':['Software','Electrical','Mechanical','Civil','Biomedical','Systems','Design'],
    'ECOR 1057':['Public','Ethics','Safety','Society','Learning','Teamwork','Duty'],
   })[course.code]||['Design','Systems','Data','People','Science','Code','Practice'];
   const positions=Array.from({length:n},(_,i)=>{const a=i/n*Math.PI*2;return {x:300+165*Math.cos(a),y:175+115*Math.sin(a)};});
   for(const p of positions)line(300,175,p.x,p.y);
   positions.forEach((p,i)=>{rect(p.x-48,p.y-15,96,30);caption(p.x,p.y+5,names[i],13);});
   circle(300,175,36,'#c7b1de');caption(300,181,course.code==='CCDP 2100'?'Message':'Project',15);
   output.textContent=`${n} connected elements`;
  }
 }
 input.addEventListener('input',draw);draw();
}
