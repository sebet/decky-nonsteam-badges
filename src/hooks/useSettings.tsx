import { useEffect, useState } from "react";
import { PluginSettings, SETTINGS_CHANGED_EVENT } from "src/types/settings";
import { getSettings } from "src/utils/settings";
import { log } from "src/utils/logger";

const context = "useSettings";

export default function useSettings(): PluginSettings {
  const [settings, setSettings] = useState<PluginSettings>(getSettings());

  useEffect(() => {
    const handleChange = (event: Event) => {
      if (event instanceof CustomEvent && event.detail) {
        log(
          context,
          "Settings changed (custom event): " + JSON.stringify(event.detail),
        );
        setSettings(event.detail);
      } else {
        log(
          context,
          "Settings changed (fallback): " + JSON.stringify(getSettings()),
        );
        setSettings(getSettings());
      }
    };

    window.addEventListener(SETTINGS_CHANGED_EVENT, handleChange);
    return () =>
      window.removeEventListener(SETTINGS_CHANGED_EVENT, handleChange);
  }, []);

  return settings;
}
