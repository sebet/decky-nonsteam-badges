import { SupportedStores } from "src/types/settings";
import { log } from "./logger";
import { call } from "@decky/api";

interface StoreMapping {
  store: string;
  name?: string;
}

const context = "cache";

const CACHE_TTL_MS = 60 * 1000; // 1 minute

let gameStoreMappingsCache: Record<string, StoreMapping | string> = {};
let mappingsLoaded = false;
let isFetchingMappings = false;
let lastFetchTime = 0;

/**
 * Wait for store mappings to be loaded from the backend before attempting to access the cache.
 */
export async function ensureMappingsLoaded(force = false): Promise<void> {
  const now = Date.now();
  const isExpired = now - lastFetchTime > CACHE_TTL_MS;

  if (!force && mappingsLoaded && !isExpired) return;

  if (isFetchingMappings) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!isFetchingMappings) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  isFetchingMappings = true;
  if (isExpired) {
    log(context, "Store mappings cache expired or missing, fetching...");
  } else {
    log(context, "Fetching all store mappings...");
  }

  try {
    const result = await call<
      [],
      Record<string, { store: string; name?: string }>
    >("get_all_store_mappings");

    if (result) {
      gameStoreMappingsCache = result;
      mappingsLoaded = true;
      lastFetchTime = Date.now();
      log(context, `Loaded ${Object.keys(result).length} mappings`);
    } else {
      log(
        context,
        "Failed to load mappings: API call returned unsuccessful",
        "error",
      );
      log(context, JSON.stringify(result), "error");
    }
  } catch (e) {
    log(context, "Failed to load mappings", "error");
    log(context, e, "error");
  } finally {
    isFetchingMappings = false;
  }
}

function getFrontendStore(appid: string): string | null {
  try {
    const supportedStores = Object.values(SupportedStores);
    const collectionStore = (window as any).collectionStore;
    if (!collectionStore) {
      return null;
    }

    const userCollections = collectionStore.userCollections;
    if (!userCollections) return null;

    const numericAppId = parseInt(appid);
    if (isNaN(numericAppId)) return null;

    const foundCollections: string[] = [];

    for (const collection of userCollections) {
      if (
        collection.apps &&
        collection.apps.has &&
        collection.apps.has(numericAppId)
      ) {
        foundCollections.push(collection.displayName);
      }
    }

    if (foundCollections.length > 0) {
      log(
        context,
        `AppID ${appid} found in local collections: ${JSON.stringify(foundCollections)}`,
      );

      return foundCollections.reduce((acc: string | null, colName: string) => {
        if (acc) return acc;
        return supportedStores.find((store) => {
          // Match whole word, or separated by non-word chars/underscores/hyphens
          const regex = new RegExp(
            `[\\b_\\-]${store}[\\b_\\-]|^${store}|${store}$`,
            "i",
          );
          return regex.test(colName);
        });
      }, null);
    }

    return null;
  } catch (e) {
    log(
      context,
      "Could not check frontend collections: " + JSON.stringify(e),
      "warn",
    );
    return null;
  }
}

/**
 * Try to get the store name for a given AppID from the cache.
 */
export function getStore(appid: string): string | null {
  // Check backend cache (Launch Options)
  if (mappingsLoaded && gameStoreMappingsCache[appid]) {
    const entry = gameStoreMappingsCache[appid];
    if (typeof entry === "string") return entry;
    if (entry.store) return entry.store;
  }

  // Check Collections (Real-time in browser)
  const frontendStore = getFrontendStore(appid);
  if (frontendStore) {
    return frontendStore;
  }

  return null;
}

/**
 * Gets the game name for a given AppID from the cache.
 */
export function getName(appid: string): string | null {
  if (mappingsLoaded && gameStoreMappingsCache[appid]) {
    const entry = gameStoreMappingsCache[appid];
    if (typeof entry === "object" && entry.name) {
      return entry.name;
    }
  }
  return null;
}
