import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "istanbul",
    },
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
  server: {
    open: true,
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RhfMuiKit",
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@mui/material",
        "react-hook-form",
        "react-hook-form-mui",
        "@emotion/styled",
        "@emotion/react",
        "lodash",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "@mui/material": "MaterialUI",
          "react-hook-form": "ReactHookForm",
          "react-hook-form-mui": "ReactHookFormMui",
          "@emotion/styled": "emotionStyled",
          "@emotion/react": "emotionReact",
          "lodash": "_",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: false,
  },
});
