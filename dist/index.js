// Decky Loader will pass this api in, it's versioned to allow for backwards compatibility.
// @ts-ignore

// Prevents it from being duplicated in output.
const manifest = {"id":"decky-nonsteam-badges","name":"Non-Steam Badges","author":"sebet","version":"0.2.0","flags":[],"api_version":1,"publish":{"tags":["utility","ui","badges","nonsteam","non-steam"],"description":"A Decky plugin that helps identifying non-Steam games using themed badges","image":"https://raw.githubusercontent.com/sebet/decky-nonsteam-badges/main/assets/screenshot.jpg"}};
const API_VERSION = 2;
const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
// Initialize
if (!internalAPIConnection) {
    throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
}
// Version 1 throws on version mismatch so we have to account for that here.
let api;
try {
    api = internalAPIConnection.connect(API_VERSION, manifest.name);
}
catch {
    api = internalAPIConnection.connect(1, manifest.name);
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
}
if (api._version != API_VERSION) {
    console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
}
// TODO these could use a lot of JSDoc
const call = api.call;
const routerHook = api.routerHook;
const definePlugin = (fn) => {
    return (...args) => {
        // TODO: Maybe wrap this
        return fn(...args);
    };
};

function log(context, message, level = "log") {
    return;
}

const PLUGIN_ID = "nonsteam-badges-decky";
let loadedCSS = "";
function injectStyle(css) {
    if (!css)
        return;
    loadedCSS += css;
    // Inject into main window
    if (typeof document !== "undefined") {
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.innerHTML = css;
        document.head.appendChild(style);
    }
    // Store globally for other contexts if needed
    window.__NONSTEAM_BADGES_CSS =
        (window.__NONSTEAM_BADGES_CSS || "") + css;
}
function injectStyleIntoWindow(targetWindow) {
    const css = loadedCSS || window.__NONSTEAM_BADGES_CSS;
    if (!css || !targetWindow || !targetWindow.document)
        return;
    // Check if already injected
    if (targetWindow.document.querySelector(`style[data-plugin="${PLUGIN_ID}"]`))
        return;
    const style = targetWindow.document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-plugin", PLUGIN_ID);
    style.innerHTML = css;
    targetWindow.document.head.appendChild(style);
}
function removeStyleFromWindow(targetWindow) {
    if (!targetWindow || !targetWindow.document)
        return;
    const style = targetWindow.document.querySelector(`style[data-plugin="${PLUGIN_ID}"]`);
    if (style) {
        style.remove();
    }
}

var css_248z$1 = ".Badge-module_badge__MUvUi {\r\n  position: absolute;\r\n  display: flex;\r\n  border-radius: 5px;\r\n  backdrop-filter: blur(10px);\r\n  -webkit-backdrop-filter: blur(10px);\r\n  color: white;\r\n  pointer-events: none;\r\n  background: #0000002e;\r\n  z-index: 9999;\r\n}\r\n\r\n.Badge-module_detailsBadge__ycul2 {\r\n  z-index: 0;\r\n  box-sizing: border-box;\r\n  padding: 5px;\r\n  padding-bottom: 0;\r\n}\r\n\r\n.Badge-module_detailsBadgeWithButton__YG9ZN {\r\n  flex-direction: column;\r\n  height: auto;\r\n}\r\n\r\n.Badge-module_detailsBadgeWithButton__YG9ZN svg.icon-badge {\r\n  width: 48px;\r\n  height: 48px;\r\n}\r\n\r\n.Badge-module_libraryBadge__nvyI6 {\r\n  padding: 2px;\r\n  border-radius: 2px;\r\n}\r\n\r\n.Badge-module_libraryBadge__nvyI6 svg.icon-badge {\r\n  width: 28px;\r\n  height: 28px;\r\n}\r\n\r\n.Badge-module_homeBadge__VBw7G {\r\n  padding: 2px;\r\n  border-radius: 2px;\r\n}\r\n\r\n.Badge-module_homeBadge__VBw7G svg.icon-badge {\r\n  width: 28px;\r\n  height: 28px;\r\n}\r\n\r\n.Panel\r\n  [role=\"listitem\"]:first-of-type\r\n  .Badge-module_homeBadge__VBw7G\r\n  svg.icon-badge {\r\n  width: 40px;\r\n  height: 40px;\r\n}\r\n\r\n.Badge-module_searchBadge__V2InQ svg.icon-badge {\r\n  width: 24px;\r\n  height: 24px;\r\n}\r\n\r\n.Badge-module_nonsteam-badge-pulsing__k7UJv {\r\n  animation: Badge-module_nonsteam-badge-pulse__ux3h3 2s infinite ease-in-out;\r\n}\r\n\r\n.Badge-module_top-left__vhIBr {\r\n  top: 4px;\r\n  left: 4px;\r\n}\r\n\r\n.Badge-module_top-right__k9tm2 {\r\n  top: 4px;\r\n  right: 4px;\r\n}\r\n\r\n.Badge-module_bottom-left__B0MGj {\r\n  bottom: 4px;\r\n  left: 4px;\r\n}\r\n\r\n.Badge-module_bottom-right__wK-WR {\r\n  bottom: 4px;\r\n  right: 4px;\r\n}\r\n\r\n.Badge-module_details-top-left__9FED9 {\r\n  flex-direction: row;\r\n  gap: 5px;\r\n  top: 45px;\r\n  left: 20px;\r\n}\r\n\r\n.Badge-module_details-top-left__9FED9 svg.icon-badge {\r\n  width: 42px;\r\n  height: 42px;\r\n}\r\n\r\n.Badge-module_detailsBadgeWithButton__YG9ZN.Badge-module_details-top-left__9FED9 svg.icon-badge {\r\n  width: 32px;\r\n  height: 32px;\r\n}\r\n\r\n.Badge-module_details-top-right__GADVk {\r\n  top: 55px;\r\n  right: 20px;\r\n  align-items: center;\r\n}\r\n\r\n.Badge-module_search-top-right__V3fHe {\r\n  top: 10px;\r\n  right: 5px;\r\n}\r\n\r\n@keyframes Badge-module_nonsteam-badge-pulse__ux3h3 {\r\n  0% {\r\n    transform: scale(0.9);\r\n    opacity: 0.4;\r\n  }\r\n  50% {\r\n    transform: scale(1.1);\r\n    opacity: 0.8;\r\n  }\r\n  100% {\r\n    transform: scale(0.9);\r\n    opacity: 0.4;\r\n  }\r\n}\r\n";
var styles$1 = {"badge":"Badge-module_badge__MUvUi","detailsBadge":"Badge-module_detailsBadge__ycul2","detailsBadgeWithButton":"Badge-module_detailsBadgeWithButton__YG9ZN","libraryBadge":"Badge-module_libraryBadge__nvyI6","homeBadge":"Badge-module_homeBadge__VBw7G","searchBadge":"Badge-module_searchBadge__V2InQ","nonsteam-badge-pulsing":"Badge-module_nonsteam-badge-pulsing__k7UJv","nonsteam-badge-pulse":"Badge-module_nonsteam-badge-pulse__ux3h3","top-left":"Badge-module_top-left__vhIBr","top-right":"Badge-module_top-right__k9tm2","bottom-left":"Badge-module_bottom-left__B0MGj","bottom-right":"Badge-module_bottom-right__wK-WR","details-top-left":"Badge-module_details-top-left__9FED9","details-top-right":"Badge-module_details-top-right__GADVk","search-top-right":"Badge-module_search-top-right__V3fHe"};
injectStyle(css_248z$1);

var GameStoreName;
(function (GameStoreName) {
    GameStoreName["GOG"] = "gog";
    GameStoreName["EPIC"] = "epic";
    GameStoreName["AMAZON"] = "amazon";
    GameStoreName["ROCKSTAR"] = "rockstar";
    GameStoreName["UBISOFT"] = "ubisoft";
    GameStoreName["XBOX"] = "xbox";
    GameStoreName["EA"] = "ea";
    GameStoreName["ITCH"] = "itch";
    GameStoreName["SIDELOADED"] = "sideloaded";
    GameStoreName["DEFAULT"] = "default";
})(GameStoreName || (GameStoreName = {}));
var GameStoreContext;
(function (GameStoreContext) {
    GameStoreContext["LIBRARY"] = "library";
    GameStoreContext["DETAILS"] = "details";
    GameStoreContext["HOME"] = "home";
    GameStoreContext["SEARCH"] = "search";
})(GameStoreContext || (GameStoreContext = {}));

/**
 * Check if a game store name is valid
 */
function gameStoreIsValid(gameStore) {
    return [
        GameStoreName.GOG,
        GameStoreName.EPIC,
        GameStoreName.AMAZON,
        GameStoreName.ROCKSTAR,
        GameStoreName.UBISOFT,
        GameStoreName.XBOX,
        GameStoreName.EA,
        GameStoreName.ITCH,
        GameStoreName.SIDELOADED,
        GameStoreName.DEFAULT,
    ].includes(gameStore);
}
/**
 * Sanitize game store name to its valid enum value
 */
function sanitizedGameStoreName(gameStore) {
    const sanitizedGameStore = gameStore?.toLowerCase();
    return gameStoreIsValid(sanitizedGameStore) ? sanitizedGameStore : undefined;
}
/**
 * Check if an app ID belongs to a non-Steam game
 * Non-Steam games typically have IDs >= 2,000,000,000 or negative values
 */
function isNonSteamApp(appid) {
    const id = Number(appid);
    // Real Steam app IDs are typically < 6,000,000. Non-Steam game IDs generated via CRC32 
    // can be anywhere from 0 to 4.2 billion+, but occasionally end up < 2 billion.
    // Using 10,000,000 as a safe upper threshold to ensure no Non-Steam apps get ignored.
    return !isNaN(id) && (id > 10000000 || id < -1000000);
}

const SETTINGS_CHANGED_EVENT = "nonsteam-badges-settings-changed";
var SupportedStores;
(function (SupportedStores) {
    SupportedStores["GOG"] = "gog";
    SupportedStores["EPIC"] = "epic";
    SupportedStores["AMAZON"] = "amazon";
    SupportedStores["ROCKSTAR"] = "rockstar";
    SupportedStores["UBISOFT"] = "ubisoft";
    SupportedStores["XBOX"] = "xbox";
    SupportedStores["EA"] = "ea";
    SupportedStores["ITCH"] = "itch";
    SupportedStores["SIDELOADED"] = "sideloaded";
})(SupportedStores || (SupportedStores = {}));
var BadgePosition;
(function (BadgePosition) {
    BadgePosition["NONE"] = "none";
    BadgePosition["TOP_LEFT"] = "top-left";
    BadgePosition["TOP_RIGHT"] = "top-right";
    BadgePosition["BOTTOM_LEFT"] = "bottom-left";
    BadgePosition["BOTTOM_RIGHT"] = "bottom-right";
})(BadgePosition || (BadgePosition = {}));
const DEFAULT_SETTINGS = {
    homePosition: BadgePosition.BOTTOM_RIGHT,
    libraryPosition: BadgePosition.BOTTOM_RIGHT,
    detailsPosition: BadgePosition.TOP_RIGHT,
    addBadgesToAllNonSteamGames: true,
    showSteamStoreButton: true,
    disableBadges: false,
};

const context$3 = "settings";
const SETTINGS_KEY = "nonsteam-badges-settings";
function getSettings() {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (!stored)
            return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    catch (e) {
        return DEFAULT_SETTINGS;
    }
}
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        log(context$3, `Settings saved: ${JSON.stringify(settings)}`);
        window.dispatchEvent(new CustomEvent(SETTINGS_CHANGED_EVENT, {
            detail: settings,
        }));
    }
    catch (e) {
    }
}

var gog = [
	"gog"
];
var epic = [
	"epic"
];
var amazon = [
	"amazon",
	"luna"
];
var rockstar = [
	"rockstar",
	"rockstar games",
	"rockstargames",
	"social club"
];
var ubisoft = [
	"ubisoft",
	"uplay"
];
var xbox = [
	"xbox",
	"microsoft"
];
var ea = [
	"ea",
	"origin",
	"electronic arts",
	"electronicarts"
];
var itch = [
	"itch",
	"itch.io",
	"itchio"
];
var sideloaded = [
	"sideloaded",
	"pirated"
];
var storeMappings = {
	gog: gog,
	epic: epic,
	amazon: amazon,
	rockstar: rockstar,
	ubisoft: ubisoft,
	xbox: xbox,
	ea: ea,
	itch: itch,
	sideloaded: sideloaded
};

const context$2 = "cache";
const CACHE_TTL_MS = 60 * 1000; // 1 minute
let gameStoreMappingsCache = {};
let mappingsLoaded = false;
let isFetchingMappings = false;
let lastFetchTime = 0;
let lastUserCollectionsRef = null;
let lastUserCollectionsSignature = "";
let collectionVersion = 0;
/**
 * Wait for store mappings to be loaded from the backend before attempting to access the cache.
 */
