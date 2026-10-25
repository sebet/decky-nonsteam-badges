import { readFile } from "node:fs/promises";

const readVersion = async (path) => {
  const data = JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));
  if (typeof data.version !== "string" || data.version.length === 0) {
    throw new Error(`${path} is missing a non-empty version`);
  }
  return data.version;
};

const [pluginVersion, packageVersion] = await Promise.all([
  readVersion("plugin.json"),
  readVersion("package.json"),
]);

if (pluginVersion !== packageVersion) {
  throw new Error(
    `Version mismatch: plugin.json=${pluginVersion}, package.json=${packageVersion}`,
  );
}

if (process.env.GITHUB_REF_TYPE === "tag") {
  const tagVersion = process.env.GITHUB_REF_NAME.replace(/^v/, "");
  if (pluginVersion !== tagVersion) {
    throw new Error(
      `Release tag v${tagVersion} does not match plugin/package version ${pluginVersion}`,
    );
  }
}

console.log(`Versions match: ${pluginVersion}`);
