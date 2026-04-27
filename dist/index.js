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
    console[level](`[Non-Steam Badges][${context}] ${message}`);
}

const PLUGIN_ID = "nonsteam-badges-decky";
const context$6 = "styleInjector";
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
    log(context$6, "Injected styles into BigPicture window");
}
function removeStyleFromWindow(targetWindow) {
    if (!targetWindow || !targetWindow.document)
        return;
    const style = targetWindow.document.querySelector(`style[data-plugin="${PLUGIN_ID}"]`);
    if (style) {
        style.remove();
        log(context$6, "Removed styles from BigPicture window");
    }
}

var css_248z$1 = ".Badge-module_badge__MUvUi {\n  position: absolute;\n  display: flex;\n  border-radius: 5px;\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  color: white;\n  pointer-events: none;\n  background: #0000002e;\n  z-index: 9999;\n}\n\n.Badge-module_detailsBadge__ycul2 {\n  z-index: 0;\n  box-sizing: border-box;\n  padding: 5px;\n  padding-bottom: 0;\n}\n\n.Badge-module_detailsBadgeWithButton__YG9ZN {\n  flex-direction: column;\n  height: auto;\n}\n\n.Badge-module_detailsBadgeWithButton__YG9ZN svg.icon-badge {\n  width: 48px;\n  height: 48px;\n}\n\n.Badge-module_libraryBadge__nvyI6 {\n  padding: 2px;\n  border-radius: 2px;\n}\n\n.Badge-module_libraryBadge__nvyI6 svg.icon-badge {\n  width: 28px;\n  height: 28px;\n}\n\n.Badge-module_homeBadge__VBw7G {\n  padding: 2px;\n  border-radius: 2px;\n}\n\n.Badge-module_homeBadge__VBw7G svg.icon-badge {\n  width: 28px;\n  height: 28px;\n}\n\n.Panel\n  [role=\"listitem\"]:first-of-type\n  .Badge-module_homeBadge__VBw7G\n  svg.icon-badge {\n  width: 40px;\n  height: 40px;\n}\n\n.Badge-module_searchBadge__V2InQ svg.icon-badge {\n  width: 24px;\n  height: 24px;\n}\n\n.Badge-module_nonsteam-badge-pulsing__k7UJv {\n  animation: Badge-module_nonsteam-badge-pulse__ux3h3 2s infinite ease-in-out;\n}\n\n.Badge-module_top-left__vhIBr {\n  top: 4px;\n  left: 4px;\n}\n\n.Badge-module_top-right__k9tm2 {\n  top: 4px;\n  right: 4px;\n}\n\n.Badge-module_bottom-left__B0MGj {\n  bottom: 4px;\n  left: 4px;\n}\n\n.Badge-module_bottom-right__wK-WR {\n  bottom: 4px;\n  right: 4px;\n}\n\n.Badge-module_details-top-left__9FED9 {\n  flex-direction: row;\n  gap: 5px;\n  top: 45px;\n  left: 20px;\n}\n\n.Badge-module_details-top-left__9FED9 svg.icon-badge {\n  width: 42px;\n  height: 42px;\n}\n\n.Badge-module_detailsBadgeWithButton__YG9ZN.Badge-module_details-top-left__9FED9 svg.icon-badge {\n  width: 32px;\n  height: 32px;\n}\n\n.Badge-module_details-top-right__GADVk {\n  top: 55px;\n  right: 20px;\n  align-items: center;\n}\n\n.Badge-module_search-top-right__V3fHe {\n  top: 10px;\n  right: 5px;\n}\n\n@keyframes Badge-module_nonsteam-badge-pulse__ux3h3 {\n  0% {\n    transform: scale(0.9);\n    opacity: 0.4;\n  }\n  50% {\n    transform: scale(1.1);\n    opacity: 0.8;\n  }\n  100% {\n    transform: scale(0.9);\n    opacity: 0.4;\n  }\n}\n";
var styles$1 = {"badge":"Badge-module_badge__MUvUi","detailsBadge":"Badge-module_detailsBadge__ycul2","detailsBadgeWithButton":"Badge-module_detailsBadgeWithButton__YG9ZN","libraryBadge":"Badge-module_libraryBadge__nvyI6","homeBadge":"Badge-module_homeBadge__VBw7G","searchBadge":"Badge-module_searchBadge__V2InQ","nonsteam-badge-pulsing":"Badge-module_nonsteam-badge-pulsing__k7UJv","nonsteam-badge-pulse":"Badge-module_nonsteam-badge-pulse__ux3h3","top-left":"Badge-module_top-left__vhIBr","top-right":"Badge-module_top-right__k9tm2","bottom-left":"Badge-module_bottom-left__B0MGj","bottom-right":"Badge-module_bottom-right__wK-WR","details-top-left":"Badge-module_details-top-left__9FED9","details-top-right":"Badge-module_details-top-right__GADVk","search-top-right":"Badge-module_search-top-right__V3fHe"};
injectStyle(css_248z$1);

