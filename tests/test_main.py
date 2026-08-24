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
            DECKY_USER_HOME="",
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
    def test_finds_config_files_from_decky_user_home(self):
        main = import_main()

        for relative_userdata in (
            Path(".steam/steam/userdata"),
            Path(".local/share/Steam/userdata"),
        ):
            with self.subTest(relative_userdata=relative_userdata):
                with tempfile.TemporaryDirectory() as temp_dir:
                    config_dir = (
                        Path(temp_dir) / relative_userdata / "123456" / "config"
                    )
                    config_dir.mkdir(parents=True)
                    shortcuts = config_dir / "shortcuts.vdf"
                    localconfig = config_dir / "localconfig.vdf"
                    shortcuts.touch()
                    localconfig.touch()

                    with mock.patch.object(main.decky, "DECKY_USER_HOME", temp_dir):
                        self.assertEqual(
                            main.Plugin._find_shortcuts_vdf(), str(shortcuts)
                        )
                        self.assertEqual(
                            main.Plugin._find_localconfig_vdf(), str(localconfig)
                        )

    def test_ignores_non_user_userdata_directories(self):
        main = import_main()

        with tempfile.TemporaryDirectory() as temp_dir:
            userdata = Path(temp_dir) / ".steam" / "steam" / "userdata"
            for directory in ("0", "ac", "anonymous"):
                config_dir = userdata / directory / "config"
                config_dir.mkdir(parents=True)
                (config_dir / "shortcuts.vdf").touch()

            with mock.patch.object(main.decky, "DECKY_USER_HOME", temp_dir):
                self.assertIsNone(main.Plugin._find_shortcuts_vdf())

    def test_does_not_mix_config_files_between_steam_accounts(self):
        main = import_main()

        with tempfile.TemporaryDirectory() as temp_dir:
            userdata = Path(temp_dir) / ".steam" / "steam" / "userdata"
            shortcut_config = userdata / "111111" / "config"
            other_config = userdata / "222222" / "config"
            shortcut_config.mkdir(parents=True)
            other_config.mkdir(parents=True)
            (shortcut_config / "shortcuts.vdf").touch()
            (other_config / "localconfig.vdf").touch()

            with mock.patch.object(main.decky, "DECKY_USER_HOME", temp_dir):
                self.assertEqual(
                    main.Plugin._find_shortcuts_vdf(),
                    str(shortcut_config / "shortcuts.vdf"),
                )
                self.assertIsNone(main.Plugin._find_localconfig_vdf())

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
                            "Exe": "/games/Ubisoft/game.exe",
                            "StartDir": "",
                            "appid": 123456789,
                        },
                        "2": {
                            "AppName": "Rockstar Game",
                            "LaunchOptions": "",
                            "Exe": "/games/Rockstar Games/Launcher.exe",
                            "StartDir": "",
                            "appid": 444444444,
                        },
                        "3": {
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
                            "rockstar": ["rockstar", "rockstar games", "rockstargames", "social club"],
                            "ubisoft": ["ubisoft", "uplay"],
                        },
                    ),
                )
            if path.endswith("shortcuts.vdf"):
                return io.BytesIO(b"")
            raise FileNotFoundError(path)

        with (
            mock.patch.object(main, "vdf", FakeVdf),
            mock.patch.object(
                main.Plugin,
                "_find_shortcuts_vdf",
                return_value="/fake/shortcuts.vdf",
            ),
            mock.patch.object(main.Path, "is_file", return_value=True),
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
            mapping["444444444"],
            {"store": "rockstar", "name": "Rockstar Game"},
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
                            "Exe": "/games/Epic/Game.exe",
                            "StartDir": "",
                            "appid": 222222222,
                        },
                        "2": {
                            "AppName": "StartDir Game",
                            "LaunchOptions": "",
                            "Exe": "/games/Game.exe",
                            "StartDir": "/games/Amazon Luna/Game",
                            "appid": 333333333,
                        },
                        "3": {
                            "AppName": "Social Club Game",
                            "LaunchOptions": "--launcher social club",
                            "Exe": "",
                            "StartDir": "",
                            "appid": 444444444,
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
                            "rockstar": ["rockstar", "rockstar games", "rockstargames", "social club"],
                        },
                    ),
                )
            if path.endswith("shortcuts.vdf"):
                return io.BytesIO(b"")
            raise FileNotFoundError(path)

        with (
            mock.patch.object(main, "vdf", FakeVdf),
            mock.patch.object(
                main.Plugin,
                "_find_shortcuts_vdf",
                return_value="/fake/shortcuts.vdf",
            ),
            mock.patch.object(main.Path, "is_file", return_value=True),
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
        self.assertEqual(
            mapping["444444444"],
            {"store": "rockstar", "name": "Social Club Game"},
        )


if __name__ == "__main__":
    unittest.main()
