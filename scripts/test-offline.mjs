import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';

const root = new URL('../dist/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('offline-manifest.json', root)));
const worker = await readFile(new URL('sw.js', root), 'utf8');
const scope = 'https://example.test/wedding/';
const handlers = new Map();
const stored = new Map();
const cache = {
  addAll: async requests => {for (const request of requests) stored.set(request.url, new Response(request.url.endsWith('.mp4') ? 'video-data' : `cached:${request.url}`));},
  match: async (request, options = {}) => {
    const url = typeof request === 'string' ? request : request.url;
    if (!options.ignoreSearch) return stored.get(url);
    return [...stored].find(([key]) => key.split('?')[0] === url.split('?')[0])?.[1];
  },
};
runInNewContext(worker, {
  self: {registration: {scope}, location: {origin: 'https://example.test'}, clients: {claim: async () => {}}, addEventListener: (name, handler) => handlers.set(name, handler)},
  caches: {open: async () => cache, keys: async () => [`mo-qua-hy-${manifest.version}`], delete: async () => {}},
  Request, Response, URL,
  fetch: async () => {throw new Error('network offline');},
});

const lifecycle = name => new Promise((resolve, reject) => handlers.get(name)({waitUntil: task => task.then(resolve, reject)}));
await lifecycle('install');
assert.equal(stored.size, manifest.files.length);
await lifecycle('activate');
const request = async (url, mode = 'cors', headers = {}) => new Promise((resolve, reject) => handlers.get('fetch')({request: {method: 'GET', url, mode, headers: new Headers(headers)}, respondWith: task => task.then(resolve, reject)}));
const page = await request(scope, 'navigate');
assert.equal(await page.text(), `cached:${scope}index.html`);
const media = await request(`${scope}assets/let-me-go-61-69.mp4`, 'cors', {Range: 'bytes=0-4'});
assert.equal(media.status, 206);
assert.equal(media.headers.get('Content-Range'), 'bytes 0-4/10');
assert.equal(await media.text(), 'video');
console.log(`Offline navigation and media ranges: OK (${stored.size} files)`);
