module.exports = {
    "setupTestFrameworkScriptFile": './jest.setup.js',
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 75,
            "functions": 75,
            "lines": 75,
            "statements": 75
        }
    }
}