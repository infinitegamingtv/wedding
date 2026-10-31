import {createHash} from 'node:crypto';
import {readdir, readFile, writeFile} from 'node:fs/promises';
import {join, relative, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const listFiles = async directory => (await Promise.all((await readdir(directory, {withFileTypes: true})).map(async entry => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? listFiles(path) : [relative(root, path).split(sep).join('/')];
}))).flat();

const files = (await listFiles(root)).filter(path => path !== 'sw.js' && path !== 'offline-manifest.json').sort();
const digest = createHash('sha256');
for (const path of files) {
  digest.update(path);
  digest.update(await readFile(join(root, path)));
}
const version = digest.digest('hex').slice(0, 12);
const manifest = {version, files: [...files, 'offline-manifest.json']};
await writeFile(join(root, 'offline-manifest.json'), JSON.stringify(manifest));

const worker = `const CACHE = 'mo-qua-hy-${version}';
const PREFIX = 'mo-qua-hy-';
const FILES = ${JSON.stringify(manifest.files)};
const asset = path => new URL(path, self.registration.scope).href;

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(path => new Request(asset(path), {cache: 'reload'})))));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.open(CACHE)).match(asset('index.html'))));
    return;
  }
  event.respondWith((async () => {
    const cached = await (await caches.open(CACHE)).match(request, {ignoreSearch: true});
    if (!cached) return fetch(request);
    const range = request.headers.get('range');
    if (!range) return cached;
    const match = /^bytes=(\\d*)-(\\d*)$/.exec(range);
    if (!match) return cached;
    const bytes = await cached.arrayBuffer();
    const size = bytes.byteLength;
    const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
    const end = match[2] && match[1] ? Math.min(Number(match[2]), size - 1) : size - 1;
    if (start >= size || end < start) return new Response(null, {status: 416, headers: {'Content-Range': 'bytes */' + size}});
    return new Response(bytes.slice(start, end + 1), {status: 206, headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'application/octet-stream',
      'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    }});
  })());
});
`;
await writeFile(join(root, 'sw.js'), worker);
console.log(`Offline cache: ${manifest.files.length} files, version ${version}`);
