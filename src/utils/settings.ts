import { log } from "src/utils/logger";
import {
  DEFAULT_SETTINGS,
  PluginSettings,
  SETTINGS_CHANGED_EVENT,
} from "../types/settings";

const context = "settings";

const SETTINGS_KEY = "nonsteam-badges-settings";

export function getSettings(): PluginSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (e) {
    log(context, "Error loading settings:", "error");
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: PluginSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    log(context, `Settings saved: ${JSON.stringify(settings)}`);

    window.dispatchEvent(
      new CustomEvent(SETTINGS_CHANGED_EVENT, {
        detail: settings,
      }),
    );
  } catch (e) {
    log(context, "Error saving settings:", "error");
  }
}