async function ensureMappingsLoaded(force = false) {
    const now = Date.now();
    const isExpired = now - lastFetchTime > CACHE_TTL_MS;
    if (!force && mappingsLoaded && !isExpired)
        return;
    if (isFetchingMappings) {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (!isFetchingMappings) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }
    isFetchingMappings = true;
    try {
        const result = await call("get_all_store_mappings");
        if (result) {
            gameStoreMappingsCache = result;
            mappingsLoaded = true;
            lastFetchTime = Date.now();
        }
        else {
            log(context$2, JSON.stringify(result), "error");
        }
    }
    catch (e) {
    }
    finally {
        isFetchingMappings = false;
    }
}
function getFrontendStore(appid) {
    try {
        const supportedStores = Object.values(SupportedStores);
        const collectionStore = window.collectionStore;
        if (!collectionStore) {
            return null;
        }
        const userCollections = collectionStore.userCollections;
        if (!userCollections)
            return null;
        const collectionStateSignature = userCollections
            .map((collection) => {
            const apps = collection?.apps;
            const appCount = typeof apps?.size === "number"
                ? apps.size
                : Array.isArray(apps)
                    ? apps.length
                    : 0;
            return `${collection?.displayName ?? ""}:${appCount}`;
        })
            .join("|");
        if (userCollections !== lastUserCollectionsRef ||
            collectionStateSignature !== lastUserCollectionsSignature) {
            lastUserCollectionsRef = userCollections;
            lastUserCollectionsSignature = collectionStateSignature;
            collectionVersion++;
        }
        const numericAppId = parseInt(appid);
        if (isNaN(numericAppId))
            return null;
        for (const collection of userCollections) {
            if (collection.apps &&
                collection.apps.has &&
                collection.apps.has(numericAppId)) {
                const colName = String(collection.displayName ?? "");
                for (const store of supportedStores) {
                    const aliases = storeMappings[store] || [store];
                    for (const alias of aliases) {
                        const regex = new RegExp(`\\b${alias}\\b`, "i");
                        if (regex.test(colName)) {
                            return store;
                        }
                    }
                }
            }
        }
        return null;
    }
    catch (e) {
        log(context$2, "Could not check frontend collections: " + JSON.stringify(e), "warn");
        return null;
    }
}
function getStore(appid) {
    // Check Collections first to give them priority
    const frontendStore = getFrontendStore(appid);
    if (frontendStore) {
        return frontendStore;
    }
    // Check backend cache (Launch Options / localconfig.vdf)
    if (mappingsLoaded && gameStoreMappingsCache[appid]) {
        const entry = gameStoreMappingsCache[appid];
        if (typeof entry === "string")
            return entry;
        if (entry.store)
            return entry.store;
    }
    return null;
}
function getCollectionVersion() {
    return collectionVersion;
}
/**
 * Gets the game name for a given AppID from the cache.
 */
function getName(appid) {
    if (mappingsLoaded && gameStoreMappingsCache[appid]) {
        const entry = gameStoreMappingsCache[appid];
        if (typeof entry === "object" && entry.name) {
            return entry.name;
        }
    }
    return null;
}

