import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const [url = 'http://127.0.0.1:4173/', directory = 'artifacts/lighthouse'] = process.argv.slice(2);
const outputDir = resolve(directory);
await mkdir(outputDir, {recursive: true});
const summary = {};
for (const device of ['mobile', 'desktop']) {
  const outputPath = resolve(outputDir, device);
  await promisify(execFile)(process.execPath, [
    'node_modules/lighthouse/cli/index.js', url,
    ...(device === 'desktop' ? ['--preset=desktop'] : []),
    '--chrome-flags=--headless=new',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--output=html', '--output=json', `--output-path=${outputPath}`, '--quiet',
  ], {maxBuffer: 1024 * 1024});
  const report = JSON.parse(await readFile(`${outputPath}.report.json`, 'utf8'));
  if (report.runtimeError) throw new Error(report.runtimeError.message);
  summary[device] = {
    url: report.finalDisplayedUrl,
    lighthouseVersion: report.lighthouseVersion,
    scores: Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, value.score === null ? null : Math.round(value.score * 100)])),
    metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift']
      .map(key => [key, report.audits[key].numericValue])),
    warnings: report.runWarnings,
    auditErrors: Object.values(report.audits).filter(audit => audit.scoreDisplayMode === 'error')
      .map(audit => ({id: audit.id, error: audit.errorMessage})),
  };
  console.log(device, JSON.stringify(summary[device]));
  if (summary[device].auditErrors.length) process.exitCode = 1;
}
await writeFile(resolve(outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
