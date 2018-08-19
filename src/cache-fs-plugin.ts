import * as fs from "fs";
// @ts-ignore
import mkdirp from "mkdirp";
import { PATH_TO_CACHE, FS_CACHE_PATH_DIR } from "./constants";

export const loadCache = (cache: {
  load: (dump: any) => any;
  set: (k: any, v: any, e: number) => void;
}) => {
  if (!fs.existsSync(PATH_TO_CACHE)) {
    return cache;
  }
  const cacheDump = fs.readFileSync(PATH_TO_CACHE, { encoding: "utf8" });
  const jsonCache = JSON.parse(cacheDump);
  for (let cacheItem of jsonCache) {
    if ("k" in cacheItem && "v" in cacheItem) {
      const { k, v, e } = cacheItem;
      cache.set(k, v, e);
    }
  }
  return cache;
};

export const writeCache = (cache: { dump: () => any }) => {
  mkdirp(FS_CACHE_PATH_DIR);
  fs.writeFileSync(PATH_TO_CACHE, JSON.stringify(cache.dump()), {
    encoding: "utf8"
  });
};
