import { log } from "../utils/logger";
import styles from "../components/Badge.module.css";
import { isNonSteamApp, sanitizedGameStoreName } from "src/utils/store";
import { getSettings } from "../utils/settings";
import { BadgePosition } from "src/types/settings";
import { ensureMappingsLoaded, getStore } from "../utils/storeCache";
import { getBadgeIcon, PULSATING_CLASSNAME } from "src/utils/badge";
import { GameStoreContext, GameStoreName } from "src/types/store";

const BADGE_CLASSNAME = "nonsteam-badge";

// Track which elements already have badges
let badgedElements = new WeakSet<Element>();

/**
 * Remove existing badges from DOM
 */
export function cleanupBadges(bigPicWindow: Window): void {
  badgedElements = new WeakSet<Element>();

  const badges = bigPicWindow.document.querySelectorAll(`.${BADGE_CLASSNAME}`);
  badges.forEach((badge) => badge.remove());

  const defaultBadges = bigPicWindow.document.querySelectorAll(
    '.badge[style*="display: none"]',
  );

  defaultBadges.forEach((badge) => {
    if (badge instanceof HTMLElement) {
      badge.style.display = "";
    }
  });
}

function extractAppIdFromImage(img: HTMLImageElement): string | null {
  if (!img.src) return null;

  // Try Steam CDN pattern: /assets/APPID/
  let match = img.src.match(/\/assets\/(\d+)\//);
  if (match) return match[1];

  // Try custom images: /customimages/APPIDp.ext
  match = img.src.match(/\/customimages\/(\d+)p?\.(jpg|jpeg|png|webp)/i);
  if (match) return match[1];

  // Try any numeric ID before extension
  match = img.src.match(/\/(\d{6,})[\._-]?[a-z]*\.(jpg|png|webp)/i);
  if (match) return match[1];

  return null;
}

export function addBadgeToCapsule(
  capsule: Element,
  bigPicWindow: Window,
  context: GameStoreContext = GameStoreContext.LIBRARY,
): void {
  const settings = getSettings();

  // Real time settings update
  if (
    (context === GameStoreContext.LIBRARY &&
      settings.libraryPosition === "none") ||
    (context === GameStoreContext.HOME && settings.homePosition === "none")
  ) {
    return;
  }

  // Skip if already badged
  if (badgedElements.has(capsule)) return;

  const img = capsule.querySelector("img");
  if (!img) return;

  const appid = extractAppIdFromImage(img);
  log(context, `Appid: ${appid}`);

  if (!appid || !isNonSteamApp(appid)) return;

  // Find the container to attach badge to
  const role = capsule.getAttribute("role");
  let targetElement: HTMLElement | null = null;

  if (role === "gridcell") {
    // Library grid view
    targetElement = capsule.querySelector("div") as HTMLElement;
  } else if (role === "listitem") {
    // Home carousel
    targetElement =
      (img.closest('div[class*="_1pwP4"]') as HTMLElement) ||
      (img.closest("div") as HTMLElement);
  }

  if (!targetElement) return;

  // Ensure relative positioning
  const computedStyle = bigPicWindow.getComputedStyle(targetElement);
  if (computedStyle.position === "static") {
    targetElement.style.position = "relative";
  }

  // Check if we have a store name mapping for this 'appid'
  const cachedGameStoreName = getStore(appid)?.toLowerCase();
  const gameStoreName = sanitizedGameStoreName(cachedGameStoreName);

  log(context, `Adding badge to capsule. Store name: ${gameStoreName}`);

  // Determine the capsules context
  let effectiveContext = context;
  if (effectiveContext === GameStoreContext.LIBRARY) {
    const rect = img.getBoundingClientRect();
    if (rect.width > rect.height) {
      effectiveContext = GameStoreContext.SEARCH;
      log(
        context,
        `Detected landscaped capsule for appid ${appid}, using SEARCH context`,
      );
    }
  }

  // Get the settings/default position styles based on the effective context
  const positionStyles = (effectiveContext) => {
    let allStyles = [];
    if (effectiveContext === GameStoreContext.SEARCH) {
      allStyles.push(
        styles.searchBadge,
        styles[`search-${BadgePosition.TOP_RIGHT}`],
      );
    } else {
      allStyles.push(
        effectiveContext === GameStoreContext.HOME
          ? styles.homeBadge
          : styles.libraryBadge,
        effectiveContext === GameStoreContext.HOME
          ? styles[settings.homePosition]
          : styles[settings.libraryPosition],
      );
    }

    return allStyles;
  };

  const badge = bigPicWindow.document.createElement("div");

  badge.className = BADGE_CLASSNAME;
  badge.classList.add(styles.badge, ...positionStyles(effectiveContext));

  // Hide the default non-steam badge if it exists
  const defaultBadge = targetElement.querySelector(".badge");
  if (defaultBadge && defaultBadge instanceof HTMLElement) {
    defaultBadge.style.display = "none";
  }

  targetElement.appendChild(badge);
  badgedElements.add(capsule);

  if (gameStoreName) {
    log(
      context,
      `Got a game store name for appid ${appid}: ${gameStoreName}. Injecting badge icon into the DOM.`,
    );

    // Inject the badge icon in the DOM
    badge.innerHTML = getBadgeIcon(gameStoreName, effectiveContext);
  } else {
    log(
      context,
      `No game store name for appid ${appid}: ${gameStoreName}. Falling back to default	while fetching.`,
    );

    // If we don't have a cached store name, show placeholder and pulse while fetching
    badge.innerHTML = getBadgeIcon(GameStoreName.DEFAULT, effectiveContext);
    badge.classList.add(styles[PULSATING_CLASSNAME]);

    // Fetch mapping if not available and not already loaded
    (async () => {
      await ensureMappingsLoaded();

      // Re-run scan to apply badges once loaded if we found a new mapping
      const newStore = getStore(appid);
      if (newStore) {
        badge.classList.remove(styles[PULSATING_CLASSNAME]);
        const newName = sanitizedGameStoreName(newStore);
        if (newName) {
          badge.innerHTML = getBadgeIcon(newName, effectiveContext);
        }
      } else {
        badge.classList.remove(styles[PULSATING_CLASSNAME]);
      }
    })();
  }
}
