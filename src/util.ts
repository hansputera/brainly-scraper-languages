export default class Util {
    static clearContent(text: string) {
        const regex = new RegExp(/[[(?\/)]+tex]/gi);
        return text.replace(/(<br?\s?\/>)/ig, " \n").replace(/(<([^>]+)>)/ig, "").replace(regex, "").replace(/&gt;/gi, "");
    }
}