module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.sample-lambda.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
