import { ReactElement } from "react";
import { DialogButton, Navigation } from "@decky/ui";
import React from "react";
import styles from "./SteamStoreButton.module.css";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { FaSteam } from "react-icons/fa";

interface SteamStoreButtonProps {
  steamAppId: string;
}

export default function SteamStoreButton({
  steamAppId,
}: SteamStoreButtonProps): ReactElement | null {
  return (
    <div>
      <DialogButton
        className={styles.steamStoreButton}
        onClick={() => {
          Navigation.NavigateToExternalWeb(
            `https://store.steampowered.com/app/${steamAppId}`,
          );
        }}
      >
        <div className={styles.container}>
          <FaSteam />
          <LiaExternalLinkAltSolid />
        </div>
      </DialogButton>
    </div>
  );
}
