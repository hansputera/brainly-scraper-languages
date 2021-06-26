"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    static clearContent(text) {
        const regex = new RegExp(/[[(?\/)]+tex]/gi);
        return text.replace(/(<br?\s?\/>)/ig, " \n").replace(/(<([^>]+)>)/ig, "").replace(regex, "").replace(/&gt;/gi, "");
    }
    static resolveWorkName(lang) {
        switch (lang) {
            case "id":
                return "tugas";
            case "us":
            case "hi":
            case "ph":
                return "question";
            case "pl":
                return "zadanie";
            case "pt":
                return "tarefa";
            case "es":
                return "tarea";
            case "tr":
                return "gorev";
            case "ro":
                return "tema";
            case "ru":
                return "task";
            default:
                return "question";
        }
    }
}
exports.default = Util;
