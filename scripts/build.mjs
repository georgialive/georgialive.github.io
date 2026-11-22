import { cp, mkdir, rm, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { renderCourseMap } from "./render-course-map.mjs";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of ["index.html", "styles.css", "app.js", "instrument.js", "math.js", "math-lab.js", "contact.js", "course-data.js", "course-map.js", "course-concepts.js", "advanced-lab.js", "visual-models.js", "resume.html", "resume.js", "robots.txt", "sitemap.xml", "CNAME", ".nojekyll"]) {
  await cp(join(root, file), join(output, file));
}
await cp(join(root, "media"), join(output, "media"), { recursive: true });
await mkdir(join(output, "Assets"), { recursive: true });
await cp(join(root, "Assets/project-empower.png"), join(output, "Assets/project-empower.png"));
const sourceHtml = await readFile(join(root, "index.html"), "utf8");
await writeFile(join(output, "index.html"), sourceHtml.replace(/<!--course-map:start-->[\s\S]*?<!--course-map:end-->/, `<!--course-map:start-->${renderCourseMap()}<!--course-map:end-->`));
console.log(`Built static portfolio in ${output}`);
