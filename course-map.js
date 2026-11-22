import { courses, statusLabels } from "./course-data.js";

export function initCourseMap() {
  const map = document.querySelector("#course-map");
  const dialog = document.querySelector("#course-dialog");
  if (!map || !dialog?.showModal) return;
  let trigger;
  map.addEventListener("click", event => {
    const link = event.target.closest("a[data-course]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const course = courses.find(item => item.code === link.dataset.course);
    if (!course) return;
    event.preventDefault();
    trigger = link;
    dialog.querySelector("#course-dialog-title").textContent = course.title;
    dialog.querySelector("#course-dialog-code").textContent = course.code.includes("-") ? "Elective requirement" : course.code;
    dialog.querySelector("#course-dialog-status").textContent = `${statusLabels[course.status]} · Year ${course.year} · ${course.term} · ${course.credits ? `${course.credits.toFixed(1)} credit` : "Non-credit requirement"}`;
    dialog.querySelector("#course-dialog-summary").textContent = course.summary;
    dialog.querySelector("#course-dialog-link").href = course.url;
    dialog.showModal();
    dialog.querySelector("button").focus();
  });
  dialog.querySelector("button").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => trigger?.focus());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  const filters = document.querySelector("#course-filters");
  filters.hidden = false;
  filters.addEventListener("click", event => {
    const button = event.target.closest("[data-course-filter]");
    if (!button) return;
    const filter = button.dataset.courseFilter;
    map.dataset.filter = filter;
    for (const option of filters.querySelectorAll("button")) option.setAttribute("aria-pressed", String(option === button));
    let count = 0;
    for (const link of map.querySelectorAll("[data-status]")) {
      link.hidden = filter !== "all" && link.dataset.status !== filter;
      if (!link.hidden) count++;
    }
    for (const term of map.querySelectorAll(".course-term")) term.hidden = ![...term.querySelectorAll("[data-course]")].some(link => !link.hidden);
    for (const year of map.querySelectorAll(".course-year")) year.hidden = ![...year.querySelectorAll("[data-course]")].some(link => !link.hidden);
    document.querySelector("#course-filter-status").textContent = `${count} course and elective requirements shown.`;
  });
}
