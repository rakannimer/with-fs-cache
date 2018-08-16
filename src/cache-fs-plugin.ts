import * as fs from "fs";
// @ts-ignore
import mkdirp from "mkdirp";

import { PATH_TO_CACHE, FS_CACHE_PATH_DIR } from "./constants";

export const loadCache = (cache: { load: (dump: any) => any }) => {
  if (!fs.existsSync(PATH_TO_CACHE)) {
    return "";
  }
  const cacheDump = fs.readFileSync(PATH_TO_CACHE, { encoding: "utf8" });
  cache.load(cacheDump);
  return cache;
};

export const writeCache = (cache: { dump: () => any }) => {
  mkdirp(FS_CACHE_PATH_DIR);
  fs.writeFileSync(PATH_TO_CACHE, JSON.stringify(cache.dump()), {
    encoding: "utf8"
  });
};
