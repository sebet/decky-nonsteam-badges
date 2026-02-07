# Non-Steam Badges (Decky plugin)

A [Decky](https://github.com/SteamDeckHomebrew/decky-loader) plugin that helps identifying non-Steam games using themed badges.

## What does it do?

If like me, you keep collecting free games from _Epic_, _GOG_ and _Amazon Luna_, or buy games from those, or other stores, this plugin will help you easily identify which games on your Steam library are non-Steam games. It overlays a themed badge on non-Steam games capsules for _Epic_, _GOG_ or _Amazon Luna_ games. Other non-Steam games will display a custom non-Steam badge.

Since non-Steam games also lack a 'game info' tab, I also took the opportunity to add a "Steam Page" button to the game details screen (whenever applicable). It links directly to the Steam game page, to get the full game details. This button will (optionally) show up if a Steam game is properly identified.

## Features

- **Automated Identification**: Automatically detects which storefront a non-Steam game belongs to by analyzing its launch options and collection name.
- **Store Badges**: Displays themed badges for various storefronts:
  - **GOG**
  - **Epic Games**
  - **Amazon Luna**
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

Non-Steam Badges works by scanning your Steam games collection. It looks for common patterns in launcher options and collection names (like `gog`, `epic`, or `amazon`) and maps these to the correct storefront.
If it finds matches, it overlays the relevant badge. If there are no matches, it overlays a custom non-Steam badge.

**Matching rules priority:**

The plugin will look for storefront matches on:

1. **Launch Options**
2. **Collection Name**

If you use [Unifideck](https://github.com/mubaraknumann/unifideck), you shouldn't need any additional steps, since Unifideck already adds the correct collection names for non-Steam games as well as launch options.
If you add non-Steam games to your Steam library manually or through the [Heroic Games Launcher](https://heroicgameslauncher.com/), you just need to add the correct collection names, for the plugin to identify it (i.e: `gog`, `epic`, `amazon`, or `luna`).

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

## Installation

### Decky Loader

1. Download the latest release from the [Releases page](https://github.com/sebet/decky-nonsteam-badges/releases)
2. Ensure you have [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader) installed.
3. Open Decky Loader and navigate to the "Settings > General > Enable Developer Mode".
4. Open Developer Mode and click "Install Plugin from ZIP file".
