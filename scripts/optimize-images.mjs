import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';

// Keep the original artwork; produce sized assets for typical 1x/2x screens.
const assets = [
  ['_UltraRAG_logo.png', [400]],
  ['home/home.jpg', [320, 560, 800]],
  ['home/ui.png', [640, 800, 1280]],
  ...['pipeline', 'server', 'benchmark', 'ui'].map(name => [`feature/${name}.jpg`, [400, 640]]),
];
await mkdir('static/img/optimized', {recursive: true});
for (const [source, widths] of assets) {
  const name = source.replace(/.*\//, '').replace(/\.[^.]+$/, '');
  // The hero and feature named ui have distinct output names.
  const prefix = source.startsWith('feature/') ? 'feature-' : '';
  for (const width of widths) {
    await sharp(`static/img/${source}`).resize({width, withoutEnlargement: true})
      .webp({quality: 82}).toFile(`static/img/optimized/${prefix}${name}-${width}.webp`);
  }
}
