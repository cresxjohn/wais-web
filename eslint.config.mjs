import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Downgrade TypeScript specific rules to warnings for development
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // Downgrade React hooks rules to warnings
      "react-hooks/exhaustive-deps": "warn",

      // Downgrade React specific rules to warnings
      "react/no-unescaped-entities": "warn",

      // Allow console logs in development
      "no-console": "off",

      // More permissive rules for rapid development
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-empty-function": "warn",

      // Allow empty catch blocks with a comment
      "no-empty": ["warn", { allowEmptyCatch: true }],
    },
  },
];

export default eslintConfig;
