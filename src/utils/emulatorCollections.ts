const EMULATOR_COLLECTION_PATTERNS: Array<[string, RegExp]> = [
  ["retroarch", /\bretroarch\b/i],
  ["dolphin", /\bdolphin(?:-emu)?\b/i],
  ["pcsx2", /\bpcsx2(?:-qt)?\b/i],
  ["rpcs3", /\brpcs3\b/i],
  ["xenia", /\bxenia(?:[_-]canary)?\b/i],
  ["xemu", /\bxemu\b/i],
];

export function getCollectionEmulator(name: string): string | null {
  return EMULATOR_COLLECTION_PATTERNS.find(([, pattern]) => pattern.test(name))?.[0] ?? null;
}
