import test from 'node:test';
import assert from 'node:assert/strict';
import { rollup } from 'rollup';

// Bundle the compiled module so Node can load its JSON import and so the
// Decky bridge is replaced without requiring a running Steam client.
const bundle = await rollup({
  input: '.test-dist/utils/storeCache.js',
  plugins: [{
    name: 'test-decky-and-json',
    resolveId(id) {
      if (id === '@decky/api') return '\0test-decky-api';
    },
    load(id) {
      if (id === '\0test-decky-api') {
        return 'export function call() { throw new Error("Unexpected Decky call"); }';
      }
    },
    transform(code, id) {
      if (id.endsWith('.json')) return `export default ${code};`;
    },
  }],
});
let getStore;
try {
  const { output } = await bundle.generate({ format: 'es' });
  ({ getStore } = await import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString('base64')}`));
} finally {
  await bundle.close();
}

for (const [collection, expected] of [['GOG 2026', 'gog'], ['Epic 2025', 'epic']]) {
  test(`numbered storefront collection ${collection} selects its storefront`, () => {
    const originalWindow = globalThis.window;
    globalThis.window = {
      collectionStore: {
        userCollections: [{ displayName: collection, apps: new Set(['3000000000']) }],
      },
    };
    try {
      assert.equal(getStore('3000000000'), expected);
    } finally {
      globalThis.window = originalWindow;
    }
  });
}

for (const [collection, expected] of [
  ['Xbox 360', null],
  ['Xbox360', null],
  ['Xbox Game Pass', 'xbox-game-pass'],
  ['Xbox', 'xbox'],
]) {
  test(`Xbox console collection ${collection} maps to ${expected}`, () => {
    const originalWindow = globalThis.window;
    globalThis.window = {
      collectionStore: {
        userCollections: [{ displayName: collection, apps: new Set(['3000000000']) }],
      },
    };
    try {
      assert.equal(getStore('3000000000'), expected);
    } finally {
      globalThis.window = originalWindow;
    }
  });
}
