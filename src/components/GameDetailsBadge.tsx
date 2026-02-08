import React, { useState, useEffect, ReactElement } from "react";
import styles from "./GameDetailsBadge.module.css";
import clsx from "clsx";
import { log } from "src/utils/logger";
import useSettings from "src/hooks/useSettings";
import SteamStoreButton from "src/components/SteamStoreButton";
import { ensureMappingsLoaded, getStore, getName } from "../utils/storeCache";
import { isNonSteamApp, sanitizedGameStoreName } from "src/utils/store";
import { getBadgeIcon, PULSATING_CLASSNAME } from "src/utils/badge";
import { BadgePosition } from "src/types/settings";
import { GameStoreName, GameStoreContext } from "src/types/store";
import { call } from "@decky/api";

const context = GameStoreContext.DETAILS;

export default function GameDetailsBadge(): ReactElement | null {
  const settings = useSettings();

  const [steamAppId, setSteamAppId] = useState<string | null>(null);
  const [gameStore, setGameStore] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Extract appid from current URL
  const currentPath = window.location.pathname;
  const match = currentPath.match(/\/library\/app\/(\d+)/);
  const appid = match ? match[1] : null;

  log(context, `Badge appid: ${appid}`);

  useEffect(() => {
    log(context, "Badge settings: " + JSON.stringify(settings));

    // If setting is disabled, clear any existing ID and stop.
    if (!settings.showSteamStoreButton) {
      setSteamAppId(null);
    }
  }, [settings.showSteamStoreButton]);

  // Fetch gameStore info from backend via cache
  useEffect(() => {
    if (!appid || !isNonSteamApp(appid)) {
      log(
        context,
        `Details page useEffect skipping - not a non-Steam app: ${appid}`,
      );
      setLoading(false);
      return;
    }

    log(context, "Details page useEffect - ensuring mappings loaded");

    (async () => {
      await ensureMappingsLoaded();

      const store = getStore(appid);
      const name = getName(appid);

      if (store) {
        setGameStore(store);
        log(context, `Identified Store via Cache: ${store}`);
      } else {
        log(context, `AppID ${appid} not found in cache.`);
      }
      setLoading(false);

      if (name && settings.showSteamStoreButton) {
        log(context, `Searching for Steam AppID using name: ${name}`);
        const steamId = await call<[string], string | null>(
          "search_steam_id",
          name,
        );

        if (steamId) {
          setSteamAppId(steamId);
          log(context, `Found Steam AppID: ${steamId}`);
        } else {
          log(context, `Could not find Steam AppID for ${name}`);
        }
      }
    })();
  }, [appid, settings.detailsPosition, settings.showSteamStoreButton]);

  // Only render for non-Steam games
  if (!appid || !isNonSteamApp(appid)) {
    return null;
  }

  const gameStoreName =
    sanitizedGameStoreName(gameStore) ?? GameStoreName.DEFAULT;

  const badge = loading
    ? getBadgeIcon(GameStoreName.DEFAULT, GameStoreContext.DETAILS)
    : getBadgeIcon(gameStoreName, GameStoreContext.DETAILS);

  if (loading) log(context, `Badge is loading`);

  log(context, `Badge valid: ${!!badge}`);

  // If badge position is disabled but button is enabled, default button to top-left position
  const badgePositionStyle =
    settings.detailsPosition === "none" && settings.showSteamStoreButton
      ? styles[`details-${BadgePosition.TOP_LEFT}`]
      : styles[`details-${settings.detailsPosition}`];

  return (
    <>
      <div
        className={clsx(
          styles.badge,
          styles.detailsBadge,
          badgePositionStyle,
          steamAppId ? styles.detailsBadgeWithButton : "",
          loading ? styles[PULSATING_CLASSNAME] : "",
        )}
      >
        {settings.detailsPosition !== "none" ? (
          <div dangerouslySetInnerHTML={{ __html: badge }} />
        ) : null}
        {steamAppId && <SteamStoreButton steamAppId={steamAppId} />}
      </div>
    </>
  );
}