const PULSATING_CLASSNAME = "nonsteam-badge-pulsing";
var GameStoreProp;
(function (GameStoreProp) {
    GameStoreProp["NAME"] = "name";
    GameStoreProp["GRADIENT"] = "gradient";
    GameStoreProp["ICON"] = "icon";
})(GameStoreProp || (GameStoreProp = {}));
const width = 64;
const height = 64;
const BADGE_STYLES = {
    gog: {
        name: "GOG",
        gradient: "linear-gradient(135deg, #86328A 0%, #B24592 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 34 31" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M31 31H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h28a3 3 0 0 1 3 3v25a3 3 0 0 1-3 3ZM4 24.5A1.5 1.5 0 0 0 5.5 26H11v-2H6.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5H11v-2H5.5A1.5 1.5 0 0 0 4 19.5Zm8-18A1.5 1.5 0 0 0 10.5 5h-5A1.5 1.5 0 0 0 4 6.5v5A1.5 1.5 0 0 0 5.5 13H9v-2H6.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H4v2h6.5a1.5 1.5 0 0 0 1.5-1.5Zm0 13v5a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5v-5a1.5 1.5 0 0 0-1.5-1.5h-5a1.5 1.5 0 0 0-1.5 1.5Zm9-13A1.5 1.5 0 0 0 19.5 5h-5A1.5 1.5 0 0 0 13 6.5v5a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5Zm9 0A1.5 1.5 0 0 0 28.5 5h-5A1.5 1.5 0 0 0 22 6.5v5a1.5 1.5 0 0 0 1.5 1.5H27v-2h-2.5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H22v2h6.5a1.5 1.5 0 0 0 1.5-1.5ZM30 18h-7.5a1.5 1.5 0 0 0-1.5 1.5V26h2v-5.5a.5.5 0 0 1 .5-.5h1v6h2v-6H28v6h2Zm-11.5-7h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5Zm-4 9h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Z" fill="white"/></svg>`,
    },
    epic: {
        name: "EPIC",
        gradient: "linear-gradient(135deg, #0078F2 0%, #00A8E8 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" pointer-events="all" fill="white" viewBox="0 0 2222 2604"><path d="M171.4 1C78.5 6.5 30.4 39.4 10.6 110.8c-5.3 19.1-8.1 38.5-9.7 66.7-.7 13-.9 308.2-.7 939 .3 862.4.4 921.1 2.1 937.5.9 9.6 2.4 22 3.3 27.5 7.2 44.6 36.6 79.5 90.7 107.5 14.6 7.6 25 12.2 99.2 44.2 149.2 64.3 821.5 348.1 849.9 358.7 19.3 7.3 31.1 9.9 50.9 11.3 37.1 2.7 62.9-2.3 101.6-19.3 7.5-3.3 56.6-23.6 109.1-45.1 504.4-206.2 758.9-315 811.3-347.1 56.5-34.6 89.4-85.1 101.4-155.7 1.7-10 1.8-52.1 2.1-925 .2-626.1 0-920.5-.7-933.5-2.4-43.5-9.2-73.9-22.2-99.4-25.1-49.4-69.4-72.2-149.4-77.1C2029.9-.1 191.4-.2 171.4 1zM707 429.5V505H506v253h201v152H506v303h201v151l-176.7-.2-176.8-.3-.3-504.8L353 354h354v75.5zm311.2-74c41.3 4.8 73.1 18.7 96.4 41.9 26 26.1 39.8 59.6 45.6 110.8 1 8.7 1.3 46.9 1.3 167.8 0 171.3.1 167.9-6 196.6-13.4 63.5-50.1 103-109.5 117.8-21.9 5.5-27.4 5.9-84.2 6.3l-52.8.5V1364H758V354h123.8c103.2 0 125.8.2 136.4 1.5zm345.6 503.2-.3 504.8-75.7.3-75.8.2V354h152l-.2 504.7zM1692.2 355c22.7 1.1 36.3 2.9 53.5 7 55.6 13.4 93 46.1 110.7 96.7 4.2 12.1 7.9 28.6 10.2 44.8 1.5 10.6 1.8 26.3 2.1 133.2l.4 121.3h-152l-.3-112.8c-.3-112.1-.4-112.7-2.5-120.4-5.7-20.2-15.6-29.5-35.7-33.3-11.1-2.1-58.5-2.1-67.5 0-16.1 3.8-30 14.5-37 28.6-2.2 4.3-4.8 11.3-5.8 15.6-1.7 7.5-1.8 21.5-1.8 330.3v322.5l2.4 7.9c5.6 18.1 16.6 28.2 36.8 33.8 7.2 2 10.2 2.2 37.3 2.2 27.9.1 29.9 0 37.5-2.2 4.4-1.3 10.1-3.5 12.7-4.9 6.6-3.6 14.3-12.1 17.9-19.6 6-12.9 5.9-11.1 5.9-133.8V960h152v113.2c0 112.8-.5 133.3-3.6 153.3-6.1 39.3-20.7 69.9-43.8 92.3-23.9 23-54.2 36.3-98.1 42.9-10.7 1.6-19.5 1.8-82 1.8-74.2 0-75.4-.1-100.3-5.1-52.2-10.4-88.4-36.8-108.3-78.9-8.1-17.1-12.8-33.8-16.6-59-1.7-11.4-1.8-29.1-1.8-352 0-321 .1-340.7 1.8-352.5 3.5-24.3 9.2-46.1 16.8-63.3 26.4-60 79.7-93.8 153.9-97.6 21.6-1.2 82.7-1.2 105.2-.1zM494.5 1618.5c26.3 4.5 42.8 10.7 63.9 23.7 8.7 5.3 21.6 14.8 21.6 15.8 0 .3-1.7 2.6-3.9 5.1-4.3 4.9-11.5 13.5-29.4 35.1-6.7 8.1-12.5 14.7-12.9 14.8-.4 0-4.4-2.7-9-6-10.8-7.7-26.2-15.5-36.3-18.2-6.6-1.7-11-2.1-25-2.2-16.1-.1-17.5.1-25.6 2.7-27 8.9-46.8 32.4-52.5 62.4-2.1 11-1.4 29.3 1.5 40.3 8.2 31.7 31.4 52.9 64.3 58.6 18.1 3.2 42.9-.3 57.8-8.2l7-3.6V1802h-60v-58h135v129.8l-6.7 5c-12 8.7-18.8 13-28.9 18-34.6 17.4-61.6 23.3-100.8 21.9-27.8-1-46.4-5.6-70.1-17.3-42.2-20.8-70.7-58.3-79.2-104.4-2.1-11.3-2.8-34.8-1.4-47 3-26.5 15-55 32.3-76.7 22.7-28.6 62-50.3 99.8-55.2 4.7-.6 9.6-1.3 11-1.5 5.3-1 38.9.4 47.5 1.9zm1268.9-.4c11 .9 26.3 3.8 39.3 7.3 14.2 3.9 35.9 14.6 49.6 24.4l7.7 5.5-1.6 2.6c-.9 1.4-3.3 4.8-5.4 7.6-3.3 4.5-24.3 34.1-29.9 42.2l-2.2 3.2-6.9-4.4c-27.7-17.7-62.2-27.4-84.5-23.6-15.4 2.6-23.4 12-21.1 24.6 2.1 10.9 13.8 16.4 59.1 27.5 36.6 9 56.5 16.8 71.7 28.3 9 6.9 12.3 10.3 18.2 19.2 11.2 16.8 14.3 43.1 8.1 67.2-7.6 29.2-29.5 50.6-62.6 61.2-48.3 15.4-113.9 7.1-160.3-20.3-9.4-5.6-26.6-18.3-26.6-19.8 0-.9 8.7-11.5 22-26.8 3.6-4.1 9.8-11.4 13.8-16.3 4-4.8 7.5-8.7 7.7-8.7.2 0 5.5 3.4 11.7 7.6 26.1 17.6 53.3 26.4 81.2 26.4 25.7 0 36.6-6.6 36.6-22.1 0-14.8-9.3-19.6-64.5-33-38.4-9.3-59.4-18.8-74.6-33.9-9.6-9.5-14.4-17.3-18.1-29-2-6.6-2.3-9.5-2.3-24.5 0-13.4.4-18.4 1.9-23.9 7.7-28.6 28.5-50.3 58.4-61.1 8.5-3.1 22.7-6.5 31.2-7.5 9.8-1.1 29-1.1 42.4.1zm-938.4 9.6c4.6 10.8 15.1 35.3 21.5 50.3 12.6 29.3 15.9 37 19.5 45.5 2 4.9 6.1 14.4 8.9 21 2.9 6.6 7.7 17.8 10.8 25 3 7.1 8.4 19.5 11.8 27.5 3.5 8 12.2 28.4 19.5 45.5 7.2 17 15.9 37.3 19.2 45 10.4 24.2 10.8 25.2 10.8 25.9 0 .3-18.8.5-41.7.4l-41.7-.3-7.3-18c-4.1-9.9-9-22.2-11-27.3l-3.7-9.2-58.5.2-58.5.3-5.3 13c-2.9 7.1-7.6 18.8-10.5 26-2.9 7.1-5.6 13.6-6.1 14.2-.7 1-10.2 1.3-41.3 1.3-22.2 0-40.4-.3-40.4-.7 0-.8 4.6-11.8 13-31.3 15-34.5 19-43.9 19-44.4 0-.4 2.5-6.1 5.5-12.9 3-6.7 13.5-31.1 23.4-54.2 9.8-23.1 18.6-43.6 19.4-45.5.8-1.9 3.5-8.2 6.1-14 7.5-17.4 17.6-41 21.1-49.5 1.8-4.4 5.3-12.6 7.9-18.3 2.5-5.6 4.6-10.5 4.6-10.8 0-.4 1.2-3.3 2.6-6.5l2.7-5.9h75.4l3.3 7.7zm247 7.5c4.6 7.3 10.6 16.9 13.3 21.3 2.8 4.4 6.7 10.7 8.8 14 2.2 3.3 6.4 10 9.4 15 3.1 4.9 8 12.8 11 17.5 2.9 4.7 6.6 10.5 8.1 13 7.9 13 12.8 20 13.5 19.3.4-.4 5.1-7.8 10.5-16.3 17.9-28.6 46.7-74.4 51.2-81.5 2.4-3.9 5.6-8.9 7-11.3l2.7-4.2h83.5v292h-78l-.2-86.3-.3-86.2-16.3 24.5c-8.9 13.5-26.2 39.7-38.5 58.2-12.2 18.6-22.6 33.6-23.2 33.5-.5-.2-5.6-7.3-11.2-15.8-5.5-8.5-16.7-25.3-24.6-37.4-8-12.1-20.4-31-27.6-42l-13.1-20-.2 85.5-.3 85.5h-77l-.3-145.8-.2-145.7h83.7l8.3 13.2zm514 19.8v33h-158l.2 23.7.3 23.8 70.8.3 70.7.2v62h-142v49l79.8.2 79.7.3v66l-118.2.3-118.3.2v-292h235v33zm-73.1 619.4c-.7.7-400.7 149.6-401.7 149.6-.8 0-350.6-130.2-399.2-148.5-2.9-1.1 64.2-1.4 398.9-1.4 221.3-.1 402.2.1 402 .3z"/><path d="M909 674v185h26.8c42.7 0 52.1-1.8 61.8-11.4 5.4-5.4 8.5-11.9 10.7-22.6.9-4.1 1.2-43.5 1.2-150 0-135.9-.1-145-1.8-152.2-3.7-15.6-11.1-25.6-22.2-29.7-8.4-3.2-19.8-4.1-49.2-4.1H909v185zM779.2 1722.2c-2.3 5.7-8.9 22-14.7 36.3-5.9 14.3-11.8 28.8-13.1 32.2l-2.4 6.3h34c18.7 0 34-.2 34-.3 0-.6-17.8-45.7-19.5-49.4-.7-1.7-4.2-10.2-7.5-19-3.4-8.7-6.3-15.9-6.5-16.1-.1-.2-2.1 4.3-4.3 10z"/></svg>`,
    },
    amazon: {
        name: "AMAZON",
        gradient: "linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 -1 20 20" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.251 13.716c.393-.102 1.304-.265 1.691-.18.545.049.873.139.982.271.231.343-.115 1.543-.273 1.935-.139.344-.79 1.449-1.127 1.449-.103 0-.181-.075-.128-.216 1.237-2.88.684-2.804-1.145-2.646-.236.028-1.102.201-1-.001 0-.239.761-.55 1-.612zm-8.618-5.238c0 .468.118.843.354 1.124.676.806 1.91.374 2.428-.584.285-.489.581-1.444.581-2.682-1 0-1.318.048-1.681.144-1.067.3-1.682.966-1.682 1.998zm-3.127.36c0-1.687.908-2.869 2.309-3.456 1.237-.522 2.944-.665 4.181-.739 0-1.483-.203-2.664-1.763-2.664-.501 0-1.396.555-1.6 1.481-.049.239-.17.411-.364.447l-2.091-.235c-.253-.059-.351-.198-.291-.437C6.309 1.05 8.145.117 10.233 0c1 0 2.512-.013 3.691 1.062 1.274 1.262 1.072 2.852 1.072 6.967 0 .988.015 1.083.691 1.961.136.202.148.394-.05.541-1.006.864-1.553 1.331-1.638 1.403-.146.108-.323.12-.529.036-.895-.759-.68-.714-1.237-1.404-1.129 1.218-2.016 1.549-3.527 1.549-1.796 0-3.2-1.11-3.2-3.276zM.324 13.95c3.03 1.74 6.327 2.61 9.891 2.61 2.375 0 4.721-.438 7.036-1.314.351-.139.721-.409.936-.108.103.145.07.277-.1.396C15.844 17.138 12.718 18 9.996 18c-3.851 0-7.277-1.415-9.89-3.744-.233-.191-.047-.473.218-.307"/></svg>`,
    },
    rockstar: {
        name: "ROCKSTAR",
        gradient: "linear-gradient(135deg, #FCAF17 0%, #FFD166 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" role="img" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M5.971 6.816h3.241c1.469 0 2.741-.448 2.741-2.084 0-1.3-1.117-1.576-2.19-1.576H6.748l-.777 3.66Zm12.834 8.753h5.168l-4.664 3.228.755 5.087-4.041-3.07L10.599 24l2.536-5.392s-2.95-3.075-2.947-3.075c-.198-.262-.265-.936-.265-1.226 0-.367.024-.739.049-1.134.028-.451.058-.933.058-1.476 0-1.338-.59-2.038-2.036-2.038H5.283l-1.18 5.525H.026L3.269 0h7.672c2.852 0 5.027.702 5.027 3.936 0 2.276-1.12 3.894-3.592 4.233v.045c1.162.276 1.598 1.062 1.598 2.527 0 .585-.018 1.098-.034 1.581-.015.428-.03.834-.03 1.243 0 .525.137 1.382.48 1.968h.567l3.028-5.06.82 5.096Zm-1.233-2.948-2.187 3.654h-3.457l2.103 2.189-1.73 3.672 3.777-2.218 2.976 2.263-.553-3.731 3.093-2.139h-3.43l-.592-3.69Z"/></svg>`,
    },
    ubisoft: {
        name: "UBISOFT",
        gradient: "linear-gradient(135deg, #0078FF 0%, #0012FF 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" role="img" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M23.561 11.988C23.301-.304 6.954-4.89.656 6.634c.282.206.661.477.943.672a11.747 11.747 0 00-.976 3.067 11.885 11.885 0 00-.184 2.071C.439 18.818 5.621 24 12.005 24c6.385 0 11.556-5.17 11.556-11.556v-.455zm-20.27 2.06c-.152 1.246-.054 1.636-.054 1.788l-.282.098c-.108-.206-.37-.932-.488-1.908C2.163 10.308 4.7 6.96 8.57 6.33c3.544-.52 6.937 1.68 7.728 4.758l-.282.098c-.087-.087-.228-.336-.77-.878-4.281-4.281-11.002-2.32-11.956 3.74zm11.002 2.081a3.145 3.145 0 01-2.59 1.355 3.15 3.15 0 01-3.155-3.155 3.159 3.159 0 012.927-3.144c1.018-.043 1.972.51 2.416 1.398a2.58 2.58 0 01-.455 2.95c.293.205.575.4.856.595zm6.58.12c-1.669 3.782-5.106 5.766-8.77 5.712-7.034-.347-9.083-8.466-4.38-11.393l.207.206c-.076.108-.358.325-.791 1.182-.51 1.041-.672 2.081-.607 2.732.369 5.67 8.314 6.83 11.045 1.214C21.057 8.217 11.822.401 3.626 6.374l-.184-.184C5.599 2.808 9.816 1.3 13.837 2.309c6.147 1.55 9.453 7.956 7.035 13.94z" /></svg>`,
    },
    xbox: {
        name: "XBOX",
        gradient: "linear-gradient(135deg, #107C10 0%, #17A917 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="-48 -48 608 608" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M369.9 318.2c44.3 54.3 64.7 98.8 54.4 118.7-7.9 15.1-56.7 44.6-92.6 55.9-29.6 9.3-68.4 13.3-100.4 10.2-38.2-3.7-76.9-17.4-110.1-39C93.3 445.8 87 438.3 87 423.4c0-29.9 32.9-82.3 89.2-142.1 32-33.9 76.5-73.7 81.4-72.6 9.4 2.1 84.3 75.1 112.3 109.5zM188.6 143.8c-29.7-26.9-58.1-53.9-86.4-63.4-15.2-5.1-16.3-4.8-28.7 8.1-29.2 30.4-53.5 79.7-60.3 122.4-5.4 34.2-6.1 43.8-4.2 60.5 5.6 50.5 17.3 85.4 40.5 120.9 9.5 14.6 12.1 17.3 9.3 9.9-4.2-11-.3-37.5 9.5-64 14.3-39 53.9-112.9 120.3-194.4zm311.6 63.5C483.3 127.3 432.7 77 425.6 77c-7.3 0-24.2 6.5-36 13.9-23.3 14.5-41 31.4-64.3 52.8C367.7 197 427.5 283.1 448.2 346c6.8 20.7 9.7 41.1 7.4 52.3-1.7 8.5-1.7 8.5 1.4 4.6 6.1-7.7 19.9-31.3 25.4-43.5 7.4-16.2 15-40.2 18.6-58.7 4.3-22.5 3.9-70.8-.8-93.4zM141.3 43C189 40.5 251 77.5 255.6 78.4c.7.1 10.4-4.2 21.6-9.7 63.9-31.1 94-25.8 107.4-25.2-63.9-39.3-152.7-50-233.9-11.7-23.4 11.1-24 11.9-9.4 11.2z" /></svg>`,
    },
    ea: {
        name: "EA",
        gradient: "linear-gradient(135deg, #111111 0%, #333333 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M17.5 15l-3 -6l-3 6h-5l1.5 -3"/><path d="M17 14h-2"/><path d="M6.5 12h3.5"/><path d="M8 9h3"/></svg>`,
    },
    itch: {
        name: "ITCH",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 245.371 220.736" xmlns="http://www.w3.org/2000/svg"><path d="M31.99 1.365C21.287 7.72.2 31.945 0 38.298v10.516C0 62.144 12.46 73.86 23.773 73.86c13.584 0 24.902-11.258 24.903-24.62 0 13.362 10.93 24.62 24.515 24.62 13.586 0 24.165-11.258 24.165-24.62 0 13.362 11.622 24.62 25.207 24.62h.246c13.586 0 25.208-11.258 25.208-24.62 0 13.362 10.58 24.62 24.164 24.62 13.585 0 24.515-11.258 24.515-24.62 0 13.362 11.32 24.62 24.903 24.62 11.313 0 23.773-11.714 23.773-25.046V38.298c-.2-6.354-21.287-30.58-31.988-36.933C180.118.197 157.056-.005 122.685 0c-34.37.003-81.228.54-90.697 1.365zm65.194 66.217a28.025 28.025 0 0 1-4.78 6.155c-5.128 5.014-12.157 8.122-19.906 8.122a28.482 28.482 0 0 1-19.948-8.126c-1.858-1.82-3.27-3.766-4.563-6.032l-.006.004c-1.292 2.27-3.092 4.215-4.954 6.037a28.5 28.5 0 0 1-19.948 8.12c-.934 0-1.906-.258-2.692-.528-1.092 11.372-1.553 22.24-1.716 30.164l-.002.045c-.02 4.024-.04 7.333-.06 11.93.21 23.86-2.363 77.334 10.52 90.473 19.964 4.655 56.7 6.775 93.555 6.788h.006c36.854-.013 73.59-2.133 93.554-6.788 12.883-13.14 10.31-66.614 10.52-90.474-.022-4.596-.04-7.905-.06-11.93l-.003-.045c-.162-7.926-.623-18.793-1.715-30.165-.786.27-1.757.528-2.692.528a28.5 28.5 0 0 1-19.948-8.12c-1.862-1.822-3.662-3.766-4.955-6.037l-.006-.004c-1.294 2.266-2.705 4.213-4.563 6.032a28.48 28.48 0 0 1-19.947 8.125c-7.748 0-14.778-3.11-19.906-8.123a28.025 28.025 0 0 1-4.78-6.155 27.99 27.99 0 0 1-4.736 6.155 28.49 28.49 0 0 1-19.95 8.124c-.27 0-.54-.012-.81-.02h-.007c-.27.008-.54.02-.813.02a28.49 28.49 0 0 1-19.95-8.123 27.992 27.992 0 0 1-4.736-6.155zm-20.486 26.49l-.002.01h.015c8.113.017 15.32 0 24.25 9.746 7.028-.737 14.372-1.105 21.722-1.094h.006c7.35-.01 14.694.357 21.723 1.094 8.93-9.747 16.137-9.73 24.25-9.746h.014l-.002-.01c3.833 0 19.166 0 29.85 30.007L210 165.244c8.504 30.624-2.723 31.373-16.727 31.4-20.768-.773-32.267-15.855-32.267-30.935-11.496 1.884-24.907 2.826-38.318 2.827h-.006c-13.412 0-26.823-.943-38.318-2.827 0 15.08-11.5 30.162-32.267 30.935-14.004-.027-25.23-.775-16.726-31.4L46.85 124.08C57.534 94.073 72.867 94.073 76.7 94.073zm45.985 23.582v.006c-.02.02-21.863 20.08-25.79 27.215l14.304-.573v12.474c0 .584 5.74.346 11.486.08h.006c5.744.266 11.485.504 11.485-.08v-12.474l14.304.573c-3.928-7.135-25.79-27.215-25.79-27.215v-.006l-.003.002z" fill="white"/></svg>`,
    },
    sideloaded: {
        name: "SIDELOADED",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 514 396" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="#FEFEFE" opacity="1.000000" stroke="none" d="M302.000000,397.000000 C201.360825,397.000000 101.221642,397.000000 1.041232,397.000000 C1.041232,265.063721 1.041232,133.127426 1.041232,1.095567 C172.222549,1.095567 343.445160,1.095567 514.833862,1.095567 C514.833862,132.999832 514.833862,264.999908 514.833862,397.000000 C444.127319,397.000000 373.313660,397.000000 302.000000,397.000000 M131.036179,209.544708 C126.753059,214.410599 122.415199,219.230331 118.236694,224.184464 C117.473770,225.088989 117.360329,226.541321 116.947075,227.740768 C118.134102,228.129578 119.320549,228.856033 120.508255,228.858093 C155.335785,228.918655 190.163452,228.893982 224.991043,228.934082 C227.547562,228.937012 228.932556,228.250793 229.299606,225.403336 C230.063904,219.474426 231.495117,213.624786 232.127258,207.686691 C234.845825,182.150040 249.902954,164.498230 274.286530,158.860916 C277.644775,158.084534 281.209778,157.952560 284.679688,157.947327 C324.673065,157.887009 364.666534,157.910110 404.660004,157.906006 C407.478363,157.905716 410.204865,158.499420 410.160828,153.816040 C409.913330,127.491058 409.974243,101.163277 409.903717,74.836510 C409.865448,60.545166 398.120331,48.827637 383.815247,48.823116 C337.656128,48.808525 291.496918,48.854755 245.338074,48.743393 C241.851700,48.734985 239.368744,49.751022 237.098450,52.309269 C227.826904,62.756741 218.423538,73.087082 209.096115,83.485138 C183.115417,112.448006 157.165207,141.438217 131.169678,170.387756 C115.504196,187.833405 99.750122,205.199615 84.126884,222.682877 C82.865829,224.094040 82.311363,226.136642 80.912224,228.908875 C89.305519,228.908875 96.283401,229.178680 103.220589,228.765396 C105.714729,228.616791 108.769653,227.446152 110.441322,225.676849 C119.116516,216.494797 127.427925,206.969009 135.865021,197.562042 C147.188217,184.937119 158.474518,172.278534 169.904724,159.751236 C170.772842,158.799789 172.659119,158.777328 174.072128,158.323059 C173.751266,159.740402 173.885727,161.560440 173.041565,162.514999 C159.273804,178.083084 145.382248,193.541687 131.036179,209.544708 M126.500000,48.818851 C103.678421,48.818890 80.856834,48.802174 58.035278,48.825165 C44.078129,48.839226 31.912922,60.421085 31.874540,74.347908 C31.736809,124.321999 31.857141,174.296768 31.747461,224.270996 C31.738855,228.192093 33.299263,229.023483 36.794067,228.964722 C46.619602,228.799545 56.461674,228.620041 66.272987,229.028488 C71.181465,229.232834 74.423096,227.348282 77.424164,223.881104 C84.383598,215.840759 91.469696,207.909271 98.554214,199.978088 C115.495522,181.012146 132.446335,162.054642 149.428375,143.125153 C175.956909,113.554405 202.524887,84.019043 229.024384,54.422329 C230.180832,53.130695 230.821793,51.377522 232.287598,48.818588 C196.398331,48.818588 161.949173,48.818588 126.500000,48.818851 M88.500015,233.795670 C72.844002,233.795685 57.187695,233.736404 41.532089,233.815826 C30.389938,233.872345 31.818512,232.225204 31.824825,243.655487 C31.833069,258.582733 43.228886,270.754913 58.030388,270.810669 C110.993256,271.010101 163.957352,270.868866 216.920883,270.935608 C220.478714,270.940094 221.861404,269.559814 222.368805,266.071960 C223.636032,257.360748 225.280792,248.704102 226.796509,240.029495 C227.786545,234.363510 227.331329,233.799667 221.409409,233.798889 C177.439606,233.793045 133.469818,233.795563 88.500015,233.795670 M457.576477,361.254242 C461.629181,360.586945 466.011017,360.686859 469.675476,359.114594 C482.912506,353.435028 488.640076,340.962830 485.787384,325.154907 C480.629211,296.570923 475.425446,267.995117 470.192566,239.424713 C469.497772,235.631165 468.521484,231.889175 467.675568,228.123306 C467.084808,228.018707 466.494049,227.914093 465.903320,227.809479 C464.534058,230.263992 463.084625,232.677628 461.808472,235.179626 C452.982422,252.484085 432.369690,264.008698 413.091888,261.611359 C406.957581,260.848541 401.062988,258.168976 395.053925,256.382690 C392.980865,255.766418 389.404755,254.256134 390.543579,258.220215 C391.972534,263.194122 393.540558,268.536957 399.847076,270.742462 C411.722382,274.895416 415.399658,283.997955 411.342255,296.297516 C410.698639,298.248566 411.032074,301.017487 411.947113,302.908234 C418.908691,317.293518 425.878540,331.686127 433.354797,345.807007 C438.197937,354.954529 445.594574,361.072083 457.576477,361.254242 M276.256897,328.714355 C280.652954,319.938110 285.199524,311.231689 289.328857,302.331665 C290.248199,300.350189 290.443817,297.414459 289.699524,295.384979 C286.190979,285.817810 289.533478,275.202454 299.372864,271.853088 C306.301849,269.494385 307.581970,263.852844 310.862732,259.222626 C311.401917,258.461670 311.459717,256.378265 311.008179,256.101959 C310.081421,255.534821 308.632355,255.585464 307.448761,255.748413 C306.507568,255.878006 305.638947,256.547485 304.742218,256.985718 C283.793579,267.223297 258.011749,261.124847 243.920807,242.488831 C241.055206,238.698944 238.556244,234.631851 235.888260,230.692566 C235.378311,230.610474 234.868362,230.528381 234.358414,230.446304 C233.489578,233.034515 232.268112,235.561691 231.807785,238.220642 C228.214951,258.974274 224.660294,279.735870 221.320724,300.531433 C219.561066,311.488922 217.663010,322.479065 216.910553,333.528229 C216.143982,344.784882 222.686096,352.806641 232.368576,357.016327 C242.509399,361.425293 253.570206,361.273773 261.399750,352.343109 C267.299896,345.613190 271.176575,337.109283 276.256897,328.714355 M272.629974,163.759445 C252.271896,169.746078 240.323334,183.083130 237.403717,204.222076 C234.691055,223.862640 245.174835,243.746719 262.781555,252.541550 C280.614197,261.449249 301.432709,257.681610 316.033173,243.622513 C331.815521,228.425293 333.414886,205.063278 325.168854,188.433670 C315.360748,168.653915 295.135437,159.444839 272.629974,163.759445 M329.056061,186.530853 C329.528168,187.769684 329.955627,189.027725 330.479187,190.244415 C336.563995,204.384521 336.189636,218.335037 329.288177,232.103012 C324.290070,242.073944 319.307892,252.052902 314.290253,262.013977 C310.780060,268.982361 310.764618,268.963013 317.378265,273.562958 C318.326447,274.222473 319.523376,274.830994 320.023254,275.772156 C321.663879,278.861267 324.331268,278.887085 327.281494,278.871033 C341.111969,278.795868 354.944489,278.720337 368.773193,278.894104 C374.488800,278.965912 380.003601,279.298706 383.786285,273.745850 C384.550842,272.623535 386.186798,271.931244 387.562317,271.423676 C390.211243,270.446198 390.805756,269.107056 389.432617,266.510254 C384.224182,256.660339 379.575562,246.491425 373.962006,236.883240 C359.950623,212.901367 365.585754,184.204147 387.915649,167.652008 C389.165192,166.725784 390.018402,165.264893 391.754639,163.236908 C363.743408,163.236908 337.123718,163.236908 310.278839,163.236908 C316.671448,171.045349 322.726837,178.441910 329.056061,186.530853 M432.963928,254.699463 C457.361481,245.513382 470.533966,219.336868 460.742432,192.629333 C454.221588,174.843063 436.850159,161.681213 415.148895,162.624817 C397.092377,163.409958 380.368317,175.319687 373.685394,193.429367 C366.830109,212.006256 372.783081,233.805252 387.780853,246.402924 C401.084137,257.577301 415.979156,259.527893 432.963928,254.699463 M170.876740,277.767487 C170.850662,288.093323 170.946381,298.421722 170.732162,308.743652 C170.657608,312.335541 172.015305,313.306976 175.409744,313.261047 C186.900192,313.105652 198.396057,313.080353 209.885406,313.272369 C213.561539,313.333771 214.742050,311.845886 215.245117,308.428131 C216.597702,299.238708 218.165405,290.074402 219.933731,280.955597 C220.741272,276.791321 219.299866,275.685059 215.323669,275.735168 C202.167633,275.901062 189.007965,275.762329 175.850357,275.844910 C174.294617,275.854645 172.742935,276.510712 170.876740,277.767487 M129.668228,329.437866 C126.326576,336.338043 126.679108,336.900055 134.374969,336.900604 C157.023743,336.902191 179.672516,336.901184 202.321289,336.901154 C211.327225,336.901154 211.317337,336.900391 211.972061,328.193298 C212.071655,326.868744 212.280075,325.549622 212.492477,324.236755 C213.390472,318.686066 212.949905,318.110413 207.396027,318.105530 C187.911438,318.088440 168.426514,318.162842 148.942352,318.069153 C140.505981,318.028564 134.300705,321.637054 129.668228,329.437866 M408.262817,290.263702 C408.940277,284.307251 407.440979,278.636871 401.771667,276.505310 C397.681488,274.967468 392.133240,274.795624 388.069580,276.287292 C381.952576,278.532684 379.676056,286.608673 381.738708,293.384796 C383.430481,298.942383 389.206726,302.470490 396.274017,302.262817 C402.371704,302.083649 406.722107,298.048004 408.262817,290.263702 M310.829010,274.874390 C296.645325,272.553101 292.023621,282.599945 293.170776,291.161774 C293.854767,296.266632 296.902161,299.933105 301.435944,301.520813 C305.795197,303.047424 310.627014,303.260925 314.650970,299.866364 C323.749329,292.191040 322.336029,280.736511 310.829010,274.874390 M310.821045,334.600616 C308.655731,325.061096 301.892090,320.443512 293.124329,317.767212 C288.606140,316.388031 285.938141,317.683319 284.223206,322.103943 C282.848999,325.646271 280.948395,329.000092 279.104431,332.339905 C277.308044,335.593597 278.206299,336.929901 281.822632,336.912231 C290.292603,336.870819 298.763672,336.954285 307.232025,336.829773 C308.378204,336.812958 309.511078,335.890961 310.821045,334.600616 z"/><path fill="#929292" opacity="1.000000" stroke="none" d="M131.277390,209.284836 C145.382248,193.541687 159.273804,178.083084 173.041565,162.514999 C173.885727,161.560440 173.751266,159.740402 174.072128,158.323059 C172.659119,158.777328 170.772842,158.799789 169.904724,159.751236 C158.474518,172.278534 147.188217,184.937119 135.865021,197.562042 C127.427925,206.969009 119.116516,216.494797 110.441322,225.676849 C108.769653,227.446152 105.714729,228.616791 103.220589,228.765396 C96.283401,229.178680 89.305519,228.908875 80.912224,228.908875 C82.311363,226.136642 82.865829,224.094040 84.126884,222.682877 C99.750122,205.199615 115.504196,187.833405 131.169678,170.387756 C157.165207,141.438217 183.115417,112.448006 209.096115,83.485138 C218.423538,73.087082 227.826904,62.756741 237.098450,52.309269 C239.368744,49.751022 241.851700,48.734985 245.338074,48.743393 C291.496918,48.854755 337.656128,48.808525 383.815247,48.823116 C398.120331,48.827637 409.865448,60.545166 409.903717,74.836510 C409.974243,101.163277 409.913330,127.491058 410.160828,153.816040 C410.204865,158.499420 407.478363,157.905716 404.660004,157.906006 C364.666534,157.910110 324.673065,157.887009 284.679688,157.947327 C281.209778,157.952560 277.644775,158.084534 274.286530,158.860916 C249.902954,164.498230 234.845825,182.150040 232.127258,207.686691 C231.495117,213.624786 230.063904,219.474426 229.299606,225.403336 C228.932556,228.250793 227.547562,228.937012 224.991043,228.934082 C190.163452,228.893982 155.335785,228.918655 120.508255,228.858093 C119.320549,228.856033 118.134102,228.129578 116.947075,227.740768 C117.360329,226.541321 117.473770,225.088989 118.236694,224.184464 C122.415199,219.230331 126.753059,214.410599 131.277390,209.284836 M207.445755,117.830505 C199.393387,126.868256 191.287323,135.859497 183.363800,145.008804 C182.478409,146.031158 182.629395,147.951035 182.299759,149.454681 C183.834686,148.821701 185.817337,148.599289 186.833725,147.490845 C195.013443,138.570236 203.094238,129.554184 210.985046,120.377945 C212.349319,118.791435 212.672485,116.309677 213.476547,114.241432 C211.637009,115.264854 209.797455,116.288277 207.445755,117.830505 M400.074921,79.465195 C397.220551,69.255119 390.731140,62.792507 380.234802,60.881767 C378.610352,60.586063 376.666412,62.045494 374.870209,62.693268 C376.245972,63.569183 377.525696,64.946831 379.014557,65.231857 C384.667786,66.314095 389.620209,68.589188 392.497803,73.674690 C394.157745,76.608315 394.651794,80.180511 395.962402,83.344444 C396.421478,84.452660 397.752594,85.199646 398.685547,86.111603 C399.395172,85.120277 400.368317,84.214722 400.727997,83.109497 C400.998627,82.278091 400.482330,81.190536 400.074921,79.465195 z"/><path fill="#919191" opacity="1.000000" stroke="none" d="M127.000000,48.818718 C161.949173,48.818588 196.398331,48.818588 232.287598,48.818588 C230.821793,51.377522 230.180832,53.130695 229.024384,54.422329 C202.524887,84.019043 175.956909,113.554405 149.428375,143.125153 C132.446335,162.054642 115.495522,181.012146 98.554214,199.978088 C91.469696,207.909271 84.383598,215.840759 77.424164,223.881104 C74.423096,227.348282 71.181465,229.232834 66.272987,229.028488 C56.461674,228.620041 46.619602,228.799545 36.794067,228.964722 C33.299263,229.023483 31.738855,228.192093 31.747461,224.270996 C31.857141,174.296768 31.736809,124.321999 31.874540,74.347908 C31.912922,60.421085 44.078129,48.839226 58.035278,48.825165 C80.856834,48.802174 103.678421,48.818890 127.000000,48.818718 z"/><path fill="#818181" opacity="1.000000" stroke="none" d="M89.000015,233.795563 C133.469818,233.795563 177.439606,233.793045 221.409409,233.798889 C227.331329,233.799667 227.786545,234.363510 226.796509,240.029495 C225.280792,248.704102 223.636032,257.360748 222.368805,266.071960 C221.861404,269.559814 220.478714,270.940094 216.920883,270.935608 C163.957352,270.868866 110.993256,271.010101 58.030388,270.810669 C43.228886,270.754913 31.833069,258.582733 31.824825,243.655487 C31.818512,232.225204 30.389938,233.872345 41.532089,233.815826 C57.187695,233.736404 72.844002,233.795685 89.000015,233.795563 z"/><path fill="#010101" opacity="1.000000" stroke="none" d="M457.113281,361.254242 C445.594574,361.072083 438.197937,354.954529 433.354797,345.807007 C425.878540,331.686127 418.908691,317.293518 411.947113,302.908234 C411.032074,301.017487 410.698639,298.248566 411.342255,296.297516 C415.399658,283.997955 411.722382,274.895416 399.847076,270.742462 C393.540558,268.536957 391.972534,263.194122 390.543579,258.220215 C389.404755,254.256134 392.980865,255.766418 395.053925,256.382690 C401.062988,258.168976 406.957581,260.848541 413.091888,261.611359 C432.369690,264.008698 452.982422,252.484085 461.808472,235.179626 C463.084625,232.677628 464.534058,230.263992 465.903320,227.809479 C466.494049,227.914093 467.084808,228.018707 467.675568,228.123306 C468.521484,231.889175 469.497772,235.631165 470.192566,239.424713 C475.425446,267.995117 480.629211,296.570923 485.787384,325.154907 C488.640076,340.962830 482.912506,353.435028 469.675476,359.114594 C466.011017,360.686859 461.629181,360.586945 457.113281,361.254242 z"/><path fill="#020202" opacity="1.000000" stroke="none" d="M276.105408,329.054688 C271.176575,337.109283 267.299896,345.613190 261.399750,352.343109 C253.570206,361.273773 242.509399,361.425293 232.368576,357.016327 C222.686096,352.806641 216.143982,344.784882 216.910553,333.528229 C217.663010,322.479065 219.561066,311.488922 221.320724,300.531433 C224.660294,279.735870 228.214951,258.974274 231.807785,238.220642 C232.268112,235.561691 233.489578,233.034515 234.358414,230.446304 C234.868362,230.528381 235.378311,230.610474 235.888260,230.692566 C238.556244,234.631851 241.055206,238.698944 243.920807,242.488831 C258.011749,261.124847 283.793579,267.223297 304.742218,256.985718 C305.638947,256.547485 306.507568,255.878006 307.448761,255.748413 C308.632355,255.585464 310.081421,255.534821 311.008179,256.101959 C311.459717,256.378265 311.401917,258.461670 310.862732,259.222626 C307.581970,263.852844 306.301849,269.494385 299.372864,271.853088 C289.533478,275.202454 286.190979,285.817810 289.699524,295.384979 C290.443817,297.414459 290.248199,300.350189 289.328857,302.331665 C285.199524,311.231689 280.652954,319.938110 276.105408,329.054688 z"/><path fill="#020202" opacity="1.000000" stroke="none" d="M273.059998,163.746338 C295.135437,159.444839 315.360748,168.653915 325.168854,188.433670 C333.414886,205.063278 331.815521,228.425293 316.033173,243.622513 C301.432709,257.681610 280.614197,261.449249 262.781555,252.541550 C245.174835,243.746719 234.691055,223.862640 237.403717,204.222076 C240.323334,183.083130 252.271896,169.746078 273.059998,163.746338 M285.797485,225.242218 C285.797485,220.462296 285.797485,215.682373 285.797485,210.209427 C291.225342,210.209427 296.170898,210.398361 301.088989,210.113342 C302.967773,210.004440 304.783722,208.810394 306.628296,208.110886 C304.835266,207.141449 303.114441,205.552368 301.233948,205.333130 C297.462189,204.893448 293.596710,205.064789 289.782257,205.245285 C286.705078,205.390900 285.643738,204.145142 285.754700,201.148605 C285.920624,196.666916 285.932495,192.167618 285.705566,187.691223 C285.644714,186.491043 284.479980,185.346832 283.822052,184.176926 C282.873962,185.282104 281.568726,186.250046 281.076630,187.530487 C280.569092,188.851196 280.807678,190.475800 280.799133,191.967896 C280.774689,196.231323 280.790527,200.494980 280.790527,205.202728 C275.101776,205.202728 270.133545,204.999695 265.198639,205.316223 C263.539856,205.422607 261.965851,206.850494 260.353088,207.674393 C261.891724,208.519272 263.409332,209.406921 264.983459,210.179443 C265.385406,210.376678 265.966278,210.206696 266.464905,210.209808 C280.698029,210.298645 280.631409,210.299805 280.855774,224.545197 C280.893463,226.938004 281.790131,229.317276 282.289886,231.702789 C283.027466,231.711472 283.765045,231.720154 284.502625,231.728836 C284.934235,229.877762 285.365845,228.026688 285.797485,225.242218 z"/><path fill="#020202" opacity="1.000000" stroke="none" d="M328.919128,186.184662 C322.726837,178.441910 316.671448,171.045349 310.278839,163.236908 C337.123718,163.236908 363.743408,163.236908 391.754639,163.236908 C390.018402,165.264893 389.165192,166.725784 387.915649,167.652008 C365.585754,184.204147 359.950623,212.901367 373.962006,236.883240 C379.575562,246.491425 384.224182,256.660339 389.432617,266.510254 C390.805756,269.107056 390.211243,270.446198 387.562317,271.423676 C386.186798,271.931244 384.550842,272.623535 383.786285,273.745850 C380.003601,279.298706 374.488800,278.965912 368.773193,278.894104 C354.944489,278.720337 341.111969,278.795868 327.281494,278.871033 C324.331268,278.887085 321.663879,278.861267 320.023254,275.772156 C319.523376,274.830994 318.326447,274.222473 317.378265,273.562958 C310.764618,268.963013 310.780060,268.982361 314.290253,262.013977 C319.307892,252.052902 324.290070,242.073944 329.288177,232.103012 C336.189636,218.335037 336.563995,204.384521 330.479187,190.244415 C329.955627,189.027725 329.528168,187.769684 328.919128,186.184662 M368.871582,252.180420 C365.133911,251.890076 361.397583,251.460159 357.657501,251.424942 C356.892151,251.417740 355.613281,252.826172 355.501007,253.701324 C355.414124,254.378738 356.731171,255.856171 357.506836,255.916656 C360.801636,256.173584 364.145782,256.221039 367.427185,255.894913 C368.145538,255.823517 368.680359,253.905533 368.871582,252.180420 M338.795532,256.227356 C341.603119,255.939194 344.410706,255.651031 347.624725,255.321152 C344.916290,249.951324 336.285645,249.783096 332.397827,254.713089 C334.479126,255.277740 336.228638,255.752380 338.795532,256.227356 z"/><path fill="#030303" opacity="1.000000" stroke="none" d="M432.593323,254.852127 C415.979156,259.527893 401.084137,257.577301 387.780853,246.402924 C372.783081,233.805252 366.830109,212.006256 373.685394,193.429367 C380.368317,175.319687 397.092377,163.409958 415.148895,162.624817 C436.850159,161.681213 454.221588,174.843063 460.742432,192.629333 C470.533966,219.336868 457.361481,245.513382 432.593323,254.852127 M443.022095,200.444519 C443.506744,199.572769 444.116730,198.746872 444.455231,197.821671 C446.350800,192.640579 444.832825,187.286713 440.755646,184.531769 C435.778198,181.168518 430.881195,181.418243 426.615387,185.252899 C422.632263,188.833435 421.939514,194.098495 424.764282,199.321777 C428.356201,205.963608 435.172119,206.605988 443.022095,200.444519 M422.822540,223.503021 C423.283173,225.089371 423.530060,226.779770 424.242523,228.243546 C426.926636,233.758087 432.876801,236.165771 437.953064,233.943329 C444.133057,231.237640 446.821625,225.312851 444.506897,219.308029 C442.698578,214.616806 439.044220,212.128159 434.183197,211.938889 C428.776550,211.728378 424.775238,215.813095 422.822540,223.503021 M402.947998,182.266739 C401.951569,182.227829 400.936584,182.046494 399.961823,182.173615 C394.459259,182.891190 389.568695,187.931564 389.262299,193.111557 C388.984802,197.802719 393.240692,203.322449 398.065887,204.529556 C403.332214,205.847015 408.698303,203.033752 411.037048,197.729172 C413.553894,192.020645 410.691498,186.059631 402.947998,182.266739 M406.362091,233.065796 C407.225952,232.304672 408.195557,231.633911 408.936188,230.767426 C413.050659,225.953735 412.764191,219.432709 408.309448,215.111343 C404.354858,211.275146 398.052765,210.953262 393.779419,214.369232 C388.986633,218.200424 388.082703,224.787491 391.645844,229.916977 C394.635803,234.221268 399.522156,235.455002 406.362091,233.065796 z"/><path fill="#808080" opacity="1.000000" stroke="none" d="M171.033051,277.317322 C172.742935,276.510712 174.294617,275.854645 175.850357,275.844910 C189.007965,275.762329 202.167633,275.901062 215.323669,275.735168 C219.299866,275.685059 220.741272,276.791321 219.933731,280.955597 C218.165405,290.074402 216.597702,299.238708 215.245117,308.428131 C214.742050,311.845886 213.561539,313.333771 209.885406,313.272369 C198.396057,313.080353 186.900192,313.105652 175.409744,313.261047 C172.015305,313.306976 170.657608,312.335541 170.732162,308.743652 C170.946381,298.421722 170.850662,288.093323 171.033051,277.317322 z"/><path fill="#838383" opacity="1.000000" stroke="none" d="M129.820679,329.089539 C134.300705,321.637054 140.505981,318.028564 148.942352,318.069153 C168.426514,318.162842 187.911438,318.088440 207.396027,318.105530 C212.949905,318.110413 213.390472,318.686066 212.492477,324.236755 C212.280075,325.549622 212.071655,326.868744 211.972061,328.193298 C211.317337,336.900391 211.327225,336.901154 202.321289,336.901154 C179.672516,336.901184 157.023743,336.902191 134.374969,336.900604 C126.679108,336.900055 126.326576,336.338043 129.820679,329.089539 z"/><path fill="#040404" opacity="1.000000" stroke="none" d="M408.262268,290.703064 C406.722107,298.048004 402.371704,302.083649 396.274017,302.262817 C389.206726,302.470490 383.430481,298.942383 381.738708,293.384796 C379.676056,286.608673 381.952576,278.532684 388.069580,276.287292 C392.133240,274.795624 397.681488,274.967468 401.771667,276.505310 C407.440979,278.636871 408.940277,284.307251 408.262268,290.703064 z"/><path fill="#040404" opacity="1.000000" stroke="none" d="M311.224976,275.009125 C322.336029,280.736511 323.749329,292.191040 314.650970,299.866364 C310.627014,303.260925 305.795197,303.047424 301.435944,301.520813 C296.902161,299.933105 293.854767,296.266632 293.170776,291.161774 C292.023621,282.599945 296.645325,272.553101 311.224976,275.009125 z"/><path fill="#838383" opacity="1.000000" stroke="none" d="M310.735596,334.994354 C309.511078,335.890961 308.378204,336.812958 307.232025,336.829773 C298.763672,336.954285 290.292603,336.870819 281.822632,336.912231 C278.206299,336.929901 277.308044,335.593597 279.104431,332.339905 C280.948395,329.000092 282.848999,325.646271 284.223206,322.103943 C285.938141,317.683319 288.606140,316.388031 293.124329,317.767212 C301.892090,320.443512 308.655731,325.061096 310.735596,334.994354 z"/><path fill="#F8F8F8" opacity="1.000000" stroke="none" d="M207.701843,117.571106 C209.797455,116.288277 211.637009,115.264854 213.476547,114.241432 C212.672485,116.309677 212.349319,118.791435 210.985046,120.377945 C203.094238,129.554184 195.013443,138.570236 186.833725,147.490845 C185.817337,148.599289 183.834686,148.821701 182.299759,149.454681 C182.629395,147.951035 182.478409,146.031158 183.363800,145.008804 C191.287323,135.859497 199.393387,126.868256 207.701843,117.571106 z"/><path fill="#F8F8F8" opacity="1.000000" stroke="none" d="M400.195618,79.841095 C400.482330,81.190536 400.998627,82.278091 400.727997,83.109497 C400.368317,84.214722 399.395172,85.120277 398.685547,86.111603 C397.752594,85.199646 396.421478,84.452660 395.962402,83.344444 C394.651794,80.180511 394.157745,76.608315 392.497803,73.674690 C389.620209,68.589188 384.667786,66.314095 379.014557,65.231857 C377.525696,64.946831 376.245972,63.569183 374.870209,62.693264 C376.666412,62.045494 378.610352,60.586063 380.234802,60.881767 C390.731140,62.792507 397.220551,69.255119 400.195618,79.841095 z"/><path fill="#EBEBEB" opacity="1.000000" stroke="none" d="M285.797485,225.708908 C285.365845,228.026688 284.934235,229.877762 284.502625,231.728836 C283.765045,231.720154 283.027466,231.711472 282.289886,231.702789 C281.790131,229.317276 280.893463,226.938004 280.855774,224.545197 C280.631409,210.299805 280.698029,210.298645 266.464905,210.209808 C265.966278,210.206696 265.385406,210.376678 264.983459,210.179443 C263.409332,209.406921 261.891724,208.519272 260.353088,207.674393 C261.965851,206.850494 263.539856,205.422607 265.198639,205.316223 C270.133545,204.999695 275.101776,205.202728 280.790527,205.202728 C280.790527,200.494980 280.774689,196.231323 280.799133,191.967896 C280.807678,190.475800 280.569092,188.851196 281.076630,187.530487 C281.568726,186.250046 282.873962,185.282104 283.822052,184.176910 C284.479980,185.346832 285.644714,186.491043 285.705566,187.691223 C285.932495,192.167618 285.920624,196.666916 285.754700,201.148605 C285.643738,204.145142 286.705078,205.390900 289.782257,205.245285 C293.596710,205.064789 297.462189,204.893448 301.233948,205.333130 C303.114441,205.552368 304.835266,207.141449 306.628296,208.110886 C304.783722,208.810394 302.967773,210.004440 301.088989,210.113342 C296.170898,210.398361 291.225342,210.209427 285.797485,210.209427 C285.797485,215.682373 285.797485,220.462296 285.797485,225.708908 z"/><path fill="#E5E5E5" opacity="1.000000" stroke="none" d="M369.085632,252.509186 C368.680359,253.905533 368.145538,255.823517 367.427185,255.894913 C364.145782,256.221039 360.801636,256.173584 357.506836,255.916656 C356.731171,255.856171 355.414124,254.378738 355.501007,253.701324 C355.613281,252.826172 356.892151,251.417740 357.657501,251.424942 C361.397583,251.460159 365.133911,251.890076 369.085632,252.509186 z"/><path fill="#E5E5E5" opacity="1.000000" stroke="none" d="M338.386841,256.227173 C336.228638,255.752380 334.479126,255.277740 332.397827,254.713089 C336.285645,249.783096 344.916290,249.951324 347.624725,255.321152 C344.410706,255.651031 341.603119,255.939194 338.386841,256.227173 z"/><path fill="#E9EAED" opacity="1.000000" stroke="none" d="M442.773254,200.720062 C435.172119,206.605988 428.356201,205.963608 424.764282,199.321777 C421.939514,194.098495 422.632263,188.833435 426.615387,185.252899 C430.881195,181.418243 435.778198,181.168518 440.755646,184.531769 C444.832825,187.286713 446.350800,192.640579 444.455231,197.821671 C444.116730,198.746872 443.506744,199.572769 442.773254,200.720062 M432.059814,187.200073 C428.535950,188.815353 426.822479,191.761444 428.102234,195.256943 C428.823486,197.226959 431.129425,199.268051 433.167938,199.957962 C436.559845,201.105896 439.714233,198.331116 440.167664,194.862991 C440.822662,189.852936 438.217163,186.130386 432.059814,187.200073 z"/><path fill="#EFEAEA" opacity="1.000000" stroke="none" d="M422.879272,223.101929 C424.775238,215.813095 428.776550,211.728378 434.183197,211.938889 C439.044220,212.128159 442.698578,214.616806 444.506897,219.308029 C446.821625,225.312851 444.133057,231.237640 437.953064,233.943329 C432.876801,236.165771 426.926636,233.758087 424.242523,228.243546 C423.530060,226.779770 423.283173,225.089371 422.879272,223.101929 M431.996368,217.002594 C427.647095,219.741989 426.388367,223.844940 428.825134,227.227341 C431.056396,230.324539 434.684235,231.006699 437.070953,229.092819 C439.006287,227.540894 440.125763,223.747620 439.936584,221.066315 C439.673889,217.343185 436.308105,216.416122 431.996368,217.002594 z"/><path fill="#ECEEED" opacity="1.000000" stroke="none" d="M403.325378,182.360977 C410.691498,186.059631 413.553894,192.020645 411.037048,197.729172 C408.698303,203.033752 403.332214,205.847015 398.065887,204.529556 C393.240692,203.322449 388.984802,197.802719 389.262299,193.111557 C389.568695,187.931564 394.459259,182.891190 399.961823,182.173615 C400.936584,182.046494 401.951569,182.227829 403.325378,182.360977 M398.234894,187.297989 C397.322693,188.005539 395.711884,188.637207 395.625275,189.434464 C395.329193,192.159698 394.745453,195.325836 395.807190,197.609924 C397.214539,200.637512 400.659088,201.018417 403.637299,199.445694 C406.816833,197.766693 407.986938,194.784897 406.844299,191.394577 C405.619904,187.761627 402.822388,186.296478 398.234894,187.297989 z"/><path fill="#EFEEEB" opacity="1.000000" stroke="none" d="M406.043518,233.268738 C399.522156,235.455002 394.635803,234.221268 391.645844,229.916977 C388.082703,224.787491 388.986633,218.200424 393.779419,214.369232 C398.052765,210.953262 404.354858,211.275146 408.309448,215.111343 C412.764191,219.432709 413.050659,225.953735 408.936188,230.767426 C408.195557,231.633911 407.225952,232.304672 406.043518,233.268738 M407.133301,222.629700 C405.205658,220.700348 403.567535,217.939163 401.249237,217.132278 C399.687805,216.588837 396.177460,218.291275 395.328186,219.921234 C394.312897,221.869812 394.377228,225.330185 395.524689,227.166946 C396.507080,228.739487 400.208893,230.150497 401.754150,229.469284 C404.003418,228.477722 405.396484,225.543930 407.133301,222.629700 z"/><path fill="#4A5CB6" opacity="1.000000" stroke="none" d="M432.454529,187.102081 C438.217163,186.130386 440.822662,189.852936 440.167664,194.862991 C439.714233,198.331116 436.559845,201.105896 433.167938,199.957962 C431.129425,199.268051 428.823486,197.226959 428.102234,195.256943 C426.822479,191.761444 428.535950,188.815353 432.454529,187.102081 z"/><path fill="#C02D23" opacity="1.000000" stroke="none" d="M432.404236,216.918945 C436.308105,216.416122 439.673889,217.343185 439.936584,221.066315 C440.125763,223.747620 439.006287,227.540894 437.070953,229.092819 C434.684235,231.006699 431.056396,230.324539 428.825134,227.227341 C426.388367,223.844940 427.647095,219.741989 432.404236,216.918945 z"/><path fill="#31976F" opacity="1.000000" stroke="none" d="M398.611389,187.155655 C402.822388,186.296478 405.619904,187.761627 406.844299,191.394577 C407.986938,194.784897 406.816833,197.766693 403.637299,199.445694 C400.659088,201.018417 397.214539,200.637512 395.807190,197.609924 C394.745453,195.325836 395.329193,192.159698 395.625275,189.434464 C395.711884,188.637207 397.322693,188.005539 398.611389,187.155655 z"/><path fill="#EFBF30" opacity="1.000000" stroke="none" d="M407.143982,223.033966 C405.396484,225.543930 404.003418,228.477722 401.754150,229.469284 C400.208893,230.150497 396.507080,228.739487 395.524689,227.166946 C394.377228,225.330185 394.312897,221.869812 395.328186,219.921234 C396.177460,218.291275 399.687805,216.588837 401.249237,217.132278 C403.567535,217.939163 405.205658,220.700348 407.143982,223.033966 z"/></svg>`,
    },
    default: {
        name: "NON-STEAM",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" > <circle cx="64" cy="64" r="26" fill="none" stroke="white" stroke-width="8" /> <circle cx="64" cy="64" r="10" fill="white" /> <path d="M80 64 L88 64" stroke="white" stroke-width="6" stroke-linecap="round" /> <rect x="88" y="54" width="22" height="20" rx="4" fill="white" /> <line x1="110" y1="58" x2="118" y2="58" stroke="white" stroke-width="3" /> <line x1="110" y1="70" x2="118" y2="70" stroke="white" stroke-width="3" /></svg>`,
    },
};
/**
 * Get the badge styles for each context.
 */
