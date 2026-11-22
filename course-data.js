// 2025 Software Engineering progression map; Georgia confirmed all first year completed,
// and second-year Fall 2026 still in progress on 2026-11-22. CCDP moved to her actual Fall term.
export const courseSource = "https://carleton.ca/engineering-design/wp-content/uploads/sites/63/2025/07/SOFT-202530.pdf";
const entries = [
// year, term, code, title, topic summary, credits
[1,"Fall","MATH 1004","Calculus for Engineering or Physics","Limits, derivatives, integrals, and engineering applications.",.5],
[1,"Fall","CHEM 1101","Chemistry for Engineering Students","Chemical principles, reactions, and laboratory measurement.",.5],
[1,"Fall","CSE-1","Complementary studies elective","Broader perspectives beyond engineering; elective requirement completed.",.5],
[1,"Fall","ECOR 1031","Programming and Data Management","Programming fundamentals, problem decomposition, and working with data.",.5],
[1,"Fall","ECOR 1032","Circuits and Mechatronics","Circuit analysis and integrating electrical and mechanical systems.",.5],
[1,"Fall","ECOR 1055","Introduction to Engineering Disciplines I","An introduction to engineering disciplines and professional pathways.",0],
[1,"Fall","ECOR 1057","Engineering Profession","The role and responsibilities of the engineering profession.",0],
[1,"Winter","MATH 1104","Linear Algebra for Engineering or Science","Matrices, vector spaces, linear systems, eigenvalues, and transformations.",.5],
[1,"Winter","PHYS 1004","Introductory Electromagnetism and Wave Motion","Electricity, magnetism, oscillations, and waves.",.5],
[1,"Winter","SYSC 1006","Foundations of Imperative Programming","Memory, recursion, data structures, and imperative program design.",.5],
[1,"Winter","ECOR 1033","Statics","Forces, moments, and equilibrium in engineering structures.",.5],
[1,"Winter","ECOR 1034","Dynamics","Motion, energy, momentum, and forces in moving systems.",.5],
[1,"Winter","ECOR 1056","Introduction to Engineering Disciplines II","Further exploration of engineering disciplines and their applications.",0],
[2,"Fall","MATH 1005","Differential Equations and Infinite Series","Differential equations, sequences, series, and mathematical modelling.",.5],
[2,"Fall","SYSC 2004","Object-Oriented Software Development","Objects, inheritance, polymorphism, and maintainable software design.",.5],
[2,"Fall","SYSC 2310","Introduction to Digital Systems","Boolean logic, combinational circuits, sequential logic, and digital design.",.5],
[2,"Fall","SYSC 2100","Algorithms and Data Structures","Lists, trees, heaps, searching, sorting, and complexity analysis.",.5],
[2,"Fall","COMP 1805","Discrete Structures I","Logic, sets, proof, induction, and discrete mathematical reasoning.",.5],
[2,"Fall","CCDP 2100","Communication Skills for Engineering Students","Technical reports, presentations, collaboration, and communicating engineering ideas.",.5],
[2,"Winter","ECOR 2050","Design and Analysis of Engineering Experiments","Statistics, experimental design, uncertainty, and interpreting engineering data.",.5],
[2,"Winter","SYSC 3110","Software Design Project","Team-based software development and object-oriented design practice.",.5],
[2,"Winter","SYSC 2320","Computer Organization and Architecture","Processors, instruction execution, memory, and computer system organization.",.5],
[2,"Winter","COMP 2804","Discrete Structures II","Counting, probability, and further discrete mathematics for computing.",.5],
[2,"Winter","BSE-1","Basic science elective","An approved science course; specific selection to be confirmed.",.5],
[3,"Fall","SYSC 3101","Programming Languages","Programming paradigms, language concepts, and ways to express computation.",.5],
[3,"Fall","SYSC 3120","Software Requirements Engineering","Eliciting, modelling, documenting, and validating software requirements.",.5],
[3,"Fall","SYSC 3310","Introduction to Real-Time Systems","Timing constraints and software interacting with physical systems.",.5],
[3,"Fall","SYSC 4001","Operating Systems","Processes, concurrency, memory management, and operating system services.",.5],
[3,"Fall","BSE-2","Basic science elective","A second approved science course; selection to be confirmed.",.5],
[3,"Fall","COMP 3005","Database Management Systems","Relational data, SQL, database design, and data management.",.5],
[3,"Winter","SYSC 4120","Software Architecture and Design","Architectural decisions, design approaches, and software system structure.",.5],
[3,"Winter","SYSC 3303","Real-Time Concurrent Systems","Concurrent processes, synchronization, communication, and real-time software.",.5],
[3,"Winter","SYSC 4106","The Software Economy and Project Management","Planning software projects and understanding their economic context.",.5],
[3,"Winter","SYSC 4130","Human Computer Interaction","Designing and evaluating usable human-computer interfaces.",.5],
[3,"Winter","SYSC 4806","Software Engineering Lab","Integrating software engineering knowledge through team projects and reviews.",.5],
[4,"Full year","SYSC 4907 / ECOR 4907","Engineering Project","A substantial team engineering design project spanning both terms.",1],
[4,"Fall","SYSC 4101","Software Validation","Checking software behaviour through validation and testing.",.5],
[4,"Fall","SYSC 4810","Introduction to Network and Software Security","Security threats, protective controls, and network and software risk.",.5],
[4,"Fall","ENG-C1","Engineering elective","An upper-year SYSC or ELEC course; selection to be confirmed.",.5],
[4,"Fall","ECOR 4995","Professional Practice","Professional responsibility and the context of engineering practice.",.5],
[4,"Fall","ECOR 2995","Engineering Portfolio","Documenting and reflecting on engineering learning and development.",0],
[4,"Winter","CSE-2","Complementary studies elective","Another approved course broadening the engineering curriculum.",.5],
[4,"Winter","ENG-C2","Engineering elective","An upper-year SYSC or ELEC course; selection to be confirmed.",.5],
[4,"Winter","ENG-D1","Engineering / computing elective","An approved engineering or computing option; selection to be confirmed.",.5],
[4,"Winter","ENG-D2","Engineering / computing elective","A further approved technical option; selection to be confirmed.",.5],
];
export const courses = entries.map(([year, term, code, title, summary, credits]) => ({
  year, term, code, title, summary, credits,
  status: year === 1 ? "completed" : year === 2 && term === "Fall" ? "current" : "future",
  url: /^[A-Z]+ \d/.test(code) ? `https://calendar.carleton.ca/search/?P=${encodeURIComponent(code.split(" / ")[0])}` : courseSource,
}));
export const statusLabels = { completed: "Completed", current: "In progress", future: "To take" };

// Automatic progression is a calendar plan, not a transcript/grade integration.
// Override a course via statusOverride or adjust its start/end if the plan changes.
export const semesterSchedule = {
  "2-Fall": { start: "2026-09-09", end: "2026-12-23", official: true },
  "2-Winter": { start: "2027-01-06", end: "2027-04-23", official: true },
  "3-Fall": { start: "2027-09-01", end: "2027-12-31", official: false },
  "3-Winter": { start: "2028-01-01", end: "2028-04-30", official: false },
  "4-Fall": { start: "2028-09-01", end: "2028-12-31", official: false },
  "4-Winter": { start: "2029-01-01", end: "2029-04-30", official: false },
  "4-Full year": { start: "2028-09-01", end: "2029-04-30", official: false },
};
export function torontoDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export function courseStatus(course, date = new Date()) {
  if (course.statusOverride) return course.statusOverride;
  if (course.year === 1) return "completed";
  const schedule = semesterSchedule[`${course.year}-${course.term}`];
  const day = typeof date === "string" ? date : torontoDate(date);
  if (!schedule) return "future";
  return day > schedule.end ? "completed" : day >= schedule.start ? "current" : "future";
}
