import {assetUrl} from './asset-url';

export type OfflineStatus = {state: 'checking' | 'ready' | 'incomplete' | 'unsupported'; cached: number; total: number};
export const initialOfflineStatus: OfflineStatus = {state: 'checking', cached: 0, total: 0};

export const registerOffline = async () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  await navigator.serviceWorker.register(assetUrl('sw.js'), {scope: import.meta.env.BASE_URL});
  await Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('Offline install timed out')), 15000)),
  ]);
};

export const checkOffline = async (): Promise<OfflineStatus> => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || !('caches' in window)) return {state: 'unsupported', cached: 0, total: 0};
  try {
    const response = await fetch(assetUrl('offline-manifest.json'), {cache: 'no-store'});
    if (!response.ok) throw new Error('Manifest unavailable');
    const manifest = await response.json() as {version: string; files: string[]};
    const cache = await caches.open(`mo-qua-hy-${manifest.version}`);
    const hits = await Promise.all(manifest.files.map(path => cache.match(assetUrl(path))));
    const cached = hits.filter(Boolean).length;
    return {state: cached === manifest.files.length ? 'ready' : 'incomplete', cached, total: manifest.files.length};
  } catch { return {state: 'incomplete', cached: 0, total: 0}; }
};