function getBadgeStyle(gameStore, prop) {
    return BADGE_STYLES?.[gameStore]?.[prop] || BADGE_STYLES?.default?.[prop];
}
function getBadgeIcon(gameStore, context) {
    return getBadgeStyle(gameStore, GameStoreProp.ICON);
}

function getEffectiveCapsuleContext(context, imageMetrics) {
    if (context === GameStoreContext.LIBRARY &&
        imageMetrics &&
        imageMetrics.width > imageMetrics.height) {
        return GameStoreContext.SEARCH;
    }
    return context;
}
function getCapsuleBadgeClassKeys(context, settings) {
    if (context === GameStoreContext.SEARCH) {
        return ["searchBadge", `search-${BadgePosition.TOP_RIGHT}`];
    }
    if (context === GameStoreContext.HOME) {
        return ["homeBadge", settings.homePosition];
    }
    return ["libraryBadge", settings.libraryPosition];
}
function getDetailsBadgePositionClassKey(detailsPosition, showSteamStoreButton) {
    if (detailsPosition === BadgePosition.NONE && showSteamStoreButton) {
        return `details-${BadgePosition.TOP_LEFT}`;
    }
    return `details-${detailsPosition}`;
}

const BADGE_CLASSNAME = "nonsteam-badge";
const POSITION_PREPARED_ATTR = "data-nonsteam-badge-positioned";
// Track which elements already have badges
let badgedElements = new WeakSet();
let capsuleRenderCache = new WeakMap();
/**
 * Remove existing badges from DOM
 */
