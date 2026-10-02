# Non-Steam Badges (Decky plugin)

A [Decky](https://github.com/SteamDeckHomebrew/decky-loader) plugin that helps identifying non-Steam games using themed badges.

## What does it do?

If like me, you keep collecting free games from _Epic_, _GOG_, _Amazon_, or _Rockstar_, or buy games from those and other stores, this plugin will help you easily identify which games on your Steam library are non-Steam games. It overlays a themed badge on non-Steam game capsules for supported storefronts. Other non-Steam games will display a custom non-Steam badge.

Since non-Steam games also lack a 'game info' tab, I also took the opportunity to add a "Steam Page" button to the game details screen (whenever applicable). It links directly to the Steam game page, to get the full game details. This button will (optionally) show up if a Steam game is properly identified.

## Features

- **Automated Identification**: Automatically detects which storefront a non-Steam game belongs to by analyzing its launch options and collection name.
- **Store Badges**: Displays themed badges for various storefronts:
  - **GOG**
  - **Epic Games**
  - **Amazon Games**
  - **Rockstar Games**
  - **Ubisoft**
  - **Xbox**
  - **Electronic Arts (EA)**
  - **itch.io**
  - **Emulators**
  - **GameVault**
  - **Sideloaded and custom installed games**
- **Fallback Badge**: Other non-Steam games outside the currently supported storefronts will display a custom non-Steam badge.
- **Steam Store Button**: (optionally) Adds a "Steam Page" button to the game details screen, allowing you to quickly visit the Steam Store page for your non-Steam games.
- **Seamless Integration**: Badges are injected into multiple areas:
  - **Home Carousel**
  - **Library Grid**
  - **Search Results**
  - **Game Details**
- **Configurable**:
  - **Badge Positions**: Customize where badges appear (Top/Bottom, Left/Right) or hide them entirely for specific views (Library/Search, Home, Details).
  - **Show Steam Store Button**: Toggle the "Steam Page" button on the game details screen.

## How It Works

The plugin identifies non-Steam games in this order:

1. **Collections**: Recognized collection names override automatic detection. A specific emulator collection, such as `Xenia`, takes priority over a storefront collection such as `Xbox`.
2. **Launchers**: Known emulator launchers are detected before generic storefront matches.
3. **Shortcut metadata**: Launch options, executable paths, and installation directories are checked for storefront matches.
4. **Fallback**: Unmatched games receive the generic non-Steam badge.

[Unifideck](https://github.com/mubaraknumann/unifideck) usually supplies the collections and launch metadata automatically. For manually added games, use a collection such as `GOG`, `Epic`, `Amazon`, `Ubisoft`, `Xbox`, `itch.io`, `GameVault`, or `Sideloaded`.

For emulated games, use `Emulators` for the generic badge or a supported emulator name, such as `RetroArch`, `Dolphin`, `PCSX2`, `RPCS3`, `Xenia`, or `xemu`, to select its badge.

## Screenshots

### Home Carousel

<img alt="Home Carousel" src="https://github.com/user-attachments/assets/e0c3e041-8a7f-4a3c-afa2-10270cb79160" />

### Search

<img alt="Search" src="https://github.com/user-attachments/assets/684eac4c-a7c9-4687-8551-b94aeb29535c" />

### Detail

<img alt="Detail" src="https://github.com/user-attachments/assets/c982c6c6-3da8-4aa6-a808-bee564ee6efb" />

### Library Collection

<img alt="Library" src="https://github.com/user-attachments/assets/09ba15cc-2180-4ffb-ba0b-7fabaa6fae06" />

### Non-Steam Library Collection

<img alt="Non-Steam Library" src="https://github.com/user-attachments/assets/de8f34d9-39d3-49c8-a252-65bb7765ec8e" />

### Settings

<img alt="Settings" height="450px" src="https://github.com/user-attachments/assets/028913d2-babd-4e0a-8a99-983468cb225d" />

## Installation

### Decky Loader

1. Download the latest release from the [Releases page](https://github.com/sebet/decky-nonsteam-badges/releases)
2. Ensure you have [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) installed.
3. Open Decky Loader and navigate to the "Settings > General > Enable Developer Mode".
4. Open Developer Mode and click "Install Plugin from ZIP file".
