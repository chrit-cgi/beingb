import nextConfig from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextConfig,
  ...nextTypescript,
  { ignores: ["public/sw.js", "public/workbox-*.js", "public/worker-*.js"] },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];

export default config;
