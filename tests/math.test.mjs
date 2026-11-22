import test from "node:test";
import assert from "node:assert/strict";
import { curvePoint, curvePeriod, curvePoints } from "../math.js";
import { contactPayload } from "../contact.js";
import { courses } from "../course-data.js";

test("all frequency pairs close at their fundamental period and stay within bounds", () => {
  for (let a=1; a<=9; a++) for (let b=1; b<=9; b++) for (const phase of [0,90,180]) {
    const ps=curvePoints(a,b,phase,120);
    assert.ok(Math.hypot(ps[0].x-ps.at(-1).x,ps[0].y-ps.at(-1).y)<1e-9);
    assert.ok(ps.every(p=>p.x>=135-1e-9&&p.x<=465+1e-9&&p.y>=35-1e-9&&p.y<=365+1e-9));
    assert.ok(curvePeriod(a,b)>0);
  }
});
test("circle preset has constant radius; invalid frequencies are rejected", () => {
  for (const p of curvePoints(1,1,90)) assert.ok(Math.abs(Math.hypot(p.x-300,p.y-200)-165)<1e-9);
  for (const a of [0,10,1.5,NaN]) assert.throws(()=>curvePoint(a,3,90,0),RangeError);
});
test("contact payload preserves ordinary text and excludes unapproved fields", () => {
  const f=new FormData(); f.set('name','  Georgia  '); f.set('email','hello@example.com'); f.set('message','<script>literal text</script>'); f.set('secret','not included');
  const p=contactPayload(f); assert.equal(p.name,'Georgia'); assert.equal(p.message,'<script>literal text</script>'); assert.equal(p.secret,undefined);
  f.set('message','x'.repeat(6000)); assert.equal(contactPayload(f).message.length,5000);
});
test("course map totals match the 21-credit degree and confirmed progress", () => {
  assert.equal(new Set(courses.map(c=>c.code)).size,courses.length);
  assert.equal(courses.reduce((sum,c)=>sum+c.credits,0),21);
  assert.equal(courses.filter(c=>c.status==='completed').reduce((sum,c)=>sum+c.credits,0),5);
  assert.equal(courses.filter(c=>c.status==='current').reduce((sum,c)=>sum+c.credits,0),3);
  assert.equal(courses.filter(c=>c.status==='current').length,6);
  assert.ok(courses.filter(c=>c.status==='completed').every(c=>c.year===1));
});
