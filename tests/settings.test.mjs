import test from 'node:test';
import assert from 'node:assert/strict';
import { getSettings, saveSettings } from '../.test-dist/utils/settings.js';
import {
  BadgePosition,
  DEFAULT_SETTINGS,
  SETTINGS_CHANGED_EVENT,
  SupportedStores,
} from '../.test-dist/types/settings.js';

function createLocalStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value));
    },
    removeItem: (key) => {
      store.delete(key);
    },
    _store: store,
  };
}

function withBrowserGlobals(fn) {
  const originalLocalStorage = globalThis.localStorage;
  const originalWindow = globalThis.window;
  const originalCustomEvent = globalThis.CustomEvent;
  const localStorage = createLocalStorage();
  const events = [];

  globalThis.localStorage = localStorage;
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  };
  globalThis.window = {
    dispatchEvent(event) {
      events.push(event);
      return true;
    },
  };

  try {
    return fn({ localStorage, events });
  } finally {
    globalThis.localStorage = originalLocalStorage;
    globalThis.window = originalWindow;
    globalThis.CustomEvent = originalCustomEvent;
  }
}

test('getSettings returns defaults when storage is empty or invalid', () => {
  withBrowserGlobals(({ localStorage }) => {
    assert.deepEqual(getSettings(), DEFAULT_SETTINGS);

    localStorage.setItem('nonsteam-badges-settings', '{bad json');
    assert.deepEqual(getSettings(), DEFAULT_SETTINGS);
  });
});

test('getSettings merges saved partial settings over defaults', () => {
  withBrowserGlobals(({ localStorage }) => {
    localStorage.setItem(
      'nonsteam-badges-settings',
      JSON.stringify({
        libraryPosition: BadgePosition.TOP_LEFT,
        showSteamStoreButton: false,
        disableBadges: true,
      }),
    );

    assert.deepEqual(getSettings(), {
      ...DEFAULT_SETTINGS,
      libraryPosition: BadgePosition.TOP_LEFT,
      showSteamStoreButton: false,
      disableBadges: true,
    });
  });
});

test('saveSettings persists settings and dispatches the settings-changed event', () => {
  withBrowserGlobals(({ localStorage, events }) => {
    const settings = {
      ...DEFAULT_SETTINGS,
      detailsPosition: BadgePosition.BOTTOM_LEFT,
      addBadgesToAllNonSteamGames: false,
    };

    saveSettings(settings);

    assert.deepEqual(
      JSON.parse(localStorage.getItem('nonsteam-badges-settings')),
      settings,
    );
    assert.equal(events.length, 1);
    assert.equal(events[0].type, SETTINGS_CHANGED_EVENT);
    assert.deepEqual(events[0].detail, settings);
  });
});

test('SupportedStores includes rockstar for frontend collection overrides', () => {
  assert.equal(SupportedStores.ROCKSTAR, 'rockstar');
});
