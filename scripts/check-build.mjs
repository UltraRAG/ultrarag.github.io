import {readdir, readFile, stat} from 'node:fs/promises';
import {resolve, join, sep} from 'node:path';

const root = resolve('build');
async function htmlFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const nested = await Promise.all(entries.map(entry => entry.isDirectory()
    ? htmlFiles(join(directory, entry.name))
    : entry.name.endsWith('.html') ? [join(directory, entry.name)] : []));
  return nested.flat();
}
const exists = async path => {
  try { return (await stat(path)).isFile(); } catch { return false; }
};
const missing = new Set();
const files = await htmlFiles(root);
for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const [, attribute, value] of html.matchAll(/\b(src|href|poster|srcset|content)="([^"]+)"/g)) {
    const urls = attribute === 'srcset' ? value.split(',').map(item => item.trim().split(/\s+/)[0]) : [value];
    for (const url of urls) {
      const local = url.replace(/^https:\/\/ultrarag\.github\.io(?=\/)/, '');
      if (!local.startsWith('/') || local.startsWith('//')) continue;
      const pathname = decodeURIComponent(local.split(/[?#]/)[0]);
      const path = resolve(root, `.${pathname}`);
      if (path !== root && !path.startsWith(root + sep)) throw new Error(`Invalid local URL: ${url}`);
      if (!await exists(path) && !await exists(`${path}.html`) && !await exists(join(path, 'index.html'))) {
        missing.add(`${file.slice(root.length)} -> ${url}`);
      }
    }
  }
}
if (missing.size) throw new Error(`Missing local links or assets:\n${[...missing].join('\n')}`);
console.log(`Checked local links, images, media, and metadata across ${files.length} generated HTML pages.`);
