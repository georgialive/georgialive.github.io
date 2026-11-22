import { detailsFor, supportingOutlines } from "./course-details.js";
import { courses, statusLabels, courseStatus, torontoDate, semesterSchedule } from "./course-data.js";
import { mountCourseConcept } from "./course-concepts.js";

export function initCourseMap() {
  const map=document.querySelector('#course-map'),dialog=document.querySelector('#course-dialog');
  if(!map||!dialog?.showModal)return;
  const filters=document.querySelector('#course-filters');filters.hidden=false;
  let trigger,selectedYear=2,userSelected=false,timer;
  const symbols={completed:'✓',current:'◉',future:'○'};
  function selectYear(year){
    selectedYear=year;
    map.querySelectorAll('.course-year').forEach(panel=>panel.hidden=Number(panel.dataset.year)!==year);
    filters.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.courseYear)===year)));
    const shown=courses.filter(c=>c.year===year);
    document.querySelector('#course-filter-status').textContent=`Year ${year}: ${shown.filter(c=>courseStatus(c)==='completed').length} completed, ${shown.filter(c=>courseStatus(c)==='current').length} in progress, ${shown.filter(c=>courseStatus(c)==='future').length} to take.`;
  }
  function refresh(){
    const now=new Date();let complete=0,current=0;
    for(const c of courses){
      const status=courseStatus(c,now),link=[...map.querySelectorAll('[data-course]')].find(a=>a.dataset.course===c.code);
      link.className=`course-card course-${status}`;link.dataset.status=status;
      link.querySelector('small').textContent=`${symbols[status]} ${statusLabels[status]}${c.credits===0?' · Non-credit':''}`;
      if(status==='completed')complete+=c.credits;if(status==='current')current+=c.credits;
    }
    document.querySelector('#learning-credit-count').firstChild.textContent=`${complete.toFixed(1)} `;
    document.querySelector('.progress-done').style.width=`${complete/21*100}%`;
    document.querySelector('.progress-current').style.width=`${current/21*100}%`;
    document.querySelector('.learning-progress').setAttribute('aria-label',`${complete} completed credits, ${current} in progress, out of 21`);
    document.querySelector('#learning-date').textContent=`Progression plan · ${torontoDate(now)}`;
    for(let year=1;year<=4;year++){
      const all=courses.filter(c=>c.year===year),done=all.filter(c=>courseStatus(c,now)==='completed').length,active=all.filter(c=>courseStatus(c,now)==='current').length;
      document.querySelector(`[data-year-status="${year}"]`).textContent=`${done} completed · ${active} in progress · ${all.length-done-active} to take`;
    }
    if(!userSelected){const active=courses.find(c=>courseStatus(c,now)==='current');selectedYear=active?.year??Math.min(4,(courses.filter(c=>courseStatus(c,now)==='completed').at(-1)?.year??0)+1);}
    selectYear(selectedYear);
  }
  filters.addEventListener('click',event=>{const button=event.target.closest('[data-course-year]');if(button){userSelected=true;selectYear(Number(button.dataset.courseYear));}});
  map.addEventListener('click',event=>{
    const link=event.target.closest('a[data-course]');if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const course=courses.find(item=>item.code===link.dataset.course);if(!course)return;
    event.preventDefault();trigger=link;
    dialog.querySelector('#course-dialog-title').textContent=course.title;
    dialog.querySelector('#course-dialog-code').textContent=course.code.includes('-')?'Elective requirement':course.code;
    const status=courseStatus(course),schedule=semesterSchedule[`${course.year}-${course.term}`];
    dialog.querySelector('#course-dialog-status').textContent=`${symbols[status]} ${statusLabels[status]} · Year ${course.year} · ${course.term} · ${course.credits?`${course.credits.toFixed(1)} credit`:'Non-credit requirement'}${course.year>1&&schedule?` · Planned end ${schedule.end}`:''}`;
    dialog.querySelector('#course-dialog-summary').textContent=course.summary;
    const details=detailsFor(course);
    const list=dialog.querySelector('#course-topic-list');list.replaceChildren();
    for(const topic of details.topics){const item=document.createElement('li');item.textContent=topic;list.append(item);}
    dialog.querySelector('#course-source-note').textContent=details.note;
    const sourceLink=dialog.querySelector('#course-dialog-link');sourceLink.href=details.sourceUrl;sourceLink.textContent=details.sourceLabel;
    const outline=dialog.querySelector('#course-outline-link'),support=supportingOutlines[course.code];outline.hidden=!support;
    if(support){outline.href=support.url;outline.textContent=support.label;}

    mountCourseConcept(dialog.querySelector('#course-concept'),course);
    dialog.showModal();dialog.scrollTop=0;dialog.querySelector('button').focus();
  });
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{dialog.querySelector('#course-concept').replaceChildren();trigger?.focus();});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  const start=()=>{refresh();clearInterval(timer);timer=setInterval(refresh,60000);};
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  addEventListener('pagehide',()=>clearInterval(timer));addEventListener('pageshow',start);start();
}
