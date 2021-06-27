"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BrainlyError extends Error {
    constructor(message) {
        super(message);
        this.name = "BrainlyError";
    }
}
exports.default = BrainlyError;