// Decky Loader will pass this api in, it's versioned to allow for backwards compatibility.
// @ts-ignore

// Prevents it from being duplicated in output.
const manifest = {"id":"decky-nonsteam-badges","name":"Non-Steam Badges","author":"sebet","version":"0.2.2","flags":[],"api_version":1,"publish":{"tags":["utility","ui","badges","nonsteam","non-steam"],"description":"A Decky plugin that helps identifying non-Steam games using themed badges","image":"https://raw.githubusercontent.com/sebet/decky-nonsteam-badges/main/assets/screenshot.jpg"}};
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
    SupportedStores["EMULATORS"] = "emulators";
    SupportedStores["GAMEVAULT"] = "gamevault";
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

function log(context, message, level = "log") {
    return;
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
var emulators = [
	"emu",
	"roms",
	"emulators",
	"retro"
];
var gamevault = [
	"gamevault",
	"game vault"
];
var sideloaded = [
	"sideloaded",
	"side-loaded",
	"side loaded"
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
	emulators: emulators,
	gamevault: gamevault,
	sideloaded: sideloaded
};

const context$3 = "cache";
const CACHE_TTL_MS = 60 * 1000; // 1 minute
let gameStoreMappingsCache = {};
let mappingsLoaded = false;
let isFetchingMappings = false;
let lastFetchTime = 0;
let lastUserCollectionsRef = null;
let lastUserCollectionsSignature = "";
let collectionVersion = 0;
function escapeRegExp$1(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getAppIdCandidates(appid) {
    const numericAppId = parseInt(appid, 10);
    if (isNaN(numericAppId))
        return [appid];
    const unsignedAppId = numericAppId >>> 0;
    const signedAppId = unsignedAppId > 0x7fffffff ? unsignedAppId - 0x100000000 : unsignedAppId;
    return Array.from(new Set([
        appid,
        String(numericAppId),
        String(unsignedAppId),
        String(signedAppId),
        numericAppId,
        unsignedAppId,
        signedAppId,
    ]));
}
function collectionContainsApp(apps, appid) {
    const candidates = getAppIdCandidates(appid);
    if (apps && typeof apps.has === "function") {
        return candidates.some((candidate) => apps.has(candidate));
    }
    if (Array.isArray(apps)) {
        return candidates.some((candidate) => apps.includes(candidate));
    }
    return false;
}
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
            log(context$3, JSON.stringify(result), "error");
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
        for (const collection of userCollections) {
            if (collection.apps && collectionContainsApp(collection.apps, appid)) {
                const colName = String(collection.displayName ?? "");
                for (const store of supportedStores) {
                    const aliases = storeMappings[store] || [store];
                    for (const alias of aliases) {
                        const regex = new RegExp(`\\b${escapeRegExp$1(alias)}\\b`, "i");
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
        log(context$3, "Could not check frontend collections: " + JSON.stringify(e), "warn");
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
/** Specific emulator icons apply only when the effective category is emulators. */
function getEmulator(appid) {
    if (getStore(appid) !== "emulators")
        return null;
    const entry = gameStoreMappingsCache[appid];
    return typeof entry === "object" ? entry.emulator ?? null : null;
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

var css_248z$1 = ".Badge-module_badge__MUvUi {\n  --badge-size: 28px;\n  --badge-padding: calc(var(--badge-size) * 0.08);\n  --badge-offset: calc(var(--badge-size) * 0.14);\n  position: absolute;\n  display: flex;\n  border-radius: 5px;\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  color: white;\n  pointer-events: none;\n  background: #0000002e;\n  z-index: 9999;\n}\n\n.Badge-module_detailsBadge__ycul2 {\n  --badge-size: clamp(32px, 2.8vw, 48px);\n  z-index: 0;\n  box-sizing: border-box;\n  padding: calc(var(--badge-size) * 0.1);\n  padding-bottom: 0;\n}\n\n.Badge-module_detailsBadgeWithButton__YG9ZN {\n  flex-direction: column;\n  height: auto;\n}\n\n.Badge-module_detailsBadgeWithButton__YG9ZN svg.icon-badge {\n  width: var(--badge-size);\n  height: var(--badge-size);\n}\n\n.Badge-module_libraryBadge__nvyI6 {\n  --badge-size: clamp(24px, 1.6vw, 32px);\n  padding: var(--badge-padding);\n  border-radius: 2px;\n}\n\n.Badge-module_libraryBadge__nvyI6 svg.icon-badge {\n  width: var(--badge-size);\n  height: var(--badge-size);\n}\n\n.Badge-module_homeBadge__VBw7G {\n  --badge-size: clamp(24px, 1.6vw, 32px);\n  padding: var(--badge-padding);\n  border-radius: 2px;\n}\n\n.Badge-module_homeBadge__VBw7G svg.icon-badge {\n  width: var(--badge-size);\n  height: var(--badge-size);\n}\n\n.Panel\n  [role=\"listitem\"]:first-of-type\n  .Badge-module_homeBadge__VBw7G\n  svg.icon-badge {\n  width: clamp(32px, 2vw, 40px);\n  height: clamp(32px, 2vw, 40px);\n}\n\n.Badge-module_searchBadge__V2InQ {\n  --badge-size: clamp(20px, 1.4vw, 28px);\n}\n\n.Badge-module_searchBadge__V2InQ svg.icon-badge {\n  width: var(--badge-size);\n  height: var(--badge-size);\n}\n\n.Badge-module_nonsteam-badge-pulsing__k7UJv {\n  animation: Badge-module_nonsteam-badge-pulse__ux3h3 2s infinite ease-in-out;\n}\n\n.Badge-module_top-left__vhIBr {\n  top: var(--badge-offset);\n  left: var(--badge-offset);\n}\n\n.Badge-module_top-right__k9tm2 {\n  top: var(--badge-offset);\n  right: var(--badge-offset);\n}\n\n.Badge-module_bottom-left__B0MGj {\n  bottom: var(--badge-offset);\n  left: var(--badge-offset);\n}\n\n.Badge-module_bottom-right__wK-WR {\n  bottom: var(--badge-offset);\n  right: var(--badge-offset);\n}\n\n.Badge-module_details-top-left__9FED9 {\n  flex-direction: row;\n  gap: 5px;\n  top: 45px;\n  left: 20px;\n}\n\n.Badge-module_details-top-left__9FED9 svg.icon-badge {\n  width: calc(var(--badge-size) * 0.875);\n  height: calc(var(--badge-size) * 0.875);\n}\n\n.Badge-module_detailsBadgeWithButton__YG9ZN.Badge-module_details-top-left__9FED9 svg.icon-badge {\n  width: calc(var(--badge-size) * 0.67);\n  height: calc(var(--badge-size) * 0.67);\n}\n\n.Badge-module_details-top-right__GADVk {\n  top: 55px;\n  right: 20px;\n  align-items: center;\n}\n\n.Badge-module_search-top-right__V3fHe {\n  top: 10px;\n  right: 5px;\n}\n\n@keyframes Badge-module_nonsteam-badge-pulse__ux3h3 {\n  0% {\n    transform: scale(0.9);\n    opacity: 0.4;\n  }\n  50% {\n    transform: scale(1.1);\n    opacity: 0.8;\n  }\n  100% {\n    transform: scale(0.9);\n    opacity: 0.4;\n  }\n}\n";
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
    GameStoreName["EMULATORS"] = "emulators";
    GameStoreName["GAMEVAULT"] = "gamevault";
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
        GameStoreName.EMULATORS,
        GameStoreName.GAMEVAULT,
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

const context$2 = "settings";
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
        log(context$2, `Settings saved: ${JSON.stringify(settings)}`);
        window.dispatchEvent(new CustomEvent(SETTINGS_CHANGED_EVENT, {
            detail: settings,
        }));
    }
    catch (e) {
    }
}

// Compact monochrome interpretations of the emulator marks. No raster data or filters.
const EMULATOR_BADGE_ICONS = {
    "retroarch": "<svg class=\"icon-badge\" width=\"64\" height=\"64\" viewBox=\"0 0 32 32\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 5h3v3h10V5h3v3h3v4h3v3H2v-3h3V8h3Zm0 6v2h4v-2Zm12 0v2h4v-2ZM5 17h22v3h-6l4 5h-4l-5-5-5 5H7l4-5H5Z\"/></svg>",
    "dolphin": "<svg class=\"icon-badge\" width=\"64\" height=\"64\" viewBox=\"0 0 32 32\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M3 18C4 9 14 6 21 9c3-2 6-2 8 0-3-1-5 0-6 2C14 7 7 10 3 18Zm7-3c7-3 13 1 16 9-4-6-9-9-16-9Zm13-3c4 3 6 7 7 13-2-5-4-9-7-11Z\"/></svg>",
    "pcsx2": "<svg class=\"icon-badge\" width=\"64\" height=\"64\" viewBox=\"0 0 32 32\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke=\"white\" stroke-width=\"2.6\" stroke-linecap=\"square\" stroke-linejoin=\"round\"><path d=\"M3 23V9h6v7H3M13 23h6v-7h-6V9h6M23 9h6v7h-6v7h6\"/></g></svg>",
    "rpcs3": "<svg class=\"icon-badge\" width=\"64\" height=\"64\" viewBox=\"0 0 32 32\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6 8h16a4 4 0 0 1 0 8H6m16 0a4 4 0 0 1 0 8H6\" fill=\"none\" stroke=\"white\" stroke-width=\"3\" stroke-linecap=\"square\" stroke-linejoin=\"round\"/></svg>",
    "xenia": "<svg class=\"icon-badge\" width=\"64\" height=\"64\" viewBox=\"0 0 32 32\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" stroke=\"white\" stroke-width=\"1.2\" stroke-linejoin=\"round\"><path d=\"m16 3 13 7.5V15l-13 7.5L3 15v-4.5Zm-13 7.5L16 18l13-7.5M16 18v4.5M5 17v1.5l2 1.2M9 19.3v1.5l2 1.2M13 21.6v1.5l2 1.2M19 20.8v1.5l-2 1.2M23 18.5V20l-2 1.2M27 16.2v1.5l-2 1.2\"/></g><path d=\"M9.5 7.5c4 1 7 3.5 12 7M22 7c-4 1.5-7 4-12 7.5\" fill=\"none\" stroke=\"white\" stroke-width=\"1.8\" stroke-linecap=\"round\"/></svg>",
    "xemu": "<svg class=\"icon-badge\" width=\"64\" height=\"64\" viewBox=\"0 0 32 32\" fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"16\" cy=\"16\" r=\"14\" fill=\"none\" stroke=\"white\" stroke-width=\"1.5\"/><g fill=\"none\" stroke=\"white\" stroke-width=\"1.4\" stroke-linejoin=\"round\"><path d=\"m5 13 4 6m0-6-4 6m6-3h4v-3h-4v6h4m2 0v-6h3v6m0-6h3v6m2-6v6h3v-6\"/></g></svg>"
};

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
        name: "AMAZON GAMES",
        gradient: "linear-gradient(135deg, #FF9900 0%, #FFB84D 100%)",
        // Amazon Games mark from react-icons SiAmazongames (Simple Icons).
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 5 24 14" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M3.8457 11.1425c.09-.303.082-.685.082-1.078V7.2513c0-.135.033-.52-.02-.6-.054-.08-.26-.062-.404-.062-.412 0-.595-.057-.632.336l-.016.01c-.323-.247-.63-.482-1.223-.47l-.197.015a1.875 1.875 0 0 0-.3361.082 1.622 1.622 0 0 0-.886.89 3.0171 3.0171 0 0 0-.171.607 1.967 1.967 0 0 0-.031.62c.03.195.012.365.05.535.145.609.43 1.083.955 1.31a1.665 1.665 0 0 0 .917.114 1.73 1.73 0 0 0 .59-.22l.223-.164h.005a1.857 1.857 0 0 1-.01.556c-.091.526-.246.704-.771.797a1.483 1.483 0 0 1-.446.011l-.435-.057-.638-.154a.14.14 0 0 0-.103.088 3.3121 3.3121 0 0 0 .02.6431c.073.122.31.17.457.218.494.157 1.292.233 1.828.047.613-.211 1-.624 1.192-1.261zm-1.09-3.0421v1.445a1.255 1.255 0 0 1-.356.176c-.872.274-1.2021-.34-1.2021-1.144a2.087 2.087 0 0 1 .093-.731c.077-.198.195-.371.39-.45.068-.03.152-.022.227-.053a1.745 1.745 0 0 1 .642.1l.193.09c.047.083.014.438.014.567zm3.509 2.756a2.114 2.114 0 0 0 .689-.265l.2741-.202c.07.092.043.231.134.301.092.07.798.096.865 0 .068-.095.037-.302.037-.446v-1.848c0-.36.027-.763-.057-1.046-.197-.667-.76-.896-1.632-.887l-.466.03a5.1102 5.1102 0 0 0-.788.172c-.112.039-.283.068-.33.17-.045.104-.036.647.026.69.093.063.536-.083.66-.11.357-.077 1.173-.156 1.372.1.144.184.12.544.116.876-.082.02-.224-.035-.31-.052l-.394-.041a1.483 1.483 0 0 0-.435.015c-.676.116-1.154.373-1.31 1-.243.963.592 1.746 1.549 1.544Zm-.197-1.786c.098-.058.22-.042.342-.09.276 0 .509.043.7401.053.043.093.013.563.01.705-.196.261-.988.521-1.257.15-.194-.275-.064-.684.165-.818Zm3.1752 1.318c0 .144-.018.287.072.342.05.03.172.016.247.016.173 0 .765.036.83-.047.082-.103.035-.645.035-.834v-2.261a1.594 1.594 0 0 1 .503-.187c.279-.065.648-.066.787.12.123.164.104.457.104.745v1.565c0 .213-.048.807.072.881.074.045.412.016.528.016.117 0 .457.028.53-.026.097-.074.056-.6.056-.788q0-1.164.005-2.331c.04-.065.202-.092.28-.12.3421-.12.8751-.2 1.0411.135.082.173.057.488.057.742v1.552c0 .185-.041.687.036.788.046.059.151.047.254.047.155 0 .77.027.84-.026.102-.078.061-.39.061-.565v-1.61c0-.68.053-1.298-.247-1.685-.537-.7-1.953-.325-2.472.12h-.02c-.199-.334-.54-.522-1.081-.514l-.218.016a2.49 2.49 0 0 0-.435.098 3.3441 3.3441 0 0 0-.5231.247l-.254.156c-.092-.111-.036-.292-.165-.368-.05-.03-.714-.038-.807-.015a.165.165 0 0 0-.088.057c-.055.082-.027.625-.027.782zm7.9362.175c.51.32 1.426.389 2.15.208.182-.045.5371-.11.6001-.259a3.9771 3.9771 0 0 0 .01-.622.15.15 0 0 0-.066-.077c-.065-.028-.165.02-.228.036l-.534.098a1.95 1.95 0 0 1-.59.022 3.2441 3.2441 0 0 1-.412-.058c-.406-.123-.675-.425-.68-.943.097-.043.413-.01.544-.01h1.32c.19 0 .493.04.61-.047.155-.116.144-.894.093-1.144-.17-.85-.682-1.318-1.71-1.3l-.124.005-.373.05c-.4.102-.746.287-.968.566a2.117 2.117 0 0 0-.3061.494c-.203.482-.259 1.353-.087 1.93.138.46.381.818.751 1.049zm.305-2.682c.093-.268.247-.463.518-.55l.232-.044c.615-.005.784.313.777.928-.083.038-.35.01-.467.01h-1.117c-.034-.086.03-.27.057-.347zm6.3982 1.087c-.247-.428-.784-.595-1.264-.792-.227-.094-.6-.172-.653-.435-.113-.564 1.045-.4 1.388-.316.096.023.317.11.378.03s.032-.27.032-.393c0-.101.013-.23-.027-.295-.059-.1-.215-.128-.336-.165a3.0161 3.0161 0 0 0-.964-.14l-.296.022a2.396 2.396 0 0 0-.538.144 1.223 1.223 0 0 0-.659.642c-.184.455-.01 1.058.265 1.28.33.266.777.417 1.2.59.215.088.458.138.504.394.122.697-1.196.444-1.59.342-.083-.022-.343-.11-.413-.072-.094.053-.057.317-.057.46 0 .083-.012.2.021.254.1.165.645.269.886.317.956.19 1.806-.134 2.113-.736.154-.291.182-.834.01-1.133zm-3.357 4.0871-.18.01a3.0931 3.0931 0 0 0-.5241.058 3.6181 3.6181 0 0 0-1.114.39c-.083.05-.412.211-.352.361.047.12.524.02.678.01.305-.02.454-.047.742-.046h.528a2.958 2.958 0 0 1 .472.03.702.702 0 0 1 .284.136c.12.103.098.452.057.616a11.4804 11.4804 0 0 1-.476 1.5541c-.034.082-.3.602-.005.54.133-.03.404-.33.487-.43.412-.528.672-1.134.865-1.896.045-.178.147-.874.046-1.036-.165-.269-1.037-.306-1.508-.297zm-.6431 1.483-.472.207-.78.2951c-.697.27-1.47.446-2.2451.638l-.907.17-1.067.14-.342.026c-.136.03-.297.012-.4501.036a6.8722 6.8722 0 0 1-1.02.042l-.772.005-.555-.02-.357-.02c-.082-.017-.18-.006-.27-.022l-1.0821-.119c-.32-.06-.665-.082-.97-.165l-.253-.042-.9411-.21c-.673-.21-1.341-.375-1.97-.617-.696-.27-1.4241-.564-2.0401-.928l-.61-.352c-.112-.066-.202-.164-.38-.164-.131.065-.171.15-.081.305a1.049 1.049 0 0 0 .238.233l.28.26c.404.32.81.65 1.248.937.38.247.783.457 1.18.69l.597.284c.34.15.694.305 1.05.445l.9181.305c.495.165 1.033.248 1.566.38l1.1241.163.362.027.612.046h.222a2.504 2.504 0 0 0 .653.006l.233-.006.285-.005.9741-.077c.437-.098.897-.083 1.31-.208l.954-.232a16.0985 16.0985 0 0 0 1.6731-.586 11.8764 11.8764 0 0 0 1.9471-1.036c.211-.142.51-.247.565-.544.047-.25-.21-.347-.427-.287z"/></svg>`,
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
    emulators: {
        name: "EMULATORS",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 416 416" fill="white" xml:space="preserve"><path d="M262.559 394.66c-13.331 6.45-26.31 12.762-39.31 19.03-4.693 2.262-5.261 1.798-5.554-3.393-.757-13.451-.43-26.951-1.187-40.369-.937-16.592-.336-33.227-1.845-49.776-.437-4.792-2.302-9.243-6.956-11.403-8.82-4.093-11.439-11.053-11.164-20.297.191-6.402-.873-12.868-1.702-19.264-.661-5.102.662-8.839 4.959-12.07 13.942-10.482 27.7-21.204 41.936-31.3 3.968-2.815 6.845-6.719 8.265-11.585 7.997-27.403 16.227-54.74 23.997-82.207 2.571-9.091-.45-17.59-6.127-24.73-5.778-7.27-12.182-14.064-18.592-20.799-3.639-3.824-6.114-7.894-5.574-13.286a2998 2998 0 0 1 3.44-32.6c.768-6.908 1.456-13.837 2.601-20.687 1.37-8.194 9.427-11.887 16.197-7.129 8.693 6.11 16.897 12.915 25.356 19.36 15.847 12.076 31.676 24.176 47.613 36.13 7.573 5.68 11.636 12.804 11.425 22.498-.453 20.91-2.247 41.721-3.925 62.55-.932 11.571-1.35 23.183-2.151 34.766-1.223 17.692-2.868 35.36-3.77 53.066-.574 11.268-1.37 22.512-2.181 33.76-1.347 18.68-2.683 37.36-3.897 56.047-.538 8.285-.923 16.586-1.075 24.885-.083 4.544-1.83 7.577-6.018 9.357-21.111 8.97-41.877 18.696-62.519 28.69-.59.286-1.264.403-2.242.755"/><path d="M144.711 256.055c12.467 2.295 24.494 4.66 36.599 6.528 4.894.755 7.021 3.052 6.998 7.807-.045 8.977 1.143 17.868 2.095 26.765.566 5.29 2.6 9.904 7.608 12.751 7.49 4.258 10.471 10.62 10.414 19.395-.128 19.953.227 39.923 1.016 59.86.32 8.107 1.77 16.136-.634 24.07-3.042.785-5.2-1.211-7.677-1.978-17.117-5.3-34.246-10.566-51.323-15.995-16.275-5.175-32.479-10.576-48.749-15.767-2.296-.733-2.946-2.07-3.374-4.274-1.88-9.691-.842-19.533-1.748-29.299-1.44-15.52-1.677-31.158-2.191-46.754-.274-8.296-4.668-13.572-11.592-17.171-6.007-3.123-8.143-8.183-8.522-14.666-.482-8.261-1.308-16.516-2.398-24.719-.33-2.488-.152-4.172 1.898-5.587 8.62-5.95 17.197-11.96 25.851-17.858 2.875-1.96 5.873-2.114 9.58.946-8.884 8.112-19.153 14.032-29.752 22.357 22.419 6.341 44.337 8.191 65.901 13.59m-13.393 63.668c-1.132 15.43 3.383 30.619 1.965 46.058-.488 5.316 1.897 8.42 7.001 9.862a1080 1080 0 0 1 26.22 7.775c6.536 2.027 8.3.978 8.186-5.833-.21-12.614-.68-25.224-.95-37.838-.107-4.974-.056-9.923-.988-14.867-.593-3.148-2.095-5.404-4.995-6.213-9.253-2.579-18.524-5.148-27.897-7.233-7.505-1.67-8.44-.602-8.542 8.29M209.796 21.68c9.657-1.354 19.013-1.005 28.156-2.822 2.822-.56 4.653.442 4.311 3.651-.772 7.242-1.623 14.475-2.454 21.71-1.152 10.028-2.725 20.03-3.326 30.09-.383 6.428 3.334 11.795 7.612 16.313 5.375 5.675 11.013 11.093 16.02 17.12 6.422 7.734 9.45 16.185 6.416 26.25-6.7 22.227-13.265 44.493-19.965 66.72-1.845 6.118-2.144 12.78-6.828 17.917-4.339 4.76-9.772 7.915-15.244 10.958-3.23 1.796-6.888-.128-10.233-.527-10.516-1.255-20.93-3.344-31.415-4.893-13.919-2.057-27.87-3.897-41.803-5.857-4.091-.576-8.171-1.229-12.252-1.876-2.522-.4-3.549-1.712-2.354-4.198 4.048-8.423 3.002-16.125-3.304-23.04-2.08-2.28-1.197-4.617-.4-7.008 5.04-15.124 10.09-30.245 15.106-45.376 5.255-15.852 2.396-24.893-10.315-35.554-5.595-4.692-10.457-10.26-15.643-15.44-3.568-3.564-3.67-8.111-3.114-12.599 1.428-11.496 3.127-22.959 4.693-34.439.47-3.441.137-6.932 1.176-10.365 2.229-7.364 9.195-9.765 15.079-4.828 2.587 2.17 5.392 3.302 8.668 3.075 7.934-.55 15.855-1.294 23.789-1.843 15.714-1.088 31.435-2.096 47.624-3.14m-63.97 163.418c-1.193 3.629-2.42 7.246-3.57 10.888-1.616 5.105.784 9.773 6.164 10.799 6.813 1.299 13.74 2.016 20.629 2.9 12.64 1.62 25.357 2.762 37.913 4.87 15.215 2.553 20.535-.378 24.28-13.146 5.887-20.068 11.816-40.124 17.675-60.2 2.74-9.394-1.156-14.819-11.026-14.845-20.298-.055-40.588-.142-60.875-1.008-8.534-.364-13.1 3.35-15.733 11.594a13009 13009 0 0 1-15.456 48.148m4.418-148.807c-7.83-.626-15.542 1.337-23.365 1.061-3.652-.128-5.253 1.874-5.63 5.51-.851 8.225-1.963 16.425-3.042 24.626-.774 5.877-.598 6.366 5.33 6.171 15.416-.507 30.835-1.395 46.236-1.742 17.44-.392 34.863-1.788 52.333-1.26 6.78.204 8.34-1.672 8.59-8.606.06-1.644.414-3.275.587-4.916.802-7.57 1.642-15.136 2.352-22.714.273-2.915-.665-4.098-4.113-3.481-5.529.989-11.223.745-16.848 1.23-13.207 1.139-26.544.943-39.703 2.414-7.268.813-14.65-.353-22.727 1.707"/><path d="M104.02 195.145c5.086-4.299 11.623-4.522 15.635-.87 4.039 3.679 4.4 10.451.815 15.333-3.668 4.997-.142 13.494 5.984 14.007 4.382.367 8.522.966 9.657 6.006.696 3.091-3.669 6.462-9.134 7.683-4.093.915-8.086 1.386-12.266.13-2.804-.844-4.882-2.126-5.654-4.97-.84-3.091 1.693-4.427 3.5-6.032 1.477-1.31 4.416-1.463 3.344-4.624-1.093-3.22-1.252-6.89-5.225-8.455-9.116-3.592-11.198-9.162-6.656-18.208m89.57 37.597c4.002.801 7.67 1.263 10.478 3.953 2.95 2.827 2.773 5.825-.411 8.37-7.903 6.314-24.285 4.838-30.895 1.024-4.151-2.395-3.801-6.863.217-9.493 6.223-4.073 13.144-4.125 20.612-3.854M150.389 336.88c-6.26.17-7.255-.761-7.692-6.481-.1-1.307-.552-2.587-.65-3.894-.185-2.492-1.603-5.788 2.238-6.523 3.342-.64 6.044 1.332 6.591 4.642.654 3.962 1.21 8.074-.487 12.257m8.371-12.854c2.447.851 5.816.133 6.143 3.003.458 4.036 2.503 8.113.871 12.175-1.095 2.727-7.18 2.123-8.152-1.154-1.349-4.545-2.39-9.496 1.138-14.024"/></svg>`,
    },
    gamevault: {
        name: "GAMEVAULT",
        gradient: "linear-gradient(135deg, #4F46AF 0%, #7165D6 100%)",
        // Rounded die faces with four/five pips and a padlock, using only three paths.
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 32 32" fill="white" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg"><path transform="matrix(.866 .5 -.866 .5 16 1)" d="M2 0h10q2 0 2 2v10q0 2-2 2H2q-2 0-2-2V2q0-2 2-2ZM2.75 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM8.75 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM2.75 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM8.75 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0Z"/><path transform="matrix(.866 .5 0 1 3.5 9.5)" d="M2 0h10q2 0 2 2v10q0 2-2 2H2q-2 0-2-2V2q0-2 2-2ZM3 6h1V4a3 3 0 0 1 6 0v2h1v6H3ZM5.5 6h3V4a1.5 1.5 0 0 0-3 0ZM6 9a1 1 0 1 1 1.5.87L8 11H6l.5-1.13A1 1 0 0 1 6 9Z"/><path transform="matrix(.866 -.5 0 1 17 16.5)" d="M2 0h10q2 0 2 2v10q0 2-2 2H2q-2 0-2-2V2q0-2 2-2ZM2.75 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM8.75 4a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM5.75 7a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM2.75 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0ZM8.75 10a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 1 0-2.5 0Z"/></svg>`,
    },
    sideloaded: {
        name: "SIDELOADED",
        gradient: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
        icon: `<svg class="icon-badge" width="${width}" height="${height}" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M11 3h2v9l3-3 1.5 1.5L12 16l-5.5-5.5L8 9l3 3ZM3 15h2v5h14v-5h2v7H3Z"/></svg>`,
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
function getBadgeIcon(gameStore, context, emulator) {
    if (gameStore === GameStoreName.EMULATORS && emulator && EMULATOR_BADGE_ICONS[emulator]) {
        return EMULATOR_BADGE_ICONS[emulator];
    }
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
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getCollectionHeadingStore(capsule, bigPicWindow) {
    try {
        const tabPanel = capsule.closest('div[role="tabpanel"]');
        if (!tabPanel)
            return undefined;
        const candidateElements = Array.from(tabPanel.querySelectorAll("h1, h2, h3, div, span")).filter((element) => {
            if (!(element instanceof HTMLElement))
                return false;
            if (element.closest('div[role="gridcell"], div[role="link"], button, a')) {
                return false;
            }
            const text = element.innerText?.trim();
            if (!text || text.length > 40)
                return false;
            return true;
        });
        const seenStores = new Set();
        for (const element of candidateElements) {
            const text = element.textContent?.trim();
            if (!text)
                continue;
            for (const [store, aliases] of Object.entries(storeMappings)) {
                for (const alias of aliases) {
                    const regex = new RegExp(`^${escapeRegExp(alias)}$`, "i");
                    if (regex.test(text)) {
                        const sanitized = sanitizedGameStoreName(store);
                        if (sanitized) {
                            seenStores.add(sanitized);
                        }
                    }
                }
            }
        }
        return seenStores.size === 1 ? [...seenStores][0] : undefined;
    }
    catch {
        return undefined;
    }
}
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
    let forcedCollectionStore;
    // If we can't find a Steam ID through any method (no artwork URL, no visible anchor tag, no fiber prop),
    // Native Steam games NEVER have a missing ID. So it is inherently a generic/blank non-Steam app.
    if (!appid) {
        if (context === GameStoreContext.LIBRARY) {
            forcedCollectionStore = getCollectionHeadingStore(capsule);
        }
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
    const cachedGameStoreName = forcedCollectionStore || sanitizedGameStoreName(getStore(appid)?.toLowerCase());
    const gameStoreName = sanitizedGameStoreName(cachedGameStoreName);
    const emulator = gameStoreName === GameStoreName.EMULATORS ? getEmulator(appid) : null;
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
        emulator ?? "",
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
            badge.getAttribute("data-emulator") !== (emulator ?? "") ||
            !existingBadge) {
            badge.innerHTML = getBadgeIcon(gameStoreName, effectiveContext, emulator);
            badge.setAttribute("data-store", gameStoreName);
            badge.setAttribute("data-emulator", emulator ?? "");
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
            badge.removeAttribute("data-emulator");
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
let retryTimeout = null;
let visibilityTimeout = null;
let backupScanTimeouts = new Set();
let lastViewSignature = "";
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
function scheduleBackupScans(delays) {
    backupScanTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    backupScanTimeouts.clear();
    delays.forEach((delay) => {
        const timeoutId = window.setTimeout(() => {
            backupScanTimeouts.delete(timeoutId);
            scanAndBadge();
        }, delay);
        backupScanTimeouts.add(timeoutId);
    });
}
let cachedWindow = null;
function getVisibleTextSignature(bigPicWindow) {
    const visiblePanels = Array.from(bigPicWindow.document.querySelectorAll('div[role="tabpanel"]')).filter((panel) => {
        if (!(panel instanceof HTMLElement))
            return false;
        return panel.offsetParent !== null;
    });
    const selectedTabs = Array.from(bigPicWindow.document.querySelectorAll('[aria-selected="true"], [aria-pressed="true"]'))
        .map((element) => element.textContent?.trim())
        .filter(Boolean)
        .slice(0, 5);
    const panelHeadings = visiblePanels
        .flatMap((panel) => Array.from(panel.querySelectorAll("h1, h2, h3, [role='heading']"))
        .map((element) => element.textContent?.trim())
        .filter(Boolean)
        .slice(0, 5))
        .slice(0, 8);
    const gridCounts = visiblePanels.map((panel) => panel.querySelectorAll('div[role="gridcell"], div[role="listitem"]').length);
    return JSON.stringify({
        tabs: selectedTabs,
        headings: panelHeadings,
        counts: gridCounts,
    });
}
function scheduleViewTransitionScans(bigPicWindow) {
    const nextSignature = getVisibleTextSignature(bigPicWindow);
    if (nextSignature === lastViewSignature)
        return;
    lastViewSignature = nextSignature;
    scheduleBackupScans([0, 300, 1000, 2000]);
}
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
    lastViewSignature = getVisibleTextSignature(bigPicWindow);
    // Set up MutationObserver for instant badge injection
    observer = new MutationObserver((mutations) => {
        const hasStructuralChanges = mutations.some((m) => m.addedNodes.length > 0 || m.removedNodes.length > 0);
        if (hasStructuralChanges) {
            scheduleViewTransitionScans(bigPicWindow);
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
    // Steam often finishes virtualized rendering shortly after the first observer tick.
    // Run a small burst of follow-up scans instead of a permanent polling loop.
    scheduleBackupScans([250, 1000, 2500]);
    // Visibility change listener
    visibilityDocument = bigPicWindow.document;
    visibilityChangeHandler = () => {
        if (!bigPicWindow.document.hidden) {
            if (visibilityTimeout) {
                clearTimeout(visibilityTimeout);
            }
            visibilityTimeout = window.setTimeout(() => {
                visibilityTimeout = null;
                scheduleViewTransitionScans(bigPicWindow);
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
    backupScanTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    backupScanTimeouts.clear();
    lastViewSignature = "";
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
    // Ensure styles are available in this window
    injectStyleIntoWindow(bigPicWindow);
    for (const { selector, context } of contexts) {
        const capsules = bigPicWindow.document.querySelectorAll(selector);
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

const context = GameStoreContext.DETAILS;
function GameDetailsBadge() {
    const settings = useSettings();
    const [steamAppId, setSteamAppId] = SP_REACT.useState(null);
    const [gameStore, setGameStore] = SP_REACT.useState(null);
    const [emulator, setEmulator] = SP_REACT.useState(null);
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
        setEmulator(null);
        setSteamAppId(null);
        log(context);
        (async () => {
            await ensureMappingsLoaded();
            if (cancelled)
                return;
            const store = getStore(appid);
            setEmulator(getEmulator(appid));
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
        : getBadgeIcon(gameStoreName, GameStoreContext.DETAILS, emulator);
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
