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


class EmulatorLauncherTests(unittest.TestCase):
    def test_known_launchers_and_common_packaging(self):
        main = import_main()
        for launcher in main.EMULATOR_LAUNCHERS:
            with self.subTest(launcher=launcher):
                self.assertTrue(main._is_emulator_launcher(f'/apps/{launcher}', ''))
        for exe, options in (
            ('"C:\\Emulators\\Xenia\\xenia_canary.exe"', ''),
            ('/apps/PCSX2-Qt-v2.6.3.AppImage', ''),
            ('/usr/bin/flatpak', 'run org.libretro.RetroArch'),
            ('/usr/bin/flatpak', 'run org.DolphinEmu.dolphin-emu'),
            ('/usr/bin/proton', '"/apps/xenia_canary.exe" "/games/xbox/game.iso"'),
            ('/usr/bin/bash', '"/tools/launchers/duckstation.sh" "/games/game.chd"'),
        ):
            with self.subTest(exe=exe, options=options):
                self.assertTrue(main._is_emulator_launcher(exe, options))

    def test_rejects_folder_names_rom_titles_and_file_manager(self):
        main = import_main()
        for exe, options in (
            ('/usr/bin/dolphin', ''),
            ('/games/xenia/game.exe', ''),
            ('/games/xbox/myxenia.exe', ''),
            ('/games/game.exe', '"/games/retroarch/game.iso"'),
            ('/games/game.exe', '"/games/PCSX2.iso"'),
            ('/games/game.exe', '"/games/pcsx2-v2.iso"'),
            ('/games/my.xemu.exe', ''),
            ('/games/game.exe', ''),
        ):
            with self.subTest(exe=exe, options=options):
                self.assertFalse(main._is_emulator_launcher(exe, options))


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

    def test_added_badge_aliases_and_collection_priority(self):
        main = import_main()
        real_open = open
        shortcuts = {
            "0": {"appid": 111111111, "AppName": "Collection", "Exe": "/games/epic/game.exe"},
            "1": {"appid": 222222222, "AppName": "Options", "LaunchOptions": "--category emu"},
            "2": {"appid": 333333333, "AppName": "Target", "Exe": "/games/roms/game"},
            "3": {"appid": 444444444, "AppName": "Directory", "StartDir": "/games/retro"},
            "4": {"appid": 555555555, "AppName": "No substring match", "Exe": "/games/premium/game"},
            "5": {"appid": 666666666, "AppName": "Store override", "StartDir": "/games/roms"},
        }
        shortcuts.update({
            "6": {"appid": 777777777, "LaunchOptions": "gamevault:123"},
            "7": {"appid": 888888888, "Exe": "/games/side-loaded/game"},
            "8": {"appid": 999999999, "Exe": "/games/pirated/game"},
            "9": {"appid": 121212121, "LaunchOptions": "gamevault:456"},
            "10": {"appid": 131313131, "Exe": '"/emulators/xenia/xenia.exe"', "LaunchOptions": '"/roms/xbox/game.iso"'},
            "11": {"appid": 141414141, "Exe": "/usr/bin/proton", "LaunchOptions": '"/emulators/xenia_canary.exe" "/roms/xbox/game.iso"'},
            "12": {"appid": 151515151, "Exe": "/emulators/xenia-canary.exe", "StartDir": "/games/xbox"},
            "13": {"appid": 161616161, "Exe": "/games/xbox/game.exe"},
            "14": {"appid": 171717171, "Exe": "/games/xbox/myxenia.exe"},
            "15": {"appid": 181818181, "Exe": "/emulators/xenia_canary.exe", "LaunchOptions": '"/roms/xbox/game.iso"'},
            "16": {"appid": 191919191, "Exe": "/apps/xemu", "StartDir": "/games/xbox"},
            "17": {"appid": 202020202, "Exe": "/usr/bin/flatpak", "LaunchOptions": "run org.libretro.RetroArch /games/xbox/game.iso"},
            "18": {"appid": 212121212, "Exe": "/apps/PCSX2-Qt-v2.6.3.AppImage"},
            "19": {"appid": 222222223, "Exe": "/usr/bin/flatpak", "LaunchOptions": "run org.DolphinEmu.dolphin-emu /games/game.iso"},
            "20": {"appid": 232323232, "Exe": "/apps/rpcs3"},
            "21": {"appid": 242424242, "Exe": "/apps/duckstation"},
            "22": {"appid": 252525252, "Exe": "/apps/unifideck-launcher", "LaunchOptions": "microsoft:1234"},
        })
        apps = {
            "121212121": {"tags": {"0": "Sideloaded"}},
            "181818181": {"tags": {"0": "Xbox"}},
            "212121212": {"tags": {"0": "Emulators"}},
            "252525252": {"tags": {"0": "Xbox", "1": "Xenia"}},
            "111111111": {"tags": {"0": "Emulators"}},
            "666666666": {"tags": {"0": "GOG"}},
        }
        fake_vdf = types.SimpleNamespace(
            load=lambda _file: {"UserLocalConfigStore": {"Software": {"Valve": {"Steam": {"apps": apps}}}}},
            binary_load=lambda _file: {"shortcuts": shortcuts},
        )

        for use_fallback in (False, True):
            with self.subTest(use_fallback=use_fallback):
                def fake_open(path, mode="r", *args, **kwargs):
                    if str(path).endswith("store_mappings.json"):
                        if use_fallback:
                            raise FileNotFoundError(path)
                        return real_open(path, mode, *args, **kwargs)
                    return io.BytesIO(b"") if "b" in mode else io.StringIO("")

                with (
                    mock.patch.object(main, "vdf", fake_vdf),
                    mock.patch.object(main.Plugin, "_find_shortcuts_vdf", return_value="/fake/shortcuts.vdf"),
                    mock.patch.object(main.Path, "is_file", return_value=True),
                    mock.patch("builtins.open", side_effect=fake_open),
                ):
                    mapping = main.Plugin._get_games_mapping()

                for appid in (111111111, 222222222, 333333333, 444444444):
                    self.assertEqual(mapping[str(appid)]["store"], "emulators")
                self.assertIsNone(mapping["555555555"]["store"])
                self.assertEqual(mapping["666666666"]["store"], "gog")
                self.assertEqual(mapping["777777777"]["store"], "gamevault")
                self.assertEqual(mapping["888888888"]["store"], "sideloaded")
                self.assertIsNone(mapping["999999999"]["store"])
                self.assertEqual(mapping["121212121"]["store"], "sideloaded")
                for appid in (131313131, 141414141, 151515151, 191919191, 202020202):
                    self.assertEqual(mapping[str(appid)]["store"], "emulators")
                for appid in (131313131, 141414141, 151515151):
                    self.assertEqual(mapping[str(appid)]["emulator"], "xenia")
                self.assertEqual(mapping["191919191"]["emulator"], "xemu")
                self.assertEqual(mapping["202020202"]["emulator"], "retroarch")
                self.assertEqual(mapping["212121212"]["emulator"], "pcsx2")
                self.assertEqual(mapping["222222223"]["emulator"], "dolphin")
                self.assertEqual(mapping["232323232"]["emulator"], "rpcs3")
                self.assertEqual(mapping["242424242"]["store"], "emulators")
                self.assertNotIn("emulator", mapping["242424242"])
                self.assertNotIn("emulator", mapping["181818181"])
                self.assertEqual(mapping["252525252"]["store"], "emulators")
                self.assertEqual(mapping["252525252"]["emulator"], "xenia")
                for appid in (161616161, 171717171, 181818181):
                    self.assertEqual(mapping[str(appid)]["store"], "xbox")

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
