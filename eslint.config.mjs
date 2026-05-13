import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["src/components/ui/**", "src/components/figma/**"],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
