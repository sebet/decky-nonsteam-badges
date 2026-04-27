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
import {
  cleanupGameDetailsPatches,
  patchGameDetails,
} from "src/feature/patchGameDetails";
import { cleanupBadges } from "src/feature/addBadgeToCapsule";
import { log } from "src/utils/logger";
import {
  getObserverRouteAction,
  isObserverRoute,
  shouldObserveDomBadges,
} from "src/utils/observerRoute";
import { getSettings } from "src/utils/settings";
import { ensureMappingsLoaded } from "src/utils/storeCache";
import { SETTINGS_CHANGED_EVENT } from "src/types/settings";
import { GameStoreContext } from "src/types/store";

export default definePlugin(() => {
  const settings = getSettings();
  const startupTimeouts = new Set<number>();
  const debugMode = process.env.DEBUG_MODE === "true";
  const routeMonitorIntervalMs = 500;
  let routeLoggerInterval: number | undefined;
  let routeMonitorInterval: number | undefined;
  let observerActive = false;

  // Warm the store cache early so visible capsules can render final badges immediately.
  void ensureMappingsLoaded();

  if (debugMode) {
    let lastPathname = window.location.pathname;
    log("debug", `Current pathname: ${lastPathname}`);

    routeLoggerInterval = window.setInterval(() => {
      const currentPathname = window.location.pathname;
      if (currentPathname === lastPathname) {
        return;
      }

      lastPathname = currentPathname;
      log("debug", `Pathname changed: ${currentPathname}`);
    }, 500);
  }

  const canObserveCurrentSettings = () => shouldObserveDomBadges(getSettings());

  const stopObserverForCurrentRoute = () => {
    if (!observerActive) {
      return;
    }

    log("debug", `Stopping DOM observer on route: ${window.location.pathname}`);
    stopObserving();
    observerActive = false;
  };

  const scheduleObservationStart = () => {
    if (observerActive || startupTimeouts.size > 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startupTimeouts.delete(timeoutId);
      if (canObserveCurrentSettings() && isObserverRoute(window.location.pathname)) {
        log("debug", `Starting DOM observer on route: ${window.location.pathname}`);
        startObserving();
        observerActive = true;
      }
    }, 50);

    startupTimeouts.add(timeoutId);
  };

  const syncObserverWithRoute = () => {
    const action = getObserverRouteAction({
      pathname: window.location.pathname,
      observerActive,
      settings: getSettings(),
    });

    if (action === "start") {
      scheduleObservationStart();
      return;
    }

    if (action === "stop") {
      stopObserverForCurrentRoute();
    }
  };

  // Patch library and home carousel (DOM-based)
  const handleLibraryPatch = (tree: any) => {
    log(GameStoreContext.LIBRARY, "Library patch applied. Listening ...");
    scheduleObservationStart();
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
    scheduleObservationStart();
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
    stopObserverForCurrentRoute();

    const bigPicWindow = getBigPictureWindow();
    if (bigPicWindow) {
      cleanupBadges(bigPicWindow);
    }

    syncObserverWithRoute();
  };

  libraryPatch();
  searchPatch();
  gameDetailsPatch();

  window.addEventListener(SETTINGS_CHANGED_EVENT, handleSettingsChange);
  routeMonitorInterval = window.setInterval(syncObserverWithRoute, routeMonitorIntervalMs);
  syncObserverWithRoute();

  return {
    titleView: <div>Non-Steam Badges</div>,
    name: "Non-Steam Badges",
    content: <Settings />,
    icon: <PluginIcon />,
    onDismount() {
      stopObserverForCurrentRoute();
      startupTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      startupTimeouts.clear();
      if (routeMonitorInterval) {
        clearInterval(routeMonitorInterval);
      }
      if (routeLoggerInterval) {
        clearInterval(routeLoggerInterval);
      }
      cleanupGameDetailsPatches();

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
