import * as cacheManager from "cache-manager";
import * as cacheManagerFS from "cache-manager-fs";

const FS_CACHE_PATH = ".with-fs-cache/";
const TTL = 60 * 60; // Seconds
const MAX_SIZE = 1000 * 1000 * 1000;

const DEFAULT_CACHE_CONFIG = {
  path: FS_CACHE_PATH,
  ttl: TTL,
  maxsize: MAX_SIZE
};

export const initCache = ({
  path = FS_CACHE_PATH,
  ttl = TTL,
  maxsize = MAX_SIZE
} = DEFAULT_CACHE_CONFIG) => {
  return new Promise(resolve => {
    const diskCache = cacheManager.caching({
      store: cacheManagerFS,
      options: {
        ttl,
        maxsize,
        path,
        preventfill: false,
        fillcallback: () => {
          resolve(diskCache);
        }
      }
    });
  }).then(cache => {
    return {
      ...cache,
      set: (key, val) => {
        return new Promise((resolve, reject) => {
          //@ts-ignore
          cache.set(key, val, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      },
      get: key => {
        return new Promise((resolve, reject) => {
          cache.get(key, (err, result) => {
            if (err) {
              reject(err);
            } else {
              if (result === null) {
                resolve(null);
                return;
              }
              resolve(result.data);
            }
          });
        });
      }
    };
  });
};

export const clearFsCacheAt = async key => {
  const cache = await initCache();
  const del = require("util").promisify(cache.del);
  await del(key);
};

export const clearFsCache = async () => {
  const cache = await initCache();
  const reset = require("util").promisify(cache.reset);
  await reset();
};

export const withFsCache = async (
  key,
  method,
  { onCacheMiss, onCacheHit } = {
    onCacheHit: () => {},
    onCacheMiss: () => {}
  }
) => {
  const cache = await initCache();
  const res = await cache.get(key);
  if (res === null) {
    onCacheMiss();
    const methodOutput = await method();
    await cache.set(key, { data: methodOutput });
    return methodOutput;
  } else {
    onCacheHit(key, res);
    return res;
  }
};

// const main = async () => {
//   await withFsCache("hasssaasdsdsd", async () => {
//     console.log("Hello");
//   });
// };

// (async () => {
//   await main();
// })();
