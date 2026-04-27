import { ReactNode } from "react";
import GameDetailsBadge from "../components/GameDetailsBadge";
import {
  afterPatch,
  findInReactTree,
  createReactTreePatcher,
  appDetailsClasses,
} from "@decky/ui";
import { log } from "src/utils/logger";
import React from "react";
import { GameStoreContext } from "src/types/store";

const context = GameStoreContext.DETAILS;
let cleanupRenderPatch: (() => void) | null = null;
let patchedRouteProps: any = null;

export function cleanupGameDetailsPatches(): void {
  if (cleanupRenderPatch) {
    cleanupRenderPatch();
    cleanupRenderPatch = null;
  }
  patchedRouteProps = null;
}

/**
 * Patch game details page (React-based).
 */
export const patchGameDetails = (tree: any) => {
  const routeProps = findInReactTree(tree, (x: any) => x?.renderFunc);

  if (routeProps && routeProps !== patchedRouteProps) {
    cleanupGameDetailsPatches();

    const patchHandler = createReactTreePatcher(
      [
        (tree: any) =>
          findInReactTree(tree, (x: any) => x?.props?.children?.props?.overview)
            ?.props?.children,
      ],
      (_: Array<Record<string, unknown>>, ret?: ReactNode) => {
        const container = findInReactTree(
          ret,
          (x: any) =>
            Array.isArray(x?.props?.children) &&
            x?.props?.className?.includes(appDetailsClasses.InnerContainer),
        );

        if (typeof container !== "object") {
          log(context, "Patch FAILED to find container in 'ret'.");
          return ret;
        }

        container.props.children.splice(1, 0, <GameDetailsBadge />);

        return ret;
      },
    );

    const unpatch = afterPatch(routeProps, "renderFunc", patchHandler);
    cleanupRenderPatch =
      typeof unpatch === "function" ? unpatch : null;
    patchedRouteProps = routeProps;
  }

  return tree;
};
