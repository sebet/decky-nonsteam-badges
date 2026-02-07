import { GameStoreContext } from "src/types/store";

const DEBUG_MODE = process.env.DEBUG_MODE === "true";

export function log(
  context: GameStoreContext | string,
  message: string,
  level: "log" | "warn" | "error" = "log",
) {
  if (!DEBUG_MODE) return;
  console[level](`[Non-Steam Badges][${context}] ${message}`);
}
