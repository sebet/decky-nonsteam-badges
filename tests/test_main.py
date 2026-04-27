import importlib
import io
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest import mock


def import_main():
    if "decky" not in sys.modules:
        logger = types.SimpleNamespace(
            info=lambda *args, **kwargs: None,
            warning=lambda *args, **kwargs: None,
            error=lambda *args, **kwargs: None,
        )
        sys.modules["decky"] = types.SimpleNamespace(
            DECKY_PLUGIN_SETTINGS_DIR="",
            logger=logger,
        )

    return importlib.import_module("main")


class PluginSettingsTests(unittest.TestCase):
    def test_load_and_save_setting_round_trip(self):
        main = import_main()

        with tempfile.TemporaryDirectory() as temp_dir:
            plugin = main.Plugin()
            plugin.settings_path = str(Path(temp_dir) / "settings.json")

            self.assertEqual(plugin._load_setting("missing", "fallback"), "fallback")

            plugin._save_setting("showSteamStoreButton", False)
            plugin._save_setting("libraryPosition", "top-left")

            self.assertFalse(plugin._load_setting("showSteamStoreButton", True))
            self.assertEqual(plugin._load_setting("libraryPosition"), "top-left")


class StoreMappingTests(unittest.TestCase):
    def test_get_games_mapping_prefers_localconfig_tags_over_launcher_paths(self):
        main = import_main()

        class FakeVdf:
            @staticmethod
            def load(_file):
                return {
                    "UserLocalConfigStore": {
                        "Software": {
                            "Valve": {
                                "Steam": {
                                    "apps": {
                                        "4294967295": {
                                            "tags": {
                                                "0": "GOG",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }

            @staticmethod
            def binary_load(_file):
                return {
                    "shortcuts": {
                        "0": {
                            "AppName": "Tagged Game",
                            "LaunchOptions": "run through epic",
                            "Exe": "",
                            "StartDir": "",
                            "appid": -1,
                        },
                        "1": {
                            "AppName": "Path Game",
                            "LaunchOptions": "",
                            "Exe": "/home/deck/Games/Ubisoft/game.exe",
                            "StartDir": "",
                            "appid": 123456789,
                        },
                        "2": {
                            "AppName": "Unknown Game",
                            "LaunchOptions": "",
                            "Exe": "",
                            "StartDir": "",
                            "appid": 987654321,
                        },
                    },
                }

        def fake_open(path, mode="r", *args, **kwargs):
            path = str(path)
            if path.endswith("localconfig.vdf"):
                return io.StringIO("")
            if path.endswith("store_mappings.json"):
                return io.StringIO(
                    json.dumps(
                        {
                            "gog": ["gog"],
                            "epic": ["epic"],
                            "ubisoft": ["ubisoft", "uplay"],
                        },
                    ),
                )
            if path.endswith("shortcuts.vdf"):
                return io.BytesIO(b"")
            raise FileNotFoundError(path)

        with (
            mock.patch.object(main, "vdf", FakeVdf),
            mock.patch.object(main.Plugin, "_find_localconfig_vdf", return_value="/fake/localconfig.vdf"),
            mock.patch.object(main.os, "listdir", return_value=["0", "123456"]),
            mock.patch.object(main.os.path, "exists", return_value=True),
            mock.patch("builtins.open", side_effect=fake_open),
        ):
            mapping = main.Plugin._get_games_mapping()

        self.assertEqual(
            mapping["4294967295"],
            {"store": "gog", "name": "Tagged Game"},
        )
        self.assertEqual(
            mapping["123456789"],
            {"store": "ubisoft", "name": "Path Game"},
        )
        self.assertEqual(
            mapping["987654321"],
            {"store": None, "name": "Unknown Game"},
        )

    def test_get_games_mapping_detects_store_from_launch_options_target_and_start_dir(self):
        main = import_main()

        class FakeVdf:
            @staticmethod
            def load(_file):
                return {
                    "UserLocalConfigStore": {
                        "Software": {
                            "Valve": {
                                "Steam": {
                                    "apps": {},
                                },
                            },
                        },
                    },
                }

            @staticmethod
            def binary_load(_file):
                return {
                    "shortcuts": {
                        "0": {
                            "AppName": "Launch Options Game",
                            "LaunchOptions": "--provider gog --skip-launcher",
                            "Exe": "",
                            "StartDir": "",
                            "appid": 111111111,
                        },
                        "1": {
                            "AppName": "Target Game",
                            "LaunchOptions": "",
                            "Exe": "/home/deck/Games/Epic/Game.exe",
                            "StartDir": "",
                            "appid": 222222222,
                        },
                        "2": {
                            "AppName": "StartDir Game",
                            "LaunchOptions": "",
                            "Exe": "/home/deck/Games/Game.exe",
                            "StartDir": "/home/deck/Games/Amazon Luna/Game",
                            "appid": 333333333,
                        },
                    },
                }

        def fake_open(path, mode="r", *args, **kwargs):
            path = str(path)
            if path.endswith("localconfig.vdf"):
                return io.StringIO("")
            if path.endswith("store_mappings.json"):
                return io.StringIO(
                    json.dumps(
                        {
                            "gog": ["gog"],
                            "epic": ["epic"],
                            "amazon": ["amazon", "luna"],
                        },
                    ),
                )
            if path.endswith("shortcuts.vdf"):
                return io.BytesIO(b"")
            raise FileNotFoundError(path)

        with (
            mock.patch.object(main, "vdf", FakeVdf),
            mock.patch.object(main.Plugin, "_find_localconfig_vdf", return_value="/fake/localconfig.vdf"),
            mock.patch.object(main.os, "listdir", return_value=["123456"]),
            mock.patch.object(main.os.path, "exists", return_value=True),
            mock.patch("builtins.open", side_effect=fake_open),
        ):
            mapping = main.Plugin._get_games_mapping()

        self.assertEqual(
            mapping["111111111"],
            {"store": "gog", "name": "Launch Options Game"},
        )
        self.assertEqual(
            mapping["222222222"],
            {"store": "epic", "name": "Target Game"},
        )
        self.assertEqual(
            mapping["333333333"],
            {"store": "amazon", "name": "StartDir Game"},
        )


if __name__ == "__main__":
    unittest.main()
