module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb-typescript",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: __dirname + "../../../tsconfig.json",
    tsconfigRootDir: "./",
  },
  rules: {
    "react/jsx-props-no-spreading": "off",
  },
  plugins: ["react"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
