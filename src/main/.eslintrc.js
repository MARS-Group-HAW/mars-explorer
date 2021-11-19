module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "airbnb-typescript", "prettier"],
  rules: {
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "import/no-extraneous-dependencies": "off",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: __dirname + "../../../tsconfig.json",
    tsconfigRootDir: "./",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
};
