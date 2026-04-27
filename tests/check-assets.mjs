import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = ["index.html", "styles.css"];
const references = [];
const referencePattern = /(?:src|href)="([^"]+)"|url\("?([^")]+)"?\)/g;

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of source.matchAll(referencePattern)) {
    const reference = match[1] || match[2];
    if (
      !reference ||
      reference.startsWith("#") ||
      reference.startsWith("http://") ||
      reference.startsWith("https://") ||
      reference === "./styles.css" ||
      reference === "./script.js"
    ) {
      continue;
    }

    references.push({ file, reference });
  }
}

const missing = references.filter(({ reference }) => {
  const normalized = reference.replace(/^\.\//, "");
  return !fs.existsSync(path.join(root, normalized));
});

if (missing.length > 0) {
  for (const item of missing) {
    console.error(`Missing asset in ${item.file}: ${item.reference}`);
  }
  process.exit(1);
}

console.log(`Checked ${references.length} local asset references.`);
