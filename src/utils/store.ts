import { GameStoreName } from "src/types/store";

/**
 * Check if a game store name is valid
 */
function gameStoreIsValid(gameStore: string): gameStore is GameStoreName {
  return [
    GameStoreName.GOG,
    GameStoreName.EPIC,
    GameStoreName.AMAZON,
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
  return !isNaN(id) && (id > 2000000000 || id < -1000000);
}
