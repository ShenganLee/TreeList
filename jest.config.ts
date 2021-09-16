/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    roots: ["<rootDir>"],

    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
    ],

    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
};