function cleanupBadges(bigPicWindow) {
    badgedElements = new WeakSet();
    capsuleRenderCache = new WeakMap();
    const badges = bigPicWindow.document.querySelectorAll(`.${BADGE_CLASSNAME}`);
    badges.forEach((badge) => badge.remove());
    const defaultBadges = bigPicWindow.document.querySelectorAll('.badge[style*="display: none"]');
    defaultBadges.forEach((badge) => {
        if (badge instanceof HTMLElement) {
            badge.style.display = "";
        }
    });
}
function extractAppIdFromImage(img) {
    if (!img || !img.src)
        return null;
    // Try Steam CDN pattern: /assets/APPID/
    let match = img.src.match(/\/assets\/(\d+)\//);
    if (match)
        return match[1];
    // Try custom images: /customimages/APPIDp.ext
    match = img.src.match(/\/customimages\/(\d+)p?\.(jpg|jpeg|png|webp)/i);
    if (match)
        return match[1];
    // Try rungameid
    match = img.src.match(/rungameid\/(\d+)/i);
    if (match)
        return match[1];
    // Try any numeric ID before extension or standalone
    match = img.src.match(/\/(\d{6,})([p\._-]?[a-z]*\.(jpg|png|webp))?/i);
    if (match)
        return match[1];
    return null;
}
function getAppId(capsule) {
    // lookup on Home Screen virtualized lists
    const dataId = capsule.getAttribute("data-id");
    if (dataId && !dataId.startsWith("placeholder")) {
        return dataId;
    }
    const img = capsule.querySelector("img");
    const imageAppId = extractAppIdFromImage(img);
    if (imageAppId)
        return imageAppId;
    // Look for any anchor tag with a game URL (e.g. steam://nav/games/details/APPID)
    try {
        const anchor = capsule.tagName.toLowerCase() === "a"
            ? capsule
            : capsule.querySelector("a");
        if (anchor) {
            const href = anchor.getAttribute("href");
            if (href) {
                const match = href.match(/\/app\/(\d+)/i) ||
                    href.match(/\/details\/(\d+)/i) ||
                    href.match(/run\/(\d+)/i);
                if (match)
                    return match[1];
            }
        }
    }
    catch (e) { }
    // React Fiber is the most expensive lookup, so keep it as the last fallback.
    try {
        const elementsToCheck = [capsule, ...Array.from(capsule.children)];
        for (const el of elementsToCheck) {
            const key = Object.keys(el).find((k) => k.startsWith("__reactFiber$") ||
                k.startsWith("__reactInternalInstance$"));
            if (!key)
                continue;
            let fiber = el[key];
            let depth = 0;
            while (fiber && depth < 5) {
                const props = fiber.memoizedProps || fiber.return?.memoizedProps;
                if (props) {
                    const id = props.appid ||
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
                    if (id)
                        return String(id);
                }
                fiber = fiber.return;
                depth++;
            }
        }
    }
    catch (e) { }
    return null;
}
function addBadgeToCapsule(capsule, bigPicWindow, context = GameStoreContext.LIBRARY) {
    const settings = getSettings();
    let existingBadge = capsule.querySelector(`.${BADGE_CLASSNAME}`);
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
    if ((context === GameStoreContext.LIBRARY &&
        settings.libraryPosition === "none") ||
        (context === GameStoreContext.HOME && settings.homePosition === "none")) {
        return;
    }
    // Clean up any improperly attached or orphaned badges before proceeding
    let appid = existingBadge?.getAttribute("data-appid") || getAppId(capsule);
    // If we can't find a Steam ID through any method (no artwork URL, no visible anchor tag, no fiber prop),
    // Native Steam games NEVER have a missing ID. So it is inherently a generic/blank non-Steam app.
    if (!appid) {
        appid = "unknown_generic_app";
    }
    else if (!isNonSteamApp(appid)) {
        if (existingBadge) {
            existingBadge.remove();
        }
        return;
    }
    const img = capsule.querySelector("img");
    let targetElement = null;
    const role = capsule.getAttribute("role");
    if (role === "gridcell") {
        if (img) {
            targetElement =
                capsule.querySelector("div") ||
                    capsule;
        }
        else {
            // If there is no image, Steam uses heavily clipped CSS inner blocks for the text box.
            // We must attach directly to the gridcell itself for the badge to be visible.
            targetElement = capsule;
        }
    }
    else if (role === "listitem") {
        if (img) {
            targetElement =
                img.closest('div[class*="_1pwP4"]') ||
                    img.closest("div") ||
                    capsule;
        }
        else {
            targetElement = capsule;
        }
    }
    if (!targetElement)
        return;
    // Navigation Persistence Fix: If the badge exists but isn't a direct child of the exact current targetElement
    // (caused by React throwing away and regenerating the DOM on back-navigation), destroy the ghost badge.
    if (existingBadge) {
        if (existingBadge.parentElement !== targetElement ||
            existingBadge.getAttribute("data-appid") !== String(appid)) {
            existingBadge.remove();
            existingBadge = null;
        }
        else {
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
    // Determine the capsules context
    let effectiveContext = context;
    const cachedContext = existingBadge?.getAttribute("data-context");
    if (cachedContext) {
        effectiveContext = cachedContext;
    }
    else if (effectiveContext === GameStoreContext.LIBRARY && img) {
        const rect = img.getBoundingClientRect();
        effectiveContext = getEffectiveCapsuleContext(effectiveContext, rect);
    }
    const positionStyles = getCapsuleBadgeClassKeys(effectiveContext, settings)
        .map((classKey) => styles$1[classKey])
        .filter(Boolean);
    const storeSignature = gameStoreName ?? GameStoreName.DEFAULT;
    const renderSignature = [
        String(appid),
        effectiveContext,
        storeSignature,
        ...positionStyles,
    ].join("|");
    const cachedRenderState = capsuleRenderCache.get(capsule);
    if (existingBadge &&
        cachedRenderState &&
        cachedRenderState.appid === String(appid) &&
        cachedRenderState.renderSignature === renderSignature &&
        cachedRenderState.collectionVersion === collectionVersion) {
        badgedElements.add(capsule);
        return;
    }
    const badge = existingBadge ?? bigPicWindow.document.createElement("div");
    badge.setAttribute("data-appid", String(appid));
    badge.className = BADGE_CLASSNAME;
    badge.classList.add(styles$1.badge, ...positionStyles);
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
        // Inject the badge icon in the DOM
        if (badge.getAttribute("data-store") !== gameStoreName ||
            !existingBadge) {
            badge.innerHTML = getBadgeIcon(gameStoreName);
            badge.setAttribute("data-store", gameStoreName);
        }
        badge.classList.remove(styles$1[PULSATING_CLASSNAME]);
        capsuleRenderCache.set(capsule, {
            appid: String(appid),
            renderSignature,
            collectionVersion,
        });
    }
    else {
        // If we don't have a cached store name, show placeholder and pulse while fetching
        if (badge.getAttribute("data-store") !== GameStoreName.DEFAULT ||
            !existingBadge) {
            badge.innerHTML = getBadgeIcon(GameStoreName.DEFAULT);
            badge.setAttribute("data-store", GameStoreName.DEFAULT);
        }
        badge.classList.add(styles$1[PULSATING_CLASSNAME]);
        // Fetch mapping if not available and not already loaded
        (async () => {
            await ensureMappingsLoaded();
            if (!badge.isConnected ||
                badge.getAttribute("data-appid") !== String(appid)) {
                return;
            }
            // Re-run scan to apply badges once loaded if we found a new mapping
            const newStore = getStore(appid);
            if (newStore) {
                badge.classList.remove(styles$1[PULSATING_CLASSNAME]);
                const newName = sanitizedGameStoreName(newStore);
                if (newName) {
                    badge.innerHTML = getBadgeIcon(newName);
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
            }
            else {
                badge.classList.remove(styles$1[PULSATING_CLASSNAME]);
            }
        })();
    }
}

let observer = null;
let scanInterval = null;
let retryTimeout = null;
let visibilityTimeout = null;
let debounceTimeout = null;
let visibilityDocument = null;
let visibilityChangeHandler = null;
const debouncedScan = () => {
    if (debounceTimeout)
        return;
    debounceTimeout = requestAnimationFrame(() => {
        scanAndBadge();
        debounceTimeout = null;
    });
};
let cachedWindow = null;
/**
 * Get the Big Picture window from Decky's navigation trees
 */
function getBigPictureWindow() {
    // Return cached window if it's still valid
    if (cachedWindow && !cachedWindow.closed) {
        return cachedWindow;
    }
    try {
        const DFL = window.DFL;
        if (!DFL?.getGamepadNavigationTrees)
            return null;
        const navTrees = DFL.getGamepadNavigationTrees();
        for (const tree of navTrees) {
            try {
                const gridCount = tree.m_window.document.querySelectorAll('div[role="gridcell"]').length;
                const listCount = tree.m_window.document.querySelectorAll('div[role="listitem"]').length;
                if (gridCount > 0 || listCount > 0) {
                    cachedWindow = tree.m_window;
                    return cachedWindow;
                }
            }
            catch {
                continue;
            }
        }
    }
    catch (error) {
    }
    return null;
}
function startObserving() {
    // Ensure we don't leak observers
    stopObserving();
    const bigPicWindow = getBigPictureWindow();
    if (!bigPicWindow) {
        retryTimeout = window.setTimeout(() => {
            retryTimeout = null;
            startObserving();
        }, 1000);
        return;
    }
    // Initial scan
    scanAndBadge();
    // Set up MutationObserver for instant badge injection
    observer = new MutationObserver((mutations) => {
        // Only scan if elements were added
        const hasAddedNodes = mutations.some((m) => m.addedNodes.length > 0);
        if (hasAddedNodes) {
            debouncedScan();
        }
    });
    const containers = bigPicWindow.document.querySelectorAll('div[role="tabpanel"], div[class*="Panel"]');
    containers.forEach((container) => {
        if (observer) {
            observer.observe(container, {
                childList: true,
                subtree: true,
            });
        }
    });
    // Backup: scan every 2 seconds to catch anything missed
    scanInterval = setInterval(scanAndBadge, 2000);
    // Visibility change listener
    visibilityDocument = bigPicWindow.document;
    visibilityChangeHandler = () => {
        if (!bigPicWindow.document.hidden) {
            if (visibilityTimeout) {
                clearTimeout(visibilityTimeout);
            }
            visibilityTimeout = window.setTimeout(() => {
                visibilityTimeout = null;
                scanAndBadge();
            }, 100);
        }
    };
    visibilityDocument.addEventListener("visibilitychange", visibilityChangeHandler);
}
function stopObserving() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }
    if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
    }
    if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
    }
    if (visibilityTimeout) {
        clearTimeout(visibilityTimeout);
        visibilityTimeout = null;
    }
    if (debounceTimeout) {
        cancelAnimationFrame(debounceTimeout);
        debounceTimeout = null;
    }
    if (visibilityDocument && visibilityChangeHandler) {
        visibilityDocument.removeEventListener("visibilitychange", visibilityChangeHandler);
    }
    visibilityDocument = null;
    visibilityChangeHandler = null;
}
function scanAndBadge() {
    const bigPicWindow = getBigPictureWindow();
    if (!bigPicWindow)
        return;
    const contexts = [
        {
            selector: 'div[role="tabpanel"] div[role="gridcell"]',
            context: GameStoreContext.LIBRARY,
        },
        {
            selector: '.ReactVirtualized__Grid__innerScrollContainer div[role="listitem"]',
            context: GameStoreContext.HOME,
        },
    ];
    // Scan both grid (library) and list items (home carousel)
    const selectors = contexts.map((c) => c.selector);
    // Ensure styles are available in this window
    injectStyleIntoWindow(bigPicWindow);
    for (const selector of selectors) {
        const capsules = bigPicWindow.document.querySelectorAll(selector);
        const context = contexts.find((c) => c.selector === selector)?.context;
        capsules.forEach((capsule) => {
            // True game capsules contain a clickable wrapper with role="link".
            if (capsule.querySelector('div[role="link"]')) {
                // Collection grids place role="link" uniquely as the direct
                // child of the gridcell. Real game capsules nest it under a .Panel DOM layer first.
                const isCollectionTile = capsule.firstElementChild?.getAttribute("role") === "link";
                if (!isCollectionTile) {
                    addBadgeToCapsule(capsule, bigPicWindow, context);
                }
            }
        });
    }
}

