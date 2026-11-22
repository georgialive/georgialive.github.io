import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const file of ["index.html", "styles.css", "app.js", "instrument.js", "math.js", "math-lab.js", "contact.js", "course-data.js", "course-map.js", "robots.txt", "sitemap.xml", "CNAME", ".nojekyll"]) {
  await cp(join(root, file), join(output, file));
}
await cp(join(root, "media"), join(output, "media"), { recursive: true });
await mkdir(join(output, "Assets"), { recursive: true });
await cp(join(root, "Assets/project-empower.png"), join(output, "Assets/project-empower.png"));
console.log(`Built static portfolio in ${output}`);
