import { BadgePosition, PluginSettings } from "../types/settings.js";
import { GameStoreContext } from "../types/store.js";

export interface CapsuleImageMetrics {
  width: number;
  height: number;
}

export function getEffectiveCapsuleContext(
  context: GameStoreContext,
  imageMetrics?: CapsuleImageMetrics | null,
): GameStoreContext {
  if (
    context === GameStoreContext.LIBRARY &&
    imageMetrics &&
    imageMetrics.width > imageMetrics.height
  ) {
    return GameStoreContext.SEARCH;
  }

  return context;
}

export function getCapsuleBadgeClassKeys(
  context: GameStoreContext,
  settings: PluginSettings,
): string[] {
  if (context === GameStoreContext.SEARCH) {
    return ["searchBadge", `search-${BadgePosition.TOP_RIGHT}`];
  }

  if (context === GameStoreContext.HOME) {
    return ["homeBadge", settings.homePosition];
  }

  return ["libraryBadge", settings.libraryPosition];
}

export function getDetailsBadgePositionClassKey(
  detailsPosition: BadgePosition,
  showSteamStoreButton: boolean,
): string {
  if (detailsPosition === BadgePosition.NONE && showSteamStoreButton) {
    return `details-${BadgePosition.TOP_LEFT}`;
  }

  return `details-${detailsPosition}`;
}