const context$1 = "useSettings";
function useSettings() {
    const [settings, setSettings] = SP_REACT.useState(getSettings());
    SP_REACT.useEffect(() => {
        const handleChange = (event) => {
            if (event instanceof CustomEvent && event.detail) {
                log(context$1, "Settings changed (custom event): " + JSON.stringify(event.detail));
                setSettings(event.detail);
            }
            else {
                log(context$1, "Settings changed (fallback): " + JSON.stringify(getSettings()));
                setSettings(getSettings());
            }
        };
        window.addEventListener(SETTINGS_CHANGED_EVENT, handleChange);
        return () => window.removeEventListener(SETTINGS_CHANGED_EVENT, handleChange);
    }, []);
    return settings;
}

const badgePositions = [
    { label: "None", data: BadgePosition.NONE },
    { label: "Top Left", data: BadgePosition.TOP_LEFT },
    { label: "Top Right", data: BadgePosition.TOP_RIGHT },
    { label: "Bottom Left", data: BadgePosition.BOTTOM_LEFT },
    { label: "Bottom Right", data: BadgePosition.BOTTOM_RIGHT },
];
const badgeDetailsPositions = [
    { label: "None", data: BadgePosition.NONE },
    { label: "Top Left", data: BadgePosition.TOP_LEFT },
    { label: "Top Right", data: BadgePosition.TOP_RIGHT },
];
const Settings = () => {
    const topRef = SP_REACT.useRef(null);
    const storedSettings = useSettings();
    SP_REACT.useEffect(() => {
        topRef.current?.focus();
    }, []);
    const [settings, setSettings] = SP_REACT.useState(storedSettings);
    const updateSetting = ({ key, value }) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveSettings(newSettings);
    };
    return (SP_REACT.createElement("div", null,
        SP_REACT.createElement("div", { ref: topRef, tabIndex: -1 }),
        " ",
        SP_REACT.createElement(DFL.PanelSection, { title: "Badge Positions" },
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.DropdownItem, { label: "Home", menuLabel: "Home Screen Position", description: "Position of the badge on the Home screen", selectedOption: settings.homePosition ?? DEFAULT_SETTINGS.homePosition, rgOptions: badgePositions, onChange: (option) => {
                        updateSetting({ key: "homePosition", value: option.data });
                    } })),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.DropdownItem, { label: "Library", menuLabel: "Library Position", description: "Position of the badge in the Library grid", selectedOption: settings.libraryPosition ?? DEFAULT_SETTINGS.libraryPosition, rgOptions: badgePositions, onChange: (option) => {
                        updateSetting({ key: "libraryPosition", value: option.data });
                    } })),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.DropdownItem, { label: "Details", menuLabel: "Game Details Position", description: "Position of the badge on the Details page", selectedOption: settings.detailsPosition ?? DEFAULT_SETTINGS.detailsPosition, rgOptions: badgeDetailsPositions, onChange: (option) => {
                        updateSetting({ key: "detailsPosition", value: option.data });
                    } })),
            SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ToggleField, { label: "Steam Store Button", description: "Show Steam store button on game details page, when available", checked: settings.showSteamStoreButton, onChange: (checked) => {
                        updateSetting({
                            key: "showSteamStoreButton",
                            value: checked,
                        });
                    } })),
            null)));
};
var Settings$1 = Settings;

