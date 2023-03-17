import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      plugins: [["@swc/plugin-emotion", {}]],
    }),
    babel({
      babelConfig: {
        presets: [
          "@babel/preset-react",
          "@babel/preset-typescript",
          "@emotion/babel-preset-css-prop",
        ],
        plugins: [
          "@babel/plugin-transform-runtime",
          "@babel/plugin-proposal-optional-chaining",
          "@babel/plugin-proposal-nullish-coalescing-operator",
          [
            "module-resolver",
            {
              root: ["./src"],
              alias: {
                server: "./server",
                assets: "./src/assets",
                pages: "./src/pages",
              },
            },
          ],
          [
            "@emotion",
            {
              sourceMap: true,
              autoLabel: "dev-only",
              labelFormat: "[local]",
              cssPropOptimization: true,
            },
          ],
        ],
      },
    }),
    tsconfigPaths(),
  ],
});
