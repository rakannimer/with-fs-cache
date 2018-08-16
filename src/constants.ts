export const FS_CACHE_PATH_DIR = ".with-fs-cache";
export const FS_CACHE_PATH_FILE = "lru-cache.json";
export const PATH_TO_CACHE = `${FS_CACHE_PATH_DIR}/${FS_CACHE_PATH_FILE}`;
export const TTL = 60 * 60; // Seconds
export const MAX_SIZE = 1000;
export const DEFAULT_LRU_CACHE_CONFIG = {
  max: MAX_SIZE,
  length: () => 1,
  dispose: () => {},
  maxAge: TTL
};
