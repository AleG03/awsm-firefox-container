module.exports = {
  sourceDir: ".",
  artifactsDir: "web-ext-artifacts",
  sign: {
    channel: "listed",
    amoMetadata: "amo-metadata.json",
    approvalTimeout: 0,
  },
  ignoreFiles: [
    "node_modules",
    "web-ext-artifacts",
    "package.json",
    "package-lock.json",
    "web-ext-config.cjs",
    ".github",
    ".gitignore",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "README.md",
    "LICENSE",
    "amo-metadata.json",
  ],
};
