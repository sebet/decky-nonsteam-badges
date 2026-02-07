import {
  DropdownItem,
  PanelSection,
  PanelSectionRow,
  ToggleField,
} from "@decky/ui";
import React, { useEffect, useRef, useState } from "react";
import {
  BadgePosition,
  DEFAULT_SETTINGS,
  PluginSettings,
} from "../types/settings";
import { saveSettings } from "../utils/settings";
import useSettings from "src/hooks/useSettings";

type UpdateSettingProps =
  | {
      key: keyof Omit<PluginSettings, "addBadgesToAllNonSteamGames">;
      value: BadgePosition;
    }
  | {
      key: "showSteamStoreButton";
      value: boolean;
    };

const badgePositions = [
  { label: "None", data: BadgePosition.NONE },
  { label: "Top Left", data: BadgePosition.TOP_LEFT },
  { label: "Top Right", data: BadgePosition.TOP_RIGHT },
  { label: "Bottom Left", data: BadgePosition.BOTTOM_LEFT },
  { label: "Bottom Right", data: BadgePosition.BOTTOM_RIGHT },
];

const badgeDetailsPositions = [
  { label: "None", data: BadgePosition.NONE },
  { label: "Top Left", data: BadgePosition.TOP_LEFT },
  { label: "Top Right", data: BadgePosition.TOP_RIGHT },
];

const Settings = () => {
  const topRef = useRef<HTMLDivElement>(null);

  const storedSettings = useSettings();

  useEffect(() => {
    topRef.current?.focus();
  }, []);

  const [settings, setSettings] = useState<PluginSettings>(storedSettings);

  const updateSetting = ({ key, value }: UpdateSettingProps) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  return (
    <div>
      <div ref={topRef} tabIndex={-1} /> {/* Focus anchor */}
      <PanelSection title="Badge Positions">
        <PanelSectionRow>
          <DropdownItem
            label="Home"
            menuLabel="Home Screen Position"
            description="Position of the badge on the Home screen"
            selectedOption={
              settings.homePosition ?? DEFAULT_SETTINGS.homePosition
            }
            rgOptions={badgePositions}
            onChange={(option: any) => {
              updateSetting({ key: "homePosition", value: option.data });
            }}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <DropdownItem
            label="Library"
            menuLabel="Library Position"
            description="Position of the badge in the Library grid"
            selectedOption={
              settings.libraryPosition ?? DEFAULT_SETTINGS.libraryPosition
            }
            rgOptions={badgePositions}
            onChange={(option: any) => {
              updateSetting({ key: "libraryPosition", value: option.data });
            }}
          />
        </PanelSectionRow>

        <PanelSectionRow>
          <DropdownItem
            label="Details"
            menuLabel="Game Details Position"
            description="Position of the badge on the Details page"
            selectedOption={
              settings.detailsPosition ?? DEFAULT_SETTINGS.detailsPosition
            }
            rgOptions={badgeDetailsPositions}
            onChange={(option: any) => {
              updateSetting({ key: "detailsPosition", value: option.data });
            }}
          />
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title="Steam Store Button">
        <PanelSectionRow>
          <ToggleField
            label="Steam Store Button"
            description="Show Steam store button on game details page, when available"
            checked={settings.showSteamStoreButton}
            onChange={(checked: boolean) => {
              updateSetting({
                key: "showSteamStoreButton",
                value: checked,
              });
            }}
          />
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
};

export default Settings;
