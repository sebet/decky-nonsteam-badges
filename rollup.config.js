import deckyPlugin from "@decky/rollup";
import replace from "@rollup/plugin-replace";
import postcss from "rollup-plugin-postcss";
import dotenv from "dotenv";

dotenv.config();

export default deckyPlugin({
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.DEBUG_MODE": JSON.stringify(
        process.env.DEBUG_MODE || "false",
      ),
      preventAssignment: true,
    }),
    postcss({
      modules: true,
      extract: false,
      inject: (cssVariableName) =>
        `import { injectStyle } from "../utils/styleInjector";\ninjectStyle(${cssVariableName});`,
    }),
  ],
});
