import io
import json
import types
import unittest
from unittest import mock

from test_main import import_main


class MappingRegressionTests(unittest.TestCase):
    def get_mapping(self, shortcut, tags=()):
        main = import_main()
        appid = 3000000000
        shortcut = {"appid": appid, "AppName": "Regression fixture", **shortcut}
        apps = {str(appid): {"tags": dict(enumerate(tags))}}
        fake_vdf = types.SimpleNamespace(
            load=lambda _: {"UserLocalConfigStore": {"Software": {"Valve": {"Steam": {"apps": apps}}}}},
            binary_load=lambda _: {"shortcuts": {"0": shortcut}},
        )

        def fake_open(path, mode="r", *args, **kwargs):
            if str(path).endswith("store_mappings.json"):
                return io.StringIO(
                    json.dumps(
                        {
                            "gog": ["gog"],
                            "epic": ["epic"],
                            "battlenet": ["battle.net", "battlenet", "blizzard entertainment"],
                            "xbox": ["xbox", "microsoft"],
                        }
                    )
                )
            return io.BytesIO(b"") if "b" in mode else io.StringIO("")

        with (
            mock.patch.object(main, "vdf", fake_vdf),
            mock.patch.object(main.Plugin, "_find_shortcuts_vdf", return_value="/fake/shortcuts.vdf"),
            mock.patch.object(main.Path, "is_file", return_value=True),
            mock.patch("builtins.open", side_effect=fake_open),
        ):
            mapping = main.Plugin._get_games_mapping()
        return mapping[str(appid)]

    def test_numbered_storefront_collections_keep_priority(self):
        for collection, expected, conflicting_exe in (
            ("GOG 2026", "gog", "/games/epic/game.exe"),
            ("Epic 2025", "epic", "/games/gog/game.exe"),
        ):
            with self.subTest(collection=collection):
                entry = self.get_mapping({"Exe": conflicting_exe}, [collection])
                self.assertEqual(entry["store"], expected)

    def test_numbered_storefront_launch_metadata_still_matches(self):
        for alias, expected in (("gog", "gog"), ("epic", "epic")):
            for field, value in (
                ("LaunchOptions", f"--provider {alias} 2026"),
                ("Exe", f"/games/{alias} 2026/game.exe"),
                ("StartDir", f"/games/{alias} 2026"),
            ):
                with self.subTest(alias=alias, field=field):
                    self.assertEqual(self.get_mapping({field: value})["store"], expected)

    def test_battlenet_launcher_aliases_are_detected(self):
        for field, value in (
            ("LaunchOptions", "battlenet://launch/123"),
            ("Exe", "/games/Battle.net/Battle.net.exe"),
            ("StartDir", "/games/Blizzard Entertainment/Game"),
        ):
            with self.subTest(field=field, value=value):
                self.assertEqual(self.get_mapping({field: value})["store"], "battlenet")

    def test_battlenet_aliases_do_not_match_partial_words(self):
        for field, value in (
            ("LaunchOptions", "--battle-pass"),
            ("Exe", "/games/mybattlenet/game.exe"),
        ):
            with self.subTest(field=field, value=value):
                self.assertIsNone(self.get_mapping({field: value})["store"])

    def test_emulator_executable_variants_remain_recognized(self):
        main = import_main()
        # Keep this explicit: deriving cases from the implementation would hide
        # a regression when an alias is removed from its supported launchers.
        for executable in (
            "pcsx2", "pcsx2-qt", "PCSX2-Qt-v2.6.3.AppImage",
            "xenia", "xenia_canary.exe", "xenia-canary.exe",
            "duckstation", "duckstation-qt", "duckstation-qt.AppImage",
            "duckstation-qt-v0.1.AppImage",
            "PPSSPP", "PPSSPPQt", "ppssppqt.AppImage",
            "ppssppqt-v1.18.1.AppImage",
        ):
            with self.subTest(executable=executable):
                self.assertTrue(main._is_emulator_launcher(f"/apps/{executable}", ""))

    def test_emulator_executable_variants_select_the_canonical_badge(self):
        for expected, executables in (
            ("pcsx2", ("pcsx2", "pcsx2-qt", "PCSX2-Qt-v2.6.3.AppImage")),
            ("xenia", ("xenia", "xenia_canary.exe", "xenia-canary.exe")),
            ("duckstation", (
                "duckstation", "duckstation-qt", "duckstation-qt.AppImage",
                "duckstation-qt-v0.1.AppImage",
            )),
            ("ppsspp", (
                "PPSSPP", "PPSSPPQt", "ppssppqt.AppImage",
                "ppssppqt-v1.18.1.AppImage",
            )),
        ):
            for executable in executables:
                with self.subTest(executable=executable, expected=expected):
                    entry = self.get_mapping({"Exe": f"/apps/{executable}"})
                    self.assertEqual(entry["store"], "emulators")
                    self.assertEqual(entry.get("emulator"), expected)

    def test_xbox_console_labels_are_not_storefront_matches(self):
        for collection in ("Xbox 360", "Xbox360"):
            with self.subTest(collection=collection):
                self.assertIsNone(self.get_mapping({}, [collection])["store"])
        self.assertEqual(self.get_mapping({}, ["Xbox"])["store"], "xbox")

    def test_launcher_variants_are_not_separate_emulator_identities(self):
        main = import_main()
        for variant in (
            "pcsx2-qt",
            "duckstation-qt",
            "ppssppqt",
            "xeniaqt",
            "xenia_canary",
            "xenia-canary",
        ):
            with self.subTest(variant=variant):
                self.assertNotIn(variant, main.EMULATOR_ICON_NAMES)
        for exe in ("/apps/xeniaqt",):
            with self.subTest(exe=exe):
                self.assertIsNone(main._get_emulator_launcher(exe, ""))

    def test_separated_variant_collections_select_the_canonical_emulator(self):
        for collection, expected in (
            ("PCSX2-Qt", "pcsx2"),
            ("DuckStation-Qt", "duckstation"),
            ("Xenia Canary", "xenia"),
        ):
            with self.subTest(collection=collection):
                entry = self.get_mapping({}, [collection])
                self.assertEqual(entry["store"], "emulators")
                self.assertEqual(entry.get("emulator"), expected)
        for collection in ("xeniaqt",):
            with self.subTest(collection=collection):
                self.assertIsNone(self.get_mapping({}, [collection])["store"])
