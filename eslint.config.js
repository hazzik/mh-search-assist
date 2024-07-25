import config from "@antfu/eslint-config";
import globals from "globals";

export default config({
  languageOptions: {
    globals: globals.mocha,
  },
  rules: {
    "style/quotes": ["error", "double"],
    "style/semi": ["error", "always"],
    "regexp/no-obscure-range": "off",
    "regexp/no-super-linear-backtracking": "off",
  },
});
