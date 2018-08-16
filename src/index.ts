// @ts-ignore
import * as LRU from "lru-cache";
// @ts-ignore
import { default as mkdirp } from "mkdirp";
//@ts-ignore
import { default as memoize } from "lodash.memoize";

import { DEFAULT_LRU_CACHE_CONFIG, FS_CACHE_PATH_DIR } from "./constants";
import { isPromise } from "./utils";

import { loadCache, writeCache } from "./cache-fs-plugin";

export const initCache = memoize((lruConfig = DEFAULT_LRU_CACHE_CONFIG) => {
  const cache = new LRU(lruConfig);
  loadCache(cache);
  writeCache(cache);
  mkdirp(FS_CACHE_PATH_DIR);
  return cache;
});

export const clearFsCacheAt = (key: any) => {
  const cache = initCache();
  cache.del(key);
  writeCache(cache);
};

export const withFsCache = (
  key: any,
  method: any,
  {
    onCacheMiss,
    onCacheHit
  }: { onCacheMiss?: Function; onCacheHit?: Function } = {}
) => {
  const cache = initCache();
  if (cache.has(key)) {
    const val = cache.get(key);
    onCacheHit && onCacheHit({ val });
    writeCache(cache);
    return val;
  }
  const result = method();
  onCacheMiss && onCacheMiss({ val: result });
  if (isPromise(result)) {
    return result.then((val: any) => {
      cache.set(key, val);
      writeCache(cache);
      return val;
    });
  }
  cache.set(key, result);
  writeCache(cache);
  return result;
};
