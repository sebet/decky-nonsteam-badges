import os
import json
import urllib.request
from pathlib import Path
import sys

# Add py_modules to path for local vdf library
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'py_modules'))

# VDF library for parsing Steam's binary VDF files
try:
    import vdf
except ImportError:
    vdf = None

# Decky plugin imports
import decky

class Plugin:
    """Main plugin class"""

    async def _main(self):
        """Plugin initialization"""
        # Initialize settings file path
        self.settings_path = os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "settings.json")

        # Load debug mode from .env
        self.debug_mode = False
        try:
            env_path = os.path.join(os.path.dirname(__file__), ".env")
            if os.path.exists(env_path):
                with open(env_path, "r") as f:
                    for line in f:
                        if line.strip().upper().startswith("DEBUG_MODE="):
                            value = line.split("=")[1].strip().lower()
                            self.debug_mode = (value == "true")
                            break
            # Diagnostic log (Unconditional)
            decky.logger.info(f"Diagnostics: env_path={env_path}, exists={os.path.exists(env_path)}, debug_mode={self.debug_mode}")

        except Exception as e:
            decky.logger.error(f"Error reading .env: {e}")

        if getattr(self, "debug_mode", False):
            decky.logger.info(f"NonSteam Badges initialized - Debug Mode: {self.debug_mode}")

    def _load_setting(self, key: str, default=None):
        """Load a setting from the JSON file"""
        try:
            if hasattr(self, 'settings_path') and os.path.exists(self.settings_path):
                with open(self.settings_path, 'r') as f:
                    settings = json.load(f)
                    return settings.get(key, default)
        except Exception:
            pass
        return default

    def _save_setting(self, key: str, value):
        """Save a setting to the JSON file"""
        try:
            if not hasattr(self, 'settings_path'):
                return

            settings = {}
            if os.path.exists(self.settings_path):
                with open(self.settings_path, 'r') as f:
                    settings = json.load(f)

            settings[key] = value

            # Ensure directory exists
            os.makedirs(os.path.dirname(self.settings_path), exist_ok=True)

            with open(self.settings_path, 'w') as f:
                json.dump(settings, f)
        except Exception:
            pass

    @staticmethod
    def _find_shortcuts_vdf() -> str | None:
        """Find the shortcuts.vdf file for the current user"""
        try:
            base_path = Path("/home/deck/.steam/steam/userdata/")

            if not base_path.exists():
                decky.logger.warning("Steam userdata directory not found")
                return None

            # Find the first user directory (filter out '0', 'ac', 'anonymous')
            user_folders = [f for f in os.listdir(base_path) if f.isdigit() and f != '0']

            if not user_folders:
                decky.logger.warning("No user folders found")
                return None

            shortcuts_file = base_path / user_folders[0] / "config" / "shortcuts.vdf"
            if shortcuts_file.exists():
                return str(shortcuts_file)

            decky.logger.warning("shortcuts.vdf not found")
            return None
        except Exception as e:
            decky.logger.error(f"Error finding shortcuts.vdf: {e}")
            return None

    @staticmethod
    def _find_localconfig_vdf() -> str | None:
        """Find the localconfig.vdf file for the current user"""
        try:
            base_path = Path("/home/deck/.steam/steam/userdata/")

            if not base_path.exists():
                return None

            # Find the first user directory (filter out '0', 'ac', 'anonymous')
            user_folders = [f for f in os.listdir(base_path) if f.isdigit() and f != '0']

            if not user_folders:
                return None

            localconfig_file = base_path / user_folders[0] / "config" / "localconfig.vdf"
            if localconfig_file.exists():
                return str(localconfig_file)

            return None
        except Exception as e:
            decky.logger.error(f"Error finding localconfig.vdf: {e}")
            return None

    @staticmethod
    def _get_games_mapping() -> dict:
        """
        Build a mapping of AppID to store keys from shortcuts.vdf
        Returns: { 'appid_string': 'store' }
        """
        mapping = {}
        base_path = "/home/deck/.steam/steam/userdata/"

        try:
            if vdf is None:
                decky.logger.error("vdf library not available")
                return {}

            # Filter out '0', 'ac', and 'anonymous' to find the real user ID
            user_folders = [f for f in os.listdir(base_path) if f.isdigit() and f != '0']

            if not user_folders:
                return {}

            # Load localconfig tags first
            local_tags = {}
            localconfig_path = Plugin._find_localconfig_vdf()
            if localconfig_path:
                try:
                    with open(localconfig_path, "r", encoding="utf-8") as f:
                        # localconfig is text vdf
                        lc_data = vdf.load(f)
                        apps = lc_data.get('UserLocalConfigStore', {}).get('Software', {}).get('Valve', {}).get('Steam', {}).get('apps', {})
                        for appid, app_data in apps.items():
                            tags = app_data.get('tags', {})
                            if tags:
                                # tags is usually a dict { "0": "TagName" } or list
                                if isinstance(tags, dict):
                                    local_tags[str(appid)] = list(tags.values())
                                elif isinstance(tags, list):
                                    local_tags[str(appid)] = tags
                except Exception as e:
                    decky.logger.error(f"Error parsing localconfig.vdf: {e}")

            vdf_path = os.path.join(base_path, user_folders[0], "config/shortcuts.vdf")

            if not os.path.exists(vdf_path):
                return {}

            with open(vdf_path, "rb") as f:
                # Load the binary VDF data
                data = vdf.binary_load(f)
                shortcuts = data.get('shortcuts', {})

                for index, entry in shortcuts.items():
                    name = entry.get('AppName', "")
                    # Unifideck puts the store info in LaunchOptions
                    opts = entry.get('LaunchOptions', "").lower()
                    vdf_appid = entry.get('appid')

                    if vdf_appid is None:
                        continue

                    # Handle signed/unsigned conversion (Steam uses signed 32-bit in VDF)
                    if vdf_appid < 0:
                        vdf_appid_unsigned = vdf_appid & 0xFFFFFFFF
                    else:
                        vdf_appid_unsigned = vdf_appid

                    store = None

                    if "gog" in opts:
                        store = "gog"
                    elif "epic" in opts:
                        store = "epic"
                    elif "amazon" in opts or "luna" in opts:
                        store = "amazon"

                    if store:
                        mapping[str(vdf_appid_unsigned)] = {"store": store, "name": name}
                    else:
                        mapping[str(vdf_appid_unsigned)] = {"store": None, "name": name}

            return mapping
        except Exception as e:
            decky.logger.error(f"Error building games mapping: {e}")
            return {}

    async def get_all_store_mappings(self) -> dict:
        """
        Get all game-to-store mappings at once for better performance.
        Returns a dictionary mapping AppID strings to store identifiers.
        """
        try:
            mapping = Plugin._get_games_mapping()
            return mapping
        except Exception as e:
            decky.logger.error(f"Error getting all store mappings: {e}")
            import traceback
            decky.logger.error(traceback.format_exc())
            return {}

    async def search_steam_id(self, game_name: str) -> str | None:
        """
        Search Steam Store API for a game name and return the App ID.
        Includes fallback logic for "Edition", "Remaster", etc.
        """
        import urllib.parse
        import urllib.request
        import json
        import difflib
        import ssl

        def fetch_and_check(search_term: str) -> str | None:
            try:
                encoded_name = urllib.parse.quote(search_term)
                url = f"https://store.steampowered.com/api/storesearch/?term={encoded_name}&l=english&cc=US"

                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }

                req = urllib.request.Request(url, headers=headers, method='GET')
                context = ssl._create_unverified_context()

                with urllib.request.urlopen(req, context=context) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    items = result.get('items', [])

                    if getattr(self, "debug_mode", False):
                        decky.logger.info(f"Steam hits for '{search_term}': {len(items)}")

                    if len(items) == 0:
                      decky.logger.info(f"No Steam hits for '{search_term}'")
                      decky.logger.info(f"URL: {url}")

                    if items:
                        # Check the top hit for similarity
                        top_hit = items[0]
                        hit_name = top_hit.get('name', '')
                        appid = str(top_hit.get('id', ''))

                        # Calculate similarity ratio
                        repo_name_clean = hit_name.lower()
                        query_name_clean = search_term.lower()

                        ratio = difflib.SequenceMatcher(None, repo_name_clean, query_name_clean).ratio()
                        if getattr(self, "debug_mode", False):
                            decky.logger.info(f"Similarity check: '{search_term}' vs '{hit_name}' = {ratio:.2f}")

                        # Threshold (0.6 should be a decent fuzzy match)
                        if ratio > 0.6 or query_name_clean in repo_name_clean or repo_name_clean in query_name_clean:
                            if getattr(self, "debug_mode", False):
                                decky.logger.info(f"Found Steam App ID for '{search_term}' ({hit_name}): {appid}")
                            return appid
                        else:
                            decky.logger.warning(f"Rejected search result due to low similarity: '{search_term}' vs '{hit_name}' ({ratio:.2f})")
            except Exception as e:
                decky.logger.error(f"Error executing Steam search for '{search_term}': {e}")

            return None

        # 1. Try exact/original match first
        result = fetch_and_check(game_name)
        if result:
            return result

        # 2. If rejected/not found, try stripping suffixes
        separators = [" - ", " Edition", " Remaster", " Special", " Game of the Year"]
        new_name = game_name

        for sep in separators:
            # " - " is common. "Game of the Year Edition"
            if sep.lower() in new_name.lower():
                # Split and take first part
                # Find index case-insensitive
                idx = new_name.lower().find(sep.lower())
                if idx != -1:
                    new_name = new_name[:idx].strip()

        if new_name != game_name and len(new_name) > 2:
            if getattr(self, "debug_mode", False):
                decky.logger.info(f"Retrying search with refined name: '{new_name}'")
            return fetch_and_check(new_name)

        return None

    async def _unload(self):
        """Plugin cleanup"""
        pass

    async def _uninstall(self):
        """Plugin uninstall"""
        pass
