module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/test"],
  testMatch: ["**/*.order-import-consumer.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
