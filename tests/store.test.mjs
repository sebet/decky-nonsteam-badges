import test from 'node:test';
import assert from 'node:assert/strict';
import { isNonSteamApp, sanitizedGameStoreName } from '../.test-dist/utils/store.js';
import { GameStoreName } from '../.test-dist/types/store.js';

test('sanitizedGameStoreName accepts known stores case-insensitively', () => {
  assert.equal(sanitizedGameStoreName('GOG'), GameStoreName.GOG);
  assert.equal(sanitizedGameStoreName('Epic'), GameStoreName.EPIC);
  assert.equal(sanitizedGameStoreName('amazon'), GameStoreName.AMAZON);
  assert.equal(sanitizedGameStoreName('UBISOFT'), GameStoreName.UBISOFT);
  assert.equal(sanitizedGameStoreName('Xbox'), GameStoreName.XBOX);
  assert.equal(sanitizedGameStoreName('EA'), GameStoreName.EA);
  assert.equal(sanitizedGameStoreName('default'), GameStoreName.DEFAULT);
});

test('sanitizedGameStoreName returns undefined for unknown or empty values', () => {
  assert.equal(sanitizedGameStoreName('steam'), undefined);
  assert.equal(sanitizedGameStoreName(''), undefined);
  assert.equal(sanitizedGameStoreName(undefined), undefined);
});

test('isNonSteamApp separates likely Steam apps from generated non-Steam ids', () => {
  assert.equal(isNonSteamApp('730'), false);
  assert.equal(isNonSteamApp(6_000_000), false);
  assert.equal(isNonSteamApp(10_000_000), false);
  assert.equal(isNonSteamApp(10_000_001), true);
  assert.equal(isNonSteamApp('4294967295'), true);
  assert.equal(isNonSteamApp(-1_000_001), true);
  assert.equal(isNonSteamApp('not-a-number'), false);
});
