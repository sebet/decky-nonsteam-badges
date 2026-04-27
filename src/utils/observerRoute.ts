import type { PluginSettings } from "../types/settings";

export type ObserverRouteAction = "start" | "stop" | "noop";

export function isObserverRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/routes/library") ||
    pathname.startsWith("/routes/search")
  );
}

export function shouldObserveDomBadges(settings: PluginSettings): boolean {
  return (
    !settings.disableBadges &&
    (settings.libraryPosition !== "none" || settings.homePosition !== "none")
  );
}

export function getObserverRouteAction(params: {
  pathname: string;
  observerActive: boolean;
  settings: PluginSettings;
}): ObserverRouteAction {
  const { pathname, observerActive, settings } = params;

  if (!shouldObserveDomBadges(settings)) {
    return observerActive ? "stop" : "noop";
  }

  if (isObserverRoute(pathname)) {
    return observerActive ? "noop" : "start";
  }

  return observerActive ? "stop" : "noop";
}
