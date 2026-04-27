import { GameStoreName } from "../types/store.js";

/**
 * Check if a game store name is valid
 */
function gameStoreIsValid(gameStore: string): gameStore is GameStoreName {
  return [
    GameStoreName.GOG,
    GameStoreName.EPIC,
    GameStoreName.AMAZON,
    GameStoreName.UBISOFT,
    GameStoreName.XBOX,
    GameStoreName.EA,
    GameStoreName.DEFAULT,
  ].includes(gameStore as GameStoreName);
}

/**
 * Sanitize game store name to its valid enum value
 */
export function sanitizedGameStoreName(gameStore: string): GameStoreName {
  const sanitizedGameStore = gameStore?.toLowerCase();
  return gameStoreIsValid(sanitizedGameStore) ? sanitizedGameStore : undefined;
}

/**
 * Check if an app ID belongs to a non-Steam game
 * Non-Steam games typically have IDs >= 2,000,000,000 or negative values
 */
export function isNonSteamApp(appid: string | number): boolean {
  const id = Number(appid);
  // Real Steam app IDs are typically < 6,000,000. Non-Steam game IDs generated via CRC32 
  // can be anywhere from 0 to 4.2 billion+, but occasionally end up < 2 billion.
  // Using 10,000,000 as a safe upper threshold to ensure no Non-Steam apps get ignored.
  return !isNaN(id) && (id > 10000000 || id < -1000000);
}
