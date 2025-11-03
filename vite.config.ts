import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RhfMuiKit",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@mui/material",
        "react-hook-form",
        "@emotion/styled",
        "@emotion/react",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "@mui/material": "MaterialUI",
          "react-hook-form": "ReactHookForm",
          "@emotion/styled": "emotionStyled",
          "@emotion/react": "emotionReact",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "istanbul"
    },
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
});
