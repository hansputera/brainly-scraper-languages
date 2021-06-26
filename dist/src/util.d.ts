import type { LanguageList } from "./types";
export default class Util {
    static clearContent(text: string): string;
    static resolveWorkName(lang: LanguageList): "tugas" | "question" | "zadanie" | "tarefa" | "tarea" | "gorev" | "tema" | "task";
}
