import globals from "globals";
import { parser } from "@typescript-eslint/parser";
import { configs as tsConfigs } from "@typescript-eslint/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";

import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";

const currentGlobals = {
  ...globals.serviceworker,
  ...globals.browser,
  ...globals.vitest,
  ...globals.node
};

export default defineConfig([
    globalIgnores(["dist", "node_modules", "eslint.config.cjs", "vite.config.ts"]), // Ignore files and folders

    // JS files
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        js.configs.recommended,
        tsConfigs.recommended,
        reactHooks.configs['recommended-latest'],
        reactRefresh.configs.vite,
      ],
      languageOptions: {
        parser,
        globals: currentGlobals,
        parserOptions: {
          project: "./tsconfig.json",
          ecmaVersion: "latest",
          sourceType: "module"
        }
      }
    },
    {
      plugins: {
        "react-refresh": reactRefresh,
        "react-hooks": reactHooks,
        "jsx-a11y": jsxA11y,
      },
      // Rule enables & overrides
      rules: {
        "react/react-in-jsx-scope": "off", // ESLint: 'React' must be in scope when using JSX (react/react-in-js-scope)
        "@typescript-eslint/consistent-type-imports": "error",
        "react-hooks/exhaustive-deps": [
          "error", // Checks effect dependencies
          {
            additionalHooks: "(useOnMount)"
          }
        ],
        "react-refresh/only-export-components": "error"
      }
    },

    // Other file types
    { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
    { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc", extends: ["json/recommended"] },
    { files: ["**/*.json5"], plugins: { json }, language: "json/json5", extends: ["json/recommended"] },
    { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm", extends: ["markdown/recommended"] }, // GitHub Flavored Markdown
    { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] }
  ]);