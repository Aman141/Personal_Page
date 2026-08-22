import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat config, so these are spread in
// directly. Loading them through @eslint/eslintrc's FlatCompat — which is what
// `next lint` used to do for us — now throws a circular-reference error while
// validating the schema.
const eslintConfig = [
  // `next lint` used to supply these implicitly. Running the ESLint CLI
  // directly (see the "lint" script) means declaring them here, or ESLint
  // walks build output and reports thousands of errors from generated code.
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
