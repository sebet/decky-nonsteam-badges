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

/**
 * Patch game details page (React-based).
 */
export const patchGameDetails = (tree: any) => {
  const routeProps = findInReactTree(tree, (x: any) => x?.renderFunc);

  if (routeProps) {
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

    afterPatch(routeProps, "renderFunc", patchHandler);
  }

  return tree;
};
