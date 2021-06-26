module.exports = {
    "roots": [
        "./src"
    ],
    "testMatch": [
        "**/tests/**/*.+(ts|js)"
    ],
    "transform": {
        "^.+\\.(ts|js)$": "ts-jest"
    },
    "testEnvironment": "node"
};