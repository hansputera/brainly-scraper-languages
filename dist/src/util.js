"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    static clearContent(text) {
        const regex = new RegExp(/[[(?\/)]+tex]/gi);
        return text.replace(/(<br?\s?\/>)/ig, " \n").replace(/(<([^>]+)>)/ig, "").replace(regex, "").replace(/&gt;/gi, "");
    }
}
exports.default = Util;
