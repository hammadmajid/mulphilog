import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Test environment
    environment: "node",

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.config.{js,ts}",
        "**/*.d.ts",
        "test/**",
        ".husky/**",
        "vendor/**",
      ],
      // Enforce 75% coverage threshold
      thresholds: {
        lines: 75,
        functions: 75,
        branches: 75,
        statements: 75,
      },
    },

    // Test file patterns
    include: ["test/**/*.test.ts"],

    // Global test timeout
    testTimeout: 10000,

    // Type checking
    typecheck: {
      enabled: false,
    },
  },
});
