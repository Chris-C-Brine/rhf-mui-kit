import globals from "globals";
import parser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { globalIgnores } from "eslint/config";
import tseslint from 'typescript-eslint';

const recommendedRules = tseslint.configs.recommended
  .filter(c => c.rules)
  .map(c => c.rules)
  .reduce((acc, r) => ({...acc, ...r}), {});

import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

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

export default [
    globalIgnores(["dist", "node_modules", "eslint.config.cjs", "eslint.config.js", "tsconfig.json", "vite.config.ts"]), // Ignore files and folders

    // TS source files
    {
      files: ['src/**/*.{ts,tsx}'],
      ignores: ['src/**/*.test.{ts,tsx}'],
      ...js.configs.recommended,
      plugins: {
        "@typescript-eslint": tsPlugin,
        "react-refresh": reactRefresh,
        "react-hooks": reactHooks,
      },
      languageOptions: {
        parser,
        globals: currentGlobals,
        parserOptions: {
          project: "./tsconfig.json",
          ecmaVersion: "latest",
          sourceType: "module"
        }
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
    // TS test files
    {
      files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
      ...js.configs.recommended,
      plugins: {
        "@typescript-eslint": tsPlugin,
        "react-hooks": reactHooks,
      },
      languageOptions: {
        parser,
        globals: currentGlobals,
        parserOptions: {
          project: "./tsconfig.test.json",
          ecmaVersion: "latest",
          sourceType: "module"
        }
      },
      // Rule enables & overrides
      rules: {
        ...recommendedRules,
        "react/react-in-jsx-scope": "off", // ESLint: 'React' must be in scope when using JSX (react/react-in-js-scope)
        "@typescript-eslint/consistent-type-imports": "error",
        "react-hooks/exhaustive-deps": [
          "error", // Checks effect dependencies
          {
            additionalHooks: "(useOnMount)"
          }
        ],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off"
      }
    },

    // Other file types
    { files: ["**/*.json"], plugins: { json }, language: "json/json" },
    { files: ["**/*.jsonc"], plugins: { json }, language: "json/jsonc" },
    { files: ["**/*.json5"], plugins: { json }, language: "json/json5" },
    { files: ["**/*.md"], plugins: { markdown }, language: "markdown/gfm" }, // GitHub Flavored Markdown
    { files: ["**/*.css"], plugins: { css }, language: "css/css" }
];