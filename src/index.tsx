import { definePlugin, routerHook } from "@decky/api";
import React from "react";

import {
  getBigPictureWindow,
  startObserving,
  stopObserving,
} from "./utils/observer";
import { removeStyleFromWindow } from "./utils/styleInjector";
import Settings from "./components/Settings";
import { PluginIcon } from "src/components/icons/IconNonSteam";
import { patchGameDetails } from "src/feature/patchGameDetails";
import { cleanupBadges } from "src/feature/addBadgeToCapsule";
import { log } from "src/utils/logger";
import { getSettings } from "src/utils/settings";
import { SETTINGS_CHANGED_EVENT } from "src/types/settings";
import { GameStoreContext } from "src/types/store";

export default definePlugin(() => {
  const settings = getSettings();

  // Patch library and home carousel (DOM-based)
  const handleLibraryPatch = (tree: any) => {
    log(GameStoreContext.LIBRARY, "Library patch applied. Listening ...");
    setTimeout(startObserving, 50);
    return tree;
  };

  const libraryPatch = () => {
    if (settings.libraryPosition === "none") {
      return;
    }

    return routerHook.addPatch("/library", handleLibraryPatch);
  };

  // Patch search results (DOM-based)
  const handleSearchPatch = (tree: any) => {
    log(GameStoreContext.SEARCH, "Search patch applied. Listening ...");
    setTimeout(startObserving, 50);
    return tree;
  };

  const searchPatch = () => {
    if (settings.libraryPosition === "none") {
      return;
    }

    return routerHook.addPatch("/search", handleSearchPatch);
  };

  // Patch game details page (React-based)
  const gameDetailsPatch = () => {
    if (settings.detailsPosition === "none") {
      return;
    }
    log(GameStoreContext.DETAILS, "Game details patching ...");
    return routerHook.addPatch("/library/app/:appid", patchGameDetails);
  };

  const handleSettingsChange = () => {
    const bigPicWindow = getBigPictureWindow();
    if (bigPicWindow) {
      cleanupBadges(bigPicWindow);

      // Force a re-scan and restart the observer with new settings
      if (settings.libraryPosition !== "none") {
        startObserving();
      }
    }
  };

  libraryPatch();
  searchPatch();
  gameDetailsPatch();

  window.addEventListener(SETTINGS_CHANGED_EVENT, handleSettingsChange);

  return {
    titleView: <div>Non-Steam Badges</div>,
    name: "Non-Steam Badges",
    content: <Settings />,
    icon: <PluginIcon />,
    onDismount() {
      stopObserving();

      // Remove patches
      window.removeEventListener(SETTINGS_CHANGED_EVENT, handleSettingsChange);
      routerHook.removePatch("/library", handleLibraryPatch);
      routerHook.removePatch("/search", handleSearchPatch);
      routerHook.removePatch("/library/app/:appid", patchGameDetails);

      // Clean up existing badges and styles
      const bigPicWindow = getBigPictureWindow();
      if (bigPicWindow) {
        cleanupBadges(bigPicWindow);
        removeStyleFromWindow(bigPicWindow);
      }
    },
  };
});
