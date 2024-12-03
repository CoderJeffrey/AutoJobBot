import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }, // Merging both browser and node globals
      ecmaVersion: 2020, // Specify the ECMAScript version
      sourceType: "module", // Specify the source type, e.g., "module" for ES modules
    },
  },
  pluginJs.configs.recommended,
];