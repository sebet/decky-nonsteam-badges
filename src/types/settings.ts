export type Sizes = "s" | "m" | "l";

export const SETTINGS_CHANGED_EVENT = "nonsteam-badges-settings-changed";

export enum SupportedStores {
  GOG = "gog",
  EPIC = "epic",
  AMAZON = "amazon",
}

export enum BadgePosition {
  NONE = "none",
  TOP_LEFT = "top-left",
  TOP_RIGHT = "top-right",
  BOTTOM_LEFT = "bottom-left",
  BOTTOM_RIGHT = "bottom-right",
}

export interface PluginSettings {
  homePosition: BadgePosition;
  libraryPosition: BadgePosition;
  detailsPosition: BadgePosition;
  addBadgesToAllNonSteamGames: boolean;
  showSteamStoreButton: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
  homePosition: BadgePosition.BOTTOM_RIGHT,
  libraryPosition: BadgePosition.BOTTOM_RIGHT,
  detailsPosition: BadgePosition.TOP_LEFT,
  addBadgesToAllNonSteamGames: true,
  showSteamStoreButton: true,
};
