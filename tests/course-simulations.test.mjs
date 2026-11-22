import test from 'node:test';
import assert from 'node:assert/strict';
import {fullAdder,searchTrace,roundRobin,bufferState,boundaryTests} from '../course-simulations.js';
import {detailsFor} from '../course-details.js';
import {courses} from '../course-data.js';
test('full adder truth table preserves all eight binary sums',()=>{
 for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++){const r=fullAdder(a,b,c);assert.equal(r.sum+2*r.carry,a+b+c);}
});
test('balanced search follows the actual comparison path',()=>{
 assert.deepEqual(searchTrace(6).path,[0,1,4]);assert.equal(searchTrace(6).found,true);assert.equal(searchTrace(7).found,false);assert.deepEqual(searchTrace(7).path,[0,1,4]);
});
test('round robin preserves work and respects each quantum',()=>{
 for(let q=1;q<=4;q++){const s=roundRobin(q);assert.equal(s.reduce((n,x)=>n+x.length,0),12);for(let i=0;i<s.length;i++){assert.ok(s[i].length<=q);if(i)assert.equal(s[i].start,s[i-1].start+s[i-1].length);}assert.deepEqual([0,1,2].map(t=>s.filter(x=>x.task===t).reduce((n,x)=>n+x.length,0)),[5,3,4]);}assert.throws(()=>roundRobin(0),RangeError);
});
test('producer/consumer model conserves its bounded FIFO contents',()=>{
 assert.deepEqual(bufferState(2).items,['A','B']);assert.deepEqual(bufferState(3).items,['B']);assert.deepEqual(bufferState(8).items,[]);for(let i=1;i<=8;i++)assert.ok(bufferState(i).items.length<=3);
});
test('adding the upper-bound case reveals the intended defect',()=>{
 assert.ok(boundaryTests(4).every(r=>r.expected===r.actual));assert.equal(boundaryTests(5).filter(r=>r.expected!==r.actual)[0].value,10);
});
test('every named course has substantive source-linked topic coverage',()=>{
 for(const c of courses){const d=detailsFor(c);assert.ok(d.sourceUrl.startsWith('https://'));assert.ok(d.note);assert.ok(d.topics.length>=2);if(c.code.includes(' ')){assert.ok(!d.topics.some(t=>t.includes('after the elective')));}}
});
