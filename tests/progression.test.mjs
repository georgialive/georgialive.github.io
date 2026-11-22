import test from 'node:test';
import assert from 'node:assert/strict';
import {courses,courseStatus,torontoDate,semesterSchedule} from '../course-data.js';
import {binaryTree,kochPoints,revolutionVolume,revolutionLines} from '../visual-models.js';
import {conceptFor} from '../course-concepts.js';

test('semester rollover uses Toronto dates and waits until after final exam day',()=>{
 const fall=courses.find(c=>c.code==='COMP 1805'),winter=courses.find(c=>c.code==='COMP 2804');
 assert.equal(courseStatus(fall,'2026-12-23'),'current');
 assert.equal(courseStatus(fall,'2026-12-24'),'completed');
 assert.equal(courseStatus(winter,'2027-01-05'),'future');
 assert.equal(courseStatus(winter,'2027-01-06'),'current');
 assert.equal(courseStatus(winter,'2027-04-23'),'current');
 assert.equal(courseStatus(winter,'2027-04-24'),'completed');
 assert.equal(torontoDate(new Date('2026-12-24T03:00:00Z')),'2026-12-23');
 assert.equal(torontoDate(new Date('2026-12-24T05:00:00Z')),'2026-12-24');
});
test('all planned semesters and course overrides behave consistently',()=>{
 for(const c of courses.filter(c=>c.year>1)){
  const s=semesterSchedule[`${c.year}-${c.term}`];assert.ok(s);
  assert.equal(courseStatus(c,s.start),'current');assert.equal(courseStatus(c,s.end),'current');
  const after=new Date(`${s.end}T12:00:00Z`);after.setUTCDate(after.getUTCDate()+1);
  assert.equal(courseStatus(c,after),'completed');
  assert.equal(courseStatus({...c,statusOverride:'future'},after),'future');
 }
 const capstone=courses.find(c=>c.term==='Full year');assert.equal(courseStatus(capstone,'2028-12-31'),'current');
});
test('Koch recursion and binary tree preserve their structural invariants',()=>{
 for(let d=0;d<=5;d++){const ps=kochPoints(d);assert.equal(ps.length,4**d+1);let length=0;for(let i=1;i<ps.length;i++)length+=Math.hypot(ps[i].x-ps[i-1].x,ps[i].y-ps[i-1].y);assert.ok(Math.abs(length-480*(4/3)**d)<1e-6);}
 for(let d=1;d<=5;d++){const ns=binaryTree(d);assert.equal(ns.length,2**(d+1)-1);assert.equal(ns.filter(n=>n.parent===null).length,1);for(const n of ns)if(n.parent!==null){assert.ok(n.parent<n.id);assert.equal(ns[n.parent].level,n.level-1);}}
});
test('solid volume respects sweep and wireframe coordinates remain finite',()=>{
 assert.ok(Math.abs(revolutionVolume('sphere')-4*Math.PI/3)<1e-10);
 assert.ok(Math.abs(revolutionVolume('cone',180)-Math.PI/6)<1e-10);
 assert.equal(revolutionVolume('paraboloid',0),0);
 for(const profile of ['cone','sphere','paraboloid'])for(const sweep of [0,180,360])assert.ok(revolutionLines(profile,sweep,270).flat().every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
});
test('every course and elective has a usable concept description',()=>{
 for(const c of courses){const spec=conceptFor(c);assert.ok(spec.type&&spec.title&&spec.label&&spec.description);}
});
