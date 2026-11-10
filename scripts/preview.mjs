import {createServer} from 'node:http';
import {resolve} from 'node:path';
import compression from 'compression';
import handler from 'serve-handler';

const [directory = 'build', port = '4174'] = process.argv.slice(2);
const compress = compression();
createServer((request, response) => {
  compress(request, response, () => {
    handler(request, response, {
      public: resolve(directory),
      cleanUrls: true,
      directoryListing: false,
      headers: [{source: '**/*', headers: [{key: 'Cache-Control', value: 'public, max-age=600'}]}],
    }).catch(error => {
      console.error(error);
      if (!response.headersSent) response.writeHead(500);
      response.end();
    });
  });
}).listen(Number(port), '127.0.0.1', () => {
  console.log(`Previewing ${resolve(directory)} at http://127.0.0.1:${port}`);
});
