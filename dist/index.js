"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Base_1 = __importDefault(require("./src/Base"));
const Brainly1 = async (query, count = 5, lang) => {
    return await Base_1.default(query, count, lang);
};
module.exports = Brainly1;