function PluginIcon(props) {
    return (SP_REACT.createElement("svg", { viewBox: "34 34 84 60", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", style: { width: "1em", height: "1em" }, ...props },
        SP_REACT.createElement("circle", { cx: "64", cy: "64", r: "26", fill: "none", stroke: "currentColor", strokeWidth: "8" }),
        SP_REACT.createElement("circle", { cx: "64", cy: "64", r: "10", fill: "currentColor" }),
        SP_REACT.createElement("path", { d: "M80 64 L88 64", stroke: "currentColor", strokeWidth: "6", strokeLinecap: "round" }),
        SP_REACT.createElement("rect", { x: "88", y: "54", width: "22", height: "20", rx: "4", fill: "currentColor" }),
        SP_REACT.createElement("line", { x1: "110", y1: "58", x2: "118", y2: "58", stroke: "currentColor", strokeWidth: "3" }),
        SP_REACT.createElement("line", { x1: "110", y1: "70", x2: "118", y2: "70", stroke: "currentColor", strokeWidth: "3" })));
}

function r(e){var t,f,n="";if("string"==typeof e||"number"==typeof e)n+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(f=r(e[t]))&&(n&&(n+=" "),n+=f);}else for(f in e)e[f]&&(n&&(n+=" "),n+=f);return n}function clsx(){for(var e,t,f=0,n="",o=arguments.length;f<o;f++)(e=arguments[f])&&(t=r(e))&&(n&&(n+=" "),n+=t);return n}

