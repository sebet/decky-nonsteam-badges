import { log } from "src/utils/logger";

const PLUGIN_ID = "nonsteam-badges-decky";
const context = "styleInjector";

export let loadedCSS: string = "";

export function injectStyle(css: string): void {
  if (!css) return;
  loadedCSS += css;

  // Inject into main window
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // Store globally for other contexts if needed
  (window as any).__NONSTEAM_BADGES_CSS =
    ((window as any).__NONSTEAM_BADGES_CSS || "") + css;
}

export function injectStyleIntoWindow(targetWindow: Window): void {
  const css = loadedCSS || (window as any).__NONSTEAM_BADGES_CSS;
  if (!css || !targetWindow || !targetWindow.document) return;

  // Check if already injected
  if (targetWindow.document.querySelector(`style[data-plugin="${PLUGIN_ID}"]`))
    return;

  const style = targetWindow.document.createElement("style");
  style.setAttribute("type", "text/css");
  style.setAttribute("data-plugin", PLUGIN_ID);
  style.innerHTML = css;
  targetWindow.document.head.appendChild(style);
  log(context, "Injected styles into BigPicture window");
}

export function removeStyleFromWindow(targetWindow: Window): void {
  if (!targetWindow || !targetWindow.document) return;

  const style = targetWindow.document.querySelector(
    `style[data-plugin="${PLUGIN_ID}"]`,
  );
  if (style) {
    style.remove();
    log(context, "Removed styles from BigPicture window");
  }
}
