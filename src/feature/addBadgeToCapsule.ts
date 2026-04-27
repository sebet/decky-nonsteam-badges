import { log } from "../utils/logger";
import styles from "../components/Badge.module.css";
import { isNonSteamApp, sanitizedGameStoreName } from "src/utils/store";
import { getSettings } from "../utils/settings";
import {
  ensureMappingsLoaded,
  getCollectionVersion,
  getStore,
} from "../utils/storeCache";
import { getBadgeIcon, PULSATING_CLASSNAME } from "src/utils/badge";
import { GameStoreContext, GameStoreName } from "src/types/store";
import {
  getCapsuleBadgeClassKeys,
  getEffectiveCapsuleContext,
} from "../utils/badgePlacement.js";

const BADGE_CLASSNAME = "nonsteam-badge";
const POSITION_PREPARED_ATTR = "data-nonsteam-badge-positioned";

// Track which elements already have badges
let badgedElements = new WeakSet<Element>();
type CapsuleRenderState = {
  appid: string;
  renderSignature: string;
  collectionVersion: number;
};
let capsuleRenderCache = new WeakMap<Element, CapsuleRenderState>();

/**
 * Remove existing badges from DOM
 */
export function cleanupBadges(bigPicWindow: Window): void {
  badgedElements = new WeakSet<Element>();
  capsuleRenderCache = new WeakMap<Element, CapsuleRenderState>();

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

function extractAppIdFromImage(img: HTMLImageElement | null): string | null {
  if (!img || !img.src) return null;

  // Try Steam CDN pattern: /assets/APPID/
  let match = img.src.match(/\/assets\/(\d+)\//);
  if (match) return match[1];

  // Try custom images: /customimages/APPIDp.ext
  match = img.src.match(/\/customimages\/(\d+)p?\.(jpg|jpeg|png|webp)/i);
  if (match) return match[1];

  // Try rungameid
  match = img.src.match(/rungameid\/(\d+)/i);
  if (match) return match[1];

  // Try any numeric ID before extension or standalone
  match = img.src.match(/\/(\d{6,})([p\._-]?[a-z]*\.(jpg|png|webp))?/i);
  if (match) return match[1];

  return null;
}

function getAppId(capsule: Element): string | null {
  // lookup on Home Screen virtualized lists
  const dataId = capsule.getAttribute("data-id");
  if (dataId && !dataId.startsWith("placeholder")) {
    return dataId;
  }

  const img = capsule.querySelector("img");
  const imageAppId = extractAppIdFromImage(img);
  if (imageAppId) return imageAppId;

  // Look for any anchor tag with a game URL (e.g. steam://nav/games/details/APPID)
  try {
    const anchor =
      capsule.tagName.toLowerCase() === "a"
        ? capsule
        : capsule.querySelector("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href) {
        const match =
          href.match(/\/app\/(\d+)/i) ||
          href.match(/\/details\/(\d+)/i) ||
          href.match(/run\/(\d+)/i);
        if (match) return match[1];
      }
    }
  } catch (e) {}

  // React Fiber is the most expensive lookup, so keep it as the last fallback.
  try {
    const elementsToCheck = [capsule, ...Array.from(capsule.children)];
    for (const el of elementsToCheck) {
      const key = Object.keys(el).find(
        (k) =>
          k.startsWith("__reactFiber$") ||
          k.startsWith("__reactInternalInstance$"),
      );
      if (!key) continue;

      let fiber = (el as any)[key];
      let depth = 0;
      while (fiber && depth < 5) {
        const props = fiber.memoizedProps || fiber.return?.memoizedProps;
        if (props) {
          const id =
            props.appid ||
            props.appId ||
            props.unAppID ||
            props.nAppID ||
            props.m_unAppID ||
            props.overview?.appid ||
            props.appOverview?.appid ||
            props.app?.unAppID ||
            props.app?.nAppID ||
            props.app?.appid ||
            props.game?.appid ||
            props.item?.appid ||
            props.assetAppId ||
            props.strAppId;
          if (id) return String(id);
        }
        fiber = fiber.return;
        depth++;
      }
    }
  } catch (e) {}

  return null;
}

export function addBadgeToCapsule(
  capsule: Element,
  bigPicWindow: Window,
  context: GameStoreContext = GameStoreContext.LIBRARY,
): void {
  const settings = getSettings();
  let existingBadge = capsule.querySelector(
    `.${BADGE_CLASSNAME}`,
  ) as HTMLElement | null;

  if (settings.disableBadges) {
    if (existingBadge) {
      existingBadge.remove();
    }

    const defaultBadge = capsule.querySelector(".badge");
    if (defaultBadge && defaultBadge instanceof HTMLElement) {
      defaultBadge.style.display = "";
    }
    return;
  }

  // Real time settings update
  if (
    (context === GameStoreContext.LIBRARY &&
      settings.libraryPosition === "none") ||
    (context === GameStoreContext.HOME && settings.homePosition === "none")
  ) {
    return;
  }

  // Clean up any improperly attached or orphaned badges before proceeding
  let appid = existingBadge?.getAttribute("data-appid") || getAppId(capsule);

  // If we can't find a Steam ID through any method (no artwork URL, no visible anchor tag, no fiber prop),
  // Native Steam games NEVER have a missing ID. So it is inherently a generic/blank non-Steam app.
  if (!appid) {
    appid = "unknown_generic_app";
  } else if (!isNonSteamApp(appid)) {
    if (existingBadge) {
      existingBadge.remove();
    }
    return;
  }

  const img = capsule.querySelector("img");

  let targetElement: HTMLElement | null = null;
  const role = capsule.getAttribute("role");

  if (role === "gridcell") {
    if (img) {
      targetElement =
        (capsule.querySelector("div") as HTMLElement) ||
        (capsule as HTMLElement);
    } else {
      // If there is no image, Steam uses heavily clipped CSS inner blocks for the text box.
      // We must attach directly to the gridcell itself for the badge to be visible.
      targetElement = capsule as HTMLElement;
    }
  } else if (role === "listitem") {
    if (img) {
      targetElement =
        (img.closest('div[class*="_1pwP4"]') as HTMLElement) ||
        (img.closest("div") as HTMLElement) ||
        (capsule as HTMLElement);
    } else {
      targetElement = capsule as HTMLElement;
    }
  }

  if (!targetElement) return;

  // Navigation Persistence Fix: If the badge exists but isn't a direct child of the exact current targetElement
  // (caused by React throwing away and regenerating the DOM on back-navigation), destroy the ghost badge.
  if (existingBadge) {
    if (
      existingBadge.parentElement !== targetElement ||
      existingBadge.getAttribute("data-appid") !== String(appid)
    ) {
      existingBadge.remove();
      existingBadge = null;
    } else {
      badgedElements.add(capsule);
    }
  }

  // Ensure relative positioning
  if (!targetElement.hasAttribute(POSITION_PREPARED_ATTR)) {
    const computedStyle = bigPicWindow.getComputedStyle(targetElement);
    if (computedStyle.position === "static") {
      targetElement.style.position = "relative";
    }
    targetElement.setAttribute(POSITION_PREPARED_ATTR, "true");
  }

  // Check if we have a store name mapping for this 'appid'
  const cachedGameStoreName = getStore(appid)?.toLowerCase();
  const gameStoreName = sanitizedGameStoreName(cachedGameStoreName);
  const collectionVersion = getCollectionVersion();

  log(context, `Adding badge to capsule. Store name: ${gameStoreName}`);

  // Determine the capsules context
  let effectiveContext = context;
  const cachedContext = existingBadge?.getAttribute("data-context");
  if (cachedContext) {
    effectiveContext = cachedContext as GameStoreContext;
  } else if (effectiveContext === GameStoreContext.LIBRARY && img) {
    const rect = img.getBoundingClientRect();
    effectiveContext = getEffectiveCapsuleContext(effectiveContext, rect);
    if (effectiveContext === GameStoreContext.SEARCH) {
      log(
        context,
        `Detected landscaped capsule for appid ${appid}, using SEARCH context`,
      );
    }
  }

  const positionStyles = getCapsuleBadgeClassKeys(effectiveContext, settings)
    .map((classKey) => styles[classKey])
    .filter(Boolean);
  const storeSignature = gameStoreName ?? GameStoreName.DEFAULT;
  const renderSignature = [
    String(appid),
    effectiveContext,
    storeSignature,
    ...positionStyles,
  ].join("|");

  const cachedRenderState = capsuleRenderCache.get(capsule);
  if (
    existingBadge &&
    cachedRenderState &&
    cachedRenderState.appid === String(appid) &&
    cachedRenderState.renderSignature === renderSignature &&
    cachedRenderState.collectionVersion === collectionVersion
  ) {
    badgedElements.add(capsule);
    return;
  }

  const badge =
    existingBadge ?? (bigPicWindow.document.createElement("div") as HTMLElement);
  badge.setAttribute("data-appid", String(appid));
  badge.className = BADGE_CLASSNAME;
  badge.classList.add(styles.badge, ...positionStyles);
  badge.setAttribute("data-context", effectiveContext);

  // Hide the default non-steam badge if it exists
  const defaultBadge = targetElement.querySelector(".badge");
  if (defaultBadge && defaultBadge instanceof HTMLElement) {
    defaultBadge.style.display = "none";
  }

  if (!existingBadge) {
    targetElement.appendChild(badge);
  }
  badgedElements.add(capsule);

  if (gameStoreName) {
    log(
      context,
      `Got a game store name for appid ${appid}: ${gameStoreName}. Injecting badge icon into the DOM.`,
    );

    // Inject the badge icon in the DOM
    if (
      badge.getAttribute("data-store") !== gameStoreName ||
      !existingBadge
    ) {
      badge.innerHTML = getBadgeIcon(gameStoreName, effectiveContext);
      badge.setAttribute("data-store", gameStoreName);
    }
    badge.classList.remove(styles[PULSATING_CLASSNAME]);
    capsuleRenderCache.set(capsule, {
      appid: String(appid),
      renderSignature,
      collectionVersion,
    });
  } else {
    log(
      context,
      `No game store name for appid ${appid}: ${gameStoreName}. Falling back to default	while fetching.`,
    );

    // If we don't have a cached store name, show placeholder and pulse while fetching
    if (
      badge.getAttribute("data-store") !== GameStoreName.DEFAULT ||
      !existingBadge
    ) {
      badge.innerHTML = getBadgeIcon(GameStoreName.DEFAULT, effectiveContext);
      badge.setAttribute("data-store", GameStoreName.DEFAULT);
    }
    badge.classList.add(styles[PULSATING_CLASSNAME]);

    // Fetch mapping if not available and not already loaded
    (async () => {
      await ensureMappingsLoaded();

      if (
        !badge.isConnected ||
        badge.getAttribute("data-appid") !== String(appid)
      ) {
        return;
      }

      // Re-run scan to apply badges once loaded if we found a new mapping
      const newStore = getStore(appid);
      if (newStore) {
        badge.classList.remove(styles[PULSATING_CLASSNAME]);
        const newName = sanitizedGameStoreName(newStore);
        if (newName) {
          badge.innerHTML = getBadgeIcon(newName, effectiveContext);
          badge.setAttribute("data-store", newName);
          capsuleRenderCache.set(capsule, {
            appid: String(appid),
            renderSignature: [
              String(appid),
              effectiveContext,
              newName,
              ...positionStyles,
            ].join("|"),
            collectionVersion: getCollectionVersion(),
          });
        }
      } else {
        badge.classList.remove(styles[PULSATING_CLASSNAME]);
      }
    })();
  }
}
