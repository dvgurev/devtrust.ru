import { defineConfig } from "commitlint"

export default defineConfig({
  extends: ["conventionalcommits"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "revert"],
    ],
  },
})