var css_248z = ".SteamStoreButton-module_container__Ajz-- {\r\n  display: flex;\r\n  justify-content: center;\r\n  gap: 3px;\r\n}\r\n\r\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi {\r\n  padding: 8px !important;\r\n  min-width: auto !important;\r\n  color: #000 !important;\r\n  background: #1b2838 !important;\r\n  animation: SteamStoreButton-module_nonsteam-badge-fade-in__giERj 0.3s cubic-bezier(0.2, 0, 0.2, 1) forwards;\r\n}\r\n\r\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi:hover,\r\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi:focus,\r\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi:active {\r\n  background: #4b6479 !important;\r\n  outline: 1px solid black !important;\r\n}\r\n\r\n.SteamStoreButton-module_steamStoreButton__W-gdi svg {\r\n  color: #fff;\r\n}\r\n\r\n@keyframes SteamStoreButton-module_nonsteam-badge-fade-in__giERj {\r\n  from {\r\n    opacity: 0;\r\n    transform: scale(0.8);\r\n  }\r\n  to {\r\n    opacity: 1;\r\n    transform: scale(1);\r\n  }\r\n}\r\n";
var styles = {"container":"SteamStoreButton-module_container__Ajz--","steamStoreButton":"SteamStoreButton-module_steamStoreButton__W-gdi","nonsteam-badge-fade-in":"SteamStoreButton-module_nonsteam-badge-fade-in__giERj"};
injectStyle(css_248z);

var DefaultContext = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined
};
var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

var _excluded = ["attr", "size", "title"];
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function Tree2Element(tree) {
  return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
    key: i
  }, node.attr), Tree2Element(node.child)));
}
function GenIcon(data) {
  return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
    attr: _objectSpread({}, data.attr)
  }, props), Tree2Element(data.child));
}
function IconBase(props) {
  var elem = conf => {
    var {
        attr,
        size,
        title
      } = props,
      svgProps = _objectWithoutProperties(props, _excluded);
    var computedSize = size || conf.size || "1em";
    var className;
    if (conf.className) className = conf.className;
    if (props.className) className = (className ? className + " " : "") + props.className;
    return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, conf.attr, attr, svgProps, {
      className: className,
      style: _objectSpread(_objectSpread({
        color: props.color || conf.color
      }, conf.style), props.style),
      height: computedSize,
      width: computedSize,
      xmlns: "http://www.w3.org/2000/svg"
    }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
  };
  return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
}

// THIS FILE IS AUTO GENERATED
function LiaExternalLinkAltSolid (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 32 32"},"child":[{"tag":"path","attr":{"d":"M 18 5 L 18 7 L 23.5625 7 L 11.28125 19.28125 L 12.71875 20.71875 L 25 8.4375 L 25 14 L 27 14 L 27 5 Z M 5 9 L 5 27 L 23 27 L 23 14 L 21 16 L 21 25 L 7 25 L 7 11 L 16 11 L 18 9 Z"},"child":[]}]})(props);
}

// THIS FILE IS AUTO GENERATED
function FaSteam (props) {
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z"},"child":[]}]})(props);
}

function SteamStoreButton({ steamAppId, }) {
    return (SP_REACT.createElement("div", null,
        SP_REACT.createElement(DFL.DialogButton, { className: styles.steamStoreButton, onClick: () => {
                DFL.Navigation.NavigateToExternalWeb(`https://store.steampowered.com/app/${steamAppId}`);
            } },
            SP_REACT.createElement("div", { className: styles.container },
                SP_REACT.createElement(FaSteam, null),
                SP_REACT.createElement(LiaExternalLinkAltSolid, null)))));
}

const context = GameStoreContext.DETAILS;
function GameDetailsBadge() {
    const settings = useSettings();
    const [steamAppId, setSteamAppId] = SP_REACT.useState(null);
    const [gameStore, setGameStore] = SP_REACT.useState(null);
    const [loading, setLoading] = SP_REACT.useState(true);
    // Extract appid from current URL
    const currentPath = window.location.pathname;
    const match = currentPath.match(/\/library\/app\/(\d+)/);
    const appid = match ? match[1] : null;
    log(context);
    SP_REACT.useEffect(() => {
        log(context, "Badge settings: " + JSON.stringify(settings));
        // If setting is disabled, clear any existing ID and stop.
        if (settings.disableBadges || !settings.showSteamStoreButton) {
            setSteamAppId(null);
        }
    }, [settings.disableBadges, settings.showSteamStoreButton]);
    // Fetch gameStore info from backend via cache
    SP_REACT.useEffect(() => {
        if (!appid || !isNonSteamApp(appid)) {
            log(context);
            setLoading(false);
            return;
        }
        if (settings.disableBadges) {
            setLoading(false);
            setGameStore(null);
            setSteamAppId(null);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setGameStore(null);
        setSteamAppId(null);
        log(context);
        (async () => {
            await ensureMappingsLoaded();
            if (cancelled)
                return;
            const store = getStore(appid);
            const name = getName(appid);
            if (store) {
                setGameStore(store);
                log(context);
            }
            else {
                log(context);
            }
            if (cancelled)
                return;
            setLoading(false);
            if (name && settings.showSteamStoreButton) {
                log(context);
                const steamId = await call("search_steam_id", name);
                if (cancelled)
                    return;
                if (steamId) {
                    setSteamAppId(steamId);
                    log(context);
                }
                else {
                    log(context);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [appid, settings.disableBadges, settings.showSteamStoreButton]);
    // Only render for non-Steam games
    if (!appid || !isNonSteamApp(appid) || settings.disableBadges) {
        return null;
    }
    const gameStoreName = sanitizedGameStoreName(gameStore) ?? GameStoreName.DEFAULT;
    const badge = loading
        ? getBadgeIcon(GameStoreName.DEFAULT)
        : getBadgeIcon(gameStoreName);
    if (loading)
        log(context);
    log(context);
    // If badge position is disabled but button is enabled, default button to top-left position
    const badgePositionStyle = styles$1[getDetailsBadgePositionClassKey(settings.detailsPosition, settings.showSteamStoreButton)];
    return (SP_REACT.createElement(SP_REACT.Fragment, null,
        SP_REACT.createElement("div", { className: clsx(styles$1.badge, styles$1.detailsBadge, badgePositionStyle, steamAppId ? styles$1.detailsBadgeWithButton : "", loading ? styles$1[PULSATING_CLASSNAME] : "") },
            settings.detailsPosition !== "none" ? (SP_REACT.createElement("div", { dangerouslySetInnerHTML: { __html: badge } })) : null,
            steamAppId && SP_REACT.createElement(SteamStoreButton, { steamAppId: steamAppId }))));
}

let cleanupRenderPatch = null;
let patchedRouteProps = null;
function cleanupGameDetailsPatches() {
    if (cleanupRenderPatch) {
        cleanupRenderPatch();
        cleanupRenderPatch = null;
    }
    patchedRouteProps = null;
}
/**
 * Patch game details page (React-based).
 */
const patchGameDetails = (tree) => {
    const routeProps = DFL.findInReactTree(tree, (x) => x?.renderFunc);
    if (routeProps && routeProps !== patchedRouteProps) {
        cleanupGameDetailsPatches();
        const patchHandler = DFL.createReactTreePatcher([
            (tree) => DFL.findInReactTree(tree, (x) => x?.props?.children?.props?.overview)
                ?.props?.children,
        ], (_, ret) => {
            const container = DFL.findInReactTree(ret, (x) => Array.isArray(x?.props?.children) &&
                x?.props?.className?.includes(DFL.appDetailsClasses.InnerContainer));
            if (typeof container !== "object") {
                return ret;
            }
            container.props.children.splice(1, 0, SP_REACT.createElement(GameDetailsBadge, null));
            return ret;
        });
        const unpatch = DFL.afterPatch(routeProps, "renderFunc", patchHandler);
        cleanupRenderPatch =
            typeof unpatch === "function" ? unpatch : null;
        patchedRouteProps = routeProps;
    }
    return tree;
};

function isObserverRoute(pathname) {
    return (pathname.startsWith("/routes/library") ||
        pathname.startsWith("/routes/search"));
}
function shouldObserveDomBadges(settings) {
    return (!settings.disableBadges &&
        (settings.libraryPosition !== "none" || settings.homePosition !== "none"));
}
function getObserverRouteAction(params) {
    const { pathname, observerActive, settings } = params;
    if (!shouldObserveDomBadges(settings)) {
        return observerActive ? "stop" : "noop";
    }
    if (isObserverRoute(pathname)) {
        return observerActive ? "noop" : "start";
    }
    return observerActive ? "stop" : "noop";
}

var index = definePlugin(() => {
    const settings = getSettings();
    const startupTimeouts = new Set();
    const routeMonitorIntervalMs = 500;
    let routeMonitorInterval;
    let observerActive = false;
    // Warm the store cache early so visible capsules can render final badges immediately.
    void ensureMappingsLoaded();
    const canObserveCurrentSettings = () => shouldObserveDomBadges(getSettings());
    const stopObserverForCurrentRoute = () => {
        if (!observerActive) {
            return;
        }
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
    const handleLibraryPatch = (tree) => {
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
    const handleSearchPatch = (tree) => {
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
        titleView: SP_REACT.createElement("div", null, "Non-Steam Badges"),
        name: "Non-Steam Badges",
        content: SP_REACT.createElement(Settings$1, null),
        icon: SP_REACT.createElement(PluginIcon, null),
        onDismount() {
            stopObserverForCurrentRoute();
            startupTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            startupTimeouts.clear();
            if (routeMonitorInterval) {
                clearInterval(routeMonitorInterval);
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

export { index as default };
//# sourceMappingURL=index.js.map
