"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../../index"));
it("should return information about question and answer", (done) => {
    const brain = new index_1.default("id");
    brain.search("ru", "Pythagoras").then((results) => {
        console.log(results[0].question);
        expect(results).toBeDefined();
        done();
    }).catch(done);
});