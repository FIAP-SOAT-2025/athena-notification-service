module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/config/*.js"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ]
};