var GameStoreName;
(function (GameStoreName) {
    GameStoreName["GOG"] = "gog";
    GameStoreName["EPIC"] = "epic";
    GameStoreName["AMAZON"] = "amazon";
    GameStoreName["UBISOFT"] = "ubisoft";
    GameStoreName["XBOX"] = "xbox";
    GameStoreName["EA"] = "ea";
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
        GameStoreName.UBISOFT,
        GameStoreName.XBOX,
        GameStoreName.EA,
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
    SupportedStores["UBISOFT"] = "ubisoft";
    SupportedStores["XBOX"] = "xbox";
    SupportedStores["EA"] = "ea";
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

const context$5 = "settings";
const SETTINGS_KEY = "nonsteam-badges-settings";
function getSettings() {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (!stored)
            return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    catch (e) {
        log(context$5, "Error loading settings:", "error");
        return DEFAULT_SETTINGS;
    }
}
function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        log(context$5, `Settings saved: ${JSON.stringify(settings)}`);
        window.dispatchEvent(new CustomEvent(SETTINGS_CHANGED_EVENT, {
            detail: settings,
        }));
    }
    catch (e) {
        log(context$5, "Error saving settings:", "error");
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
var storeMappings = {
	gog: gog,
	epic: epic,
	amazon: amazon,
	ubisoft: ubisoft,
	xbox: xbox,
	ea: ea
};

const context$4 = "cache";
const CACHE_TTL_MS = 60 * 1000; // 1 minute
let gameStoreMappingsCache = {};
let mappingsLoaded = false;
let isFetchingMappings = false;
let lastFetchTime = 0;
let frontendStoreByAppId = new Map();
let lastUserCollectionsRef = null;
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
    if (isExpired) {
        log(context$4, "Store mappings cache expired or missing, fetching...");
    }
    else {
        log(context$4, "Fetching all store mappings...");
    }
    try {
        const result = await call("get_all_store_mappings");
        if (result) {
            gameStoreMappingsCache = result;
            mappingsLoaded = true;
            lastFetchTime = Date.now();
            log(context$4, `Loaded ${Object.keys(result).length} mappings`);
        }
        else {
            log(context$4, "Failed to load mappings: API call returned unsuccessful", "error");
            log(context$4, JSON.stringify(result), "error");
        }
    }
    catch (e) {
        log(context$4, "Failed to load mappings", "error");
        log(context$4, e, "error");
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
        if (userCollections !== lastUserCollectionsRef) {
            frontendStoreByAppId.clear();
            lastUserCollectionsRef = userCollections;
            collectionVersion++;
        }
        if (frontendStoreByAppId.has(appid)) {
            return frontendStoreByAppId.get(appid) ?? null;
        }
        const numericAppId = parseInt(appid);
        if (isNaN(numericAppId))
            return null;
        for (const collection of userCollections) {
            if (collection.apps &&
                collection.apps.has &&
                collection.apps.has(numericAppId)) {
                const colName = collection.displayName;
                for (const store of supportedStores) {
                    const aliases = storeMappings[store] || [store];
                    for (const alias of aliases) {
                        const regex = new RegExp(`\\b${alias}\\b`, "i");
                        if (regex.test(colName)) {
                            frontendStoreByAppId.set(appid, store);
                            return store;
                        }
                    }
                }
                break;
            }
        }
        frontendStoreByAppId.set(appid, null);
        return null;
    }
    catch (e) {
        log(context$4, "Could not check frontend collections: " + JSON.stringify(e), "warn");
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
    default: {
        name: "NON-STEAM",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" > <!-- Steam-like core --> <circle cx="64" cy="64" r="26" fill="none" stroke="white" stroke-width="8" /> <circle cx="64" cy="64" r="10" fill="white" /> <!-- Plug connector --> <path d="M80 64 L88 64" stroke="white" stroke-width="6" stroke-linecap="round" /> <!-- Plug body --> <rect x="88" y="54" width="22" height="20" rx="4" fill="white" /> <!-- Plug prongs --> <line x1="110" y1="58" x2="118" y2="58" stroke="white" stroke-width="3" /> <line x1="110" y1="70" x2="118" y2="70" stroke="white" stroke-width="3" /></svg>`,
    },
};
/**
 * Get the badge styles for each context.
 */
function getBadgeStyle(gameStore, prop) {
    return BADGE_STYLES?.[gameStore]?.[prop] || BADGE_STYLES?.default?.[prop];
}
function getBadgeIcon(gameStore, context) {
    log("getBadgeIcon", `gameStore: ${gameStore}, context: ${context}`);
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
    log(context, `Adding badge to capsule. Store name: ${gameStoreName}`);
    // Determine the capsules context
    let effectiveContext = context;
    const cachedContext = existingBadge?.getAttribute("data-context");
    if (cachedContext) {
        effectiveContext = cachedContext;
    }
    else if (effectiveContext === GameStoreContext.LIBRARY && img) {
        const rect = img.getBoundingClientRect();
        effectiveContext = getEffectiveCapsuleContext(effectiveContext, rect);
        if (effectiveContext === GameStoreContext.SEARCH) {
            log(context, `Detected landscaped capsule for appid ${appid}, using SEARCH context`);
        }
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
        log(context, `Got a game store name for appid ${appid}: ${gameStoreName}. Injecting badge icon into the DOM.`);
        // Inject the badge icon in the DOM
        if (badge.getAttribute("data-store") !== gameStoreName ||
            !existingBadge) {
            badge.innerHTML = getBadgeIcon(gameStoreName, effectiveContext);
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
        log(context, `No game store name for appid ${appid}: ${gameStoreName}. Falling back to default	while fetching.`);
        // If we don't have a cached store name, show placeholder and pulse while fetching
        if (badge.getAttribute("data-store") !== GameStoreName.DEFAULT ||
            !existingBadge) {
            badge.innerHTML = getBadgeIcon(GameStoreName.DEFAULT, effectiveContext);
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
            }
            else {
                badge.classList.remove(styles$1[PULSATING_CLASSNAME]);
            }
        })();
    }
}

const context$3 = "observer";
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
        log(context$3, "Error getting Big Picture window:", "error");
    }
    return null;
}
function startObserving() {
    // Ensure we don't leak observers
    stopObserving();
    const bigPicWindow = getBigPictureWindow();
    if (!bigPicWindow) {
        log(context$3, "Big Picture window not found, retrying...");
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
    if (containers.length > 0) {
        log(context$3, "Observer attached to containers");
    }
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

const context$2 = "useSettings";
function useSettings() {
    const [settings, setSettings] = SP_REACT.useState(getSettings());
    SP_REACT.useEffect(() => {
        const handleChange = (event) => {
            if (event instanceof CustomEvent && event.detail) {
                log(context$2, "Settings changed (custom event): " + JSON.stringify(event.detail));
                setSettings(event.detail);
            }
            else {
                log(context$2, "Settings changed (fallback): " + JSON.stringify(getSettings()));
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
            (SP_REACT.createElement(DFL.PanelSectionRow, null,
                SP_REACT.createElement(DFL.ToggleField, { label: "Disable Badges", description: "Dev-only toggle to disable badge rendering for performance checks", checked: settings.disableBadges, onChange: (checked) => {
                        updateSetting({
                            key: "disableBadges",
                            value: checked,
                        });
                    } }))) )));
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

var css_248z = ".SteamStoreButton-module_container__Ajz-- {\n  display: flex;\n  justify-content: center;\n  gap: 3px;\n}\n\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi {\n  padding: 8px !important;\n  min-width: auto !important;\n  color: #000 !important;\n  background: #1b2838 !important;\n  animation: SteamStoreButton-module_nonsteam-badge-fade-in__giERj 0.3s cubic-bezier(0.2, 0, 0.2, 1) forwards;\n}\n\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi:hover,\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi:focus,\nbutton.SteamStoreButton-module_steamStoreButton__W-gdi:active {\n  background: #4b6479 !important;\n  outline: 1px solid black !important;\n}\n\n.SteamStoreButton-module_steamStoreButton__W-gdi svg {\n  color: #fff;\n}\n\n@keyframes SteamStoreButton-module_nonsteam-badge-fade-in__giERj {\n  from {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n";
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

const context$1 = GameStoreContext.DETAILS;
function GameDetailsBadge() {
    const settings = useSettings();
    const [steamAppId, setSteamAppId] = SP_REACT.useState(null);
    const [gameStore, setGameStore] = SP_REACT.useState(null);
    const [loading, setLoading] = SP_REACT.useState(true);
    // Extract appid from current URL
    const currentPath = window.location.pathname;
    const match = currentPath.match(/\/library\/app\/(\d+)/);
    const appid = match ? match[1] : null;
    log(context$1, `Badge appid: ${appid}`);
    SP_REACT.useEffect(() => {
        log(context$1, "Badge settings: " + JSON.stringify(settings));
        // If setting is disabled, clear any existing ID and stop.
        if (settings.disableBadges || !settings.showSteamStoreButton) {
            setSteamAppId(null);
        }
    }, [settings.disableBadges, settings.showSteamStoreButton]);
    // Fetch gameStore info from backend via cache
    SP_REACT.useEffect(() => {
        if (!appid || !isNonSteamApp(appid)) {
            log(context$1, `Details page useEffect skipping - not a non-Steam app: ${appid}`);
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
        log(context$1, "Details page useEffect - ensuring mappings loaded");
        (async () => {
            await ensureMappingsLoaded();
            if (cancelled)
                return;
            const store = getStore(appid);
            const name = getName(appid);
            if (store) {
                setGameStore(store);
                log(context$1, `Identified Store via Cache: ${store}`);
            }
            else {
                log(context$1, `AppID ${appid} not found in cache.`);
            }
            if (cancelled)
                return;
            setLoading(false);
            if (name && settings.showSteamStoreButton) {
                log(context$1, `Searching for Steam AppID using name: ${name}`);
                const steamId = await call("search_steam_id", name);
                if (cancelled)
                    return;
                if (steamId) {
                    setSteamAppId(steamId);
                    log(context$1, `Found Steam AppID: ${steamId}`);
                }
                else {
                    log(context$1, `Could not find Steam AppID for ${name}`);
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
        ? getBadgeIcon(GameStoreName.DEFAULT, GameStoreContext.DETAILS)
        : getBadgeIcon(gameStoreName, GameStoreContext.DETAILS);
    if (loading)
        log(context$1, `Badge is loading`);
    log(context$1, `Badge valid: ${!!badge}`);
    // If badge position is disabled but button is enabled, default button to top-left position
    const badgePositionStyle = styles$1[getDetailsBadgePositionClassKey(settings.detailsPosition, settings.showSteamStoreButton)];
    return (SP_REACT.createElement(SP_REACT.Fragment, null,
        SP_REACT.createElement("div", { className: clsx(styles$1.badge, styles$1.detailsBadge, badgePositionStyle, steamAppId ? styles$1.detailsBadgeWithButton : "", loading ? styles$1[PULSATING_CLASSNAME] : "") },
            settings.detailsPosition !== "none" ? (SP_REACT.createElement("div", { dangerouslySetInnerHTML: { __html: badge } })) : null,
            steamAppId && SP_REACT.createElement(SteamStoreButton, { steamAppId: steamAppId }))));
}

const context = GameStoreContext.DETAILS;
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
                log(context, "Patch FAILED to find container in 'ret'.");
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
    let routeLoggerInterval;
    let routeMonitorInterval;
    let observerActive = false;
    // Warm the store cache early so visible capsules can render final badges immediately.
    void ensureMappingsLoaded();
    {
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
    const handleLibraryPatch = (tree) => {
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
    const handleSearchPatch = (tree) => {
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

export { index as default };
//# sourceMappingURL=index.js.map